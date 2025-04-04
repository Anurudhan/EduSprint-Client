import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { contentType, IMessage } from '../../types/IMessageType';
import { IChat, SignupFormData } from '../../types';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { chatApi } from '../../API/chatApi';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import LoadingSpinner from '../common/loadingSpinner';
import { SocketContext } from '../../context/SocketProvider';

export const UserChat: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<IChat[] | null>(null);
  const [users, setUsers] = useState<SignupFormData[]>([]);
  // Keep track of messages we've sent locally
  // const [localMessageIds, setLocalMessageIds] = useState<Set<string>>(new Set());
  
  const location = useLocation();
  const currentUser = useAppSelector((state: RootState) => state.user.data);
  
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  
  useEffect(() => {
    if (socketContext && selectedChatId) {
      socketContext.setCurrentRoom(selectedChatId);
    }
  }, [socketContext, selectedChatId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?._id) return;
      try {
        setLoading(true);
        const fetchedChats = await chatApi.fetchChats(currentUser._id);
        
        const normalizedChats = (fetchedChats || []).map(chat => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          lastMessage: chat.lastMessage 
            ? { 
                ...chat.lastMessage, 
                timestamp: chat.lastMessage.timestamp ? new Date(chat.lastMessage.timestamp) : new Date(chat.updatedAt) 
              }
            : null,
        }));
        
        setChats(normalizedChats);
        
        const participantIds = normalizedChats
          .flatMap(chat => chat.participants)
          .filter(id => id !== currentUser._id);
        const Ids = participantIds.join(',');
        const usersResponse = await chatApi.fetchUsers(Ids);
        setUsers(usersResponse || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser?._id]);

  // Handle WebSocket events
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    const messageHandler = (message: IMessage) => {
      console.log("Received message via socket:", message);
      
      // Check if this is a message we sent ourselves
      if (message.sender === currentUser?._id) {
        // Check if we already have this message in our local state
        setChatMessages(prev => {
          // Look for a message with matching content and sender
          const existingMessageIndex = prev.findIndex(msg => 
            msg.content === message.content && 
            msg.sender === message.sender &&
            msg.contentType === message.contentType &&
            Math.abs(
              new Date(msg.createdAt || Date.now()).getTime() - 
              new Date(message.createdAt || Date.now()).getTime()
            ) < 10000
          );

          if (existingMessageIndex !== -1) {
            // Update the existing message with server data (e.g., to get the real ID)
            const updatedMessages = [...prev];
            updatedMessages[existingMessageIndex] = {
              ...message,
              createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
              updatedAt: message.updatedAt ? new Date(message.updatedAt) : new Date()
            };
            return updatedMessages;
          } else {
            // If this is not a duplicate message, add it to the chat
            return [...prev, {
              ...message,
              createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
              updatedAt: message.updatedAt ? new Date(message.updatedAt) : new Date()
            }];
          }
        });
      } else {
        // Messages from others should always be added (they won't be duplicates)
        setChatMessages(prev => [...prev, {
          ...message,
          createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
          updatedAt: message.updatedAt ? new Date(message.updatedAt) : new Date()
        }]);
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
    };
  }, [socket, selectedChatId, currentUser?._id]);

  useEffect(() => {
    const receiver = location.state?.receiver;
    if (receiver && currentUser?._id) {
      const createAndSelectChat = async () => {
        try {
          const existingChat = chats?.find(chat =>
            chat.chatType === 'individual' &&
            chat.participants.includes(currentUser._id!) &&
            chat.participants.includes(receiver._id!)
          );

          if (existingChat?._id) {
            setSelectedChatId(existingChat._id);
          } else {
            const newChat = await chatApi.createChat([currentUser._id as string, receiver._id!]);
            setChats(prev => (prev ? [...prev, newChat] : [newChat]));
            if (newChat._id) {
              setSelectedChatId(newChat._id);
            }
          }
        } catch (error) {
          console.error('Failed to create chat:', error);
        }
      };
      createAndSelectChat();
    }
  }, [location.state, currentUser?._id, chats]);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedChatId) {
        try {
          const fetchedMessages = await chatApi.fetchMessages(selectedChatId);
          // Reset local message IDs when changing chats
          // setLocalMessageIds(new Set());
          // Normalize dates for consistency
          const messagesWithDates = (fetchedMessages || []).map(msg => ({
            ...msg,
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
            updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : new Date()
          }));
          setChatMessages(messagesWithDates);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          setChatMessages([]);
        }
      } else {
        setChatMessages([]);
      }
    };
    loadMessages();
  }, [selectedChatId]);

  const handleSendMessage = async (content: string, contentTypeValue: contentType, replyToId?: string, fileUrl?: string) => {
    if (!selectedChatId || !currentUser?._id || !socket) return;
    
    // Generate a unique client-side ID
    const clientId = `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a new message object
    const newMessage: IMessage = {
      _id: clientId,
      chatId: selectedChatId,
      sender: currentUser._id,
      content,
      contentType: contentTypeValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      isEdited: false,
      isDeleted: false,
      readBy: [{ userId: currentUser._id, readAt: new Date() }],
      reactions: [],
      replyTo: replyToId,
      fileUrl,
    };

    // Track that we've added this message locally
    // setLocalMessageIds(prev => {
    //   const updated = new Set(prev);
    //   updated.add(clientId);
    //   return updated;
    // });

    // Update UI immediately
    setChatMessages(prev => [...prev, newMessage]);

    try {
      // Emit to socket
      socket.emit("send-message", {
        ...newMessage,
        roomId: selectedChatId
      });

      // Also save to database directly
      await chatApi.sendMessage({
        ...newMessage,
        _id: undefined // Let the server assign the real ID
      });
      
      // The socket will handle updating this message with server data
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the failed message from the UI
      setChatMessages(prev => prev.filter(msg => msg._id !== clientId));
      
      // Remove from tracked local messages
      // setLocalMessageIds(prev => {
      //   const updated = new Set(prev);
      //   updated.delete(clientId);
      //   return updated;
      // });
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleBackToChatList = () => {
    setSelectedChatId(null);
  };

  const selectedChat: IChat | null = selectedChatId
    ? (chats?.find(chat => chat._id === selectedChatId) || null)
    : null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex overflow-hidden">
        <div
          className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${
            isMobile && selectedChatId ? 'hidden' : 'block'
          }`}
        >
          <ChatList
            chats={chats || []}
            users={users}
            currentUser={currentUser}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onlineUsers={socketContext?.onlineUsers || []}
          />
        </div>
        <div
          className={`flex-grow ${
            isMobile && !selectedChatId ? 'hidden' : 'block'
          }`}
        >
          <ChatBox
            chat={selectedChat}
            messages={chatMessages}
            users={users}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={isMobile ? handleBackToChatList : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default UserChat;