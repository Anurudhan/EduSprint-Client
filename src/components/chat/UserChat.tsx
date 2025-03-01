import { useContext, useEffect, useState, useCallback} from 'react';
import { toast } from 'react-toastify';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { ChatEntity, ChatStatus, ChatType, IndividualChatEntity, SubscriptionType, UIChatEntity } from '../../types/IChat';
import { contentType, MessageEntity } from '../../types/IMessageType';
import { Role, SignupFormData } from '../../types';
import { SocketContext } from '../../context/SocketProvider';
import { 
  createMessageAction, 
  getMessagesByChatIdAction, 
  updateUnreadCount 
} from '../../redux/store/actions/chat';
import { useLocation } from 'react-router-dom';
import { commonRequest, URL } from '../../common/api';
import { config } from '../../common/config';
import { useChatProcessing } from '../../context/useChatProcessing';

interface MessageSeenProps {
  messageId: string;
  userId: string;
}

function UserChat() {
  const dispatch = useAppDispatch();
  const { data: userData } = useAppSelector((state: RootState) => state.user);
  const location = useLocation();
  const { receiver } = (location.state) || {};
  
  // Use a ref to track if initial setup has been done
  const { receiverProcessedRef } = useChatProcessing();

  // State
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<UIChatEntity | null>(null);
  const [chats, setChats] = useState<ChatEntity[] | null>();
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [chatListLoading, setChatListLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const { socket, onlineUsers, setOnlineUsers } = useContext(SocketContext) || {};
  
  // Memoize this function to prevent recreating it on each render
  const createPrivateRoomId = useCallback((id1: string, id2: string) => 
    id1 > id2 ? `${id1}_${id2}` : `${id2}_${id1}`,
  []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewReceiver = useCallback(async () => {
    // Only process the receiver once and if we have necessary data
    if (!receiver || !userData?._id || isCreatingChat || receiverProcessedRef.current) return;
    
    receiverProcessedRef.current = true; // Mark as processed to avoid duplicate processing
    
    try {
      setIsCreatingChat(true);
      setChatListLoading(true);
  
     

      
        // Create new chat if doesn't exist
        const newChat: IndividualChatEntity = {
          type: ChatType.individual,
          status: ChatStatus.active,
          participants: [userData._id, receiver._id], 
          lastSeen: new Date().toISOString(),
          unreadCounts: 0,
          subscriptionType: SubscriptionType.basic, 
          createdAt: new Date().toISOString()
        };
        
        const savedChat = await commonRequest<IndividualChatEntity>(
          "POST",
          `${URL}/chat`,
          newChat,
          config
        );
  
      
      // Create room ID first so it can be used in the UI chat object
      const newRoomId = createPrivateRoomId(userData._id, receiver._id);
      setRoomId(newRoomId);
      socket?.emit("join-room", { roomId: newRoomId });
      
      // Create a properly typed UI chat entity
      const uiChat: UIChatEntity = {
        ...savedChat.data,
        chatId: savedChat.data._id as string,
        name: receiver.userName,
        receiverId: receiver._id,
        isOnline: onlineUsers?.some(user => user.userId === receiver._id) ? true : false,
        roomId: newRoomId,
        // Add the missing properties
        avatar: receiver.profile.avatar || '', // Using receiver's avatar or empty string as fallback
        role: receiver.role || 'user' // Using receiver's role or 'user' as fallback
      };
      
      // Set current chat (only once)
      setCurrentChat(uiChat);
      
      // Add the new chat to the list if not already there
      setChats(prevChats => {
        if (!prevChats) return [uiChat] as unknown as ChatEntity[];
        
        // Check if chat already exists in the list
        const chatExists = prevChats.some(chat => 
          'chatId' in chat && chat.chatId === uiChat.chatId
        );
        
        if (chatExists) return prevChats;
        return [...prevChats, uiChat] as unknown as ChatEntity[];
      });
  
      // Automatically select the new chat
      setSelectedUserId(receiver._id);
  
      // Initialize message list for new chat
      dispatch(getMessagesByChatIdAction(uiChat.chatId))
        .then((response) => {
          if (response.payload && response.payload.data) {
            setMessages(response.payload.data);
          }
        });
  
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to create new chat");
    } finally {
      setChatListLoading(false);
      setIsCreatingChat(false);
    }
  }, [receiver, userData, socket, onlineUsers, isCreatingChat, createPrivateRoomId, dispatch,receiverProcessedRef]);

  // Fetch initial chats - only run once on component mount
  const fetchChatsByUserId = useCallback(async () => {
    if (!userData?._id ) return;
  
    setChatListLoading(true);
    
    try {
      const response = await commonRequest<IndividualChatEntity[]>(
        "GET",
        `${URL}/chat/user?userId=${userData._id}`, 
        "",
        config
      );
      
      const chatDataMap = new Map();
      const unreadCountsMap: Record<string, number> = {};

      response.data.forEach((chat: IndividualChatEntity) => {
        const participant = chat?.participants.find(
          (participantId: SignupFormData | string) => {
            if (typeof participantId !== "string") return participantId._id !== userData._id
            return false
          }
        );
        
        if (participant && typeof participant !== "string" && !chatDataMap.has(participant._id) && chat._id) {
          chatDataMap.set(participant?._id, {
            ...participant,
            name: participant.userName,
            chatId: chat._id,
            receiverId: participant._id,
            createdAt: chat.createdAt || Date.now(),
            lastSeen: chat?.lastSeen,
            unreadCounts: chat.unreadCounts,
            subscriptionType: chat.subscriptionType,
            avatar: participant?.profile?.avatar || '', 
            role: participant.role || 'user'
          });
          unreadCountsMap[chat?._id] = chat.unreadCounts || 0;
        }
      });

      setChats(Array.from(chatDataMap.values()));
      setUnreadCounts(unreadCountsMap);
    } finally {
      setChatListLoading(false);
    }
  }, [userData?._id]);

  // Socket event handlers
  const handleReceiveMessage = useCallback((message: MessageEntity) => {
    setMessages(prevMessages => [...prevMessages, message]);
    
    if (message.senderId !== userData?._id) {
      const newCount = (unreadCounts[message.chatId] || 0) + 1;
    
      setUnreadCounts(prevCount => ({
        ...prevCount,
        [message.chatId]: newCount,
      }));
      
      dispatch(updateUnreadCount({
        _id: message.chatId,
        unreadCount: newCount,
      }));
    }
    
    setChats(prevChats => {
      if (!prevChats) return []; // Handle null case
      
      const updatedChats = prevChats.map(chat =>
        chat._id === message.chatId ? { ...chat, lastMessage: message } : chat
      );
    
      return updatedChats.sort((a, b) => {
        const aDate = new Date(a.lastMessage?.createdAt || a.createdAt || 0);
        const bDate = new Date(b.lastMessage?.createdAt || b.createdAt || 0);
        return bDate.getTime() - aDate.getTime();
      });
    });
  }, [userData?._id, dispatch, unreadCounts]);

  const handleMessageSeen = useCallback(({ messageId, userId }: MessageSeenProps) => {
    if (userId !== userData?._id) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === messageId ? { ...msg, receiverSeen: true } : msg
        )
      );
    }

    if (currentChat?.chatId) {
      setUnreadCounts(prevCounts => ({
        ...prevCounts,
        [currentChat.chatId]: 0,
      }));
    }
  }, [userData?._id, currentChat?.chatId]);

  // Function to properly create a UIChatEntity from a raw chat object
  const createUIChatEntity = useCallback((chat: ChatEntity, userId: string, isOnline: boolean, roomId: string): UIChatEntity => {
    const receiver = chat.participants.find(participant => {
      if (typeof participant !== "string") return participant._id !== userData?._id
    });
    
    if (typeof receiver !== "string")
      return {
        chatId: chat._id || "",
        name: receiver?.userName || "unknown",
        receiverId: receiver?._id || userId,
        isOnline,
        roomId,
        type: chat.type || ChatType.individual,
        status: chat.status || ChatStatus.active,
        lastSeen: chat.lastSeen,
        lastMessage: chat.lastMessage,
        unreadCounts: chat.unreadCounts || 0,
        subscriptionType: chat.subscriptionType || SubscriptionType.basic,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        participants: chat.participants || [],
        avatar: receiver?.profile?.avatar || '', 
        role: receiver?.role || Role.Student
      };
    else 
      return {
        chatId: chat._id || "",
        name: "unknown",
        receiverId: userId,
        isOnline,
        roomId,
        type: chat.type || ChatType.individual,
        status: chat.status || ChatStatus.active,
        lastSeen: chat.lastSeen,
        lastMessage: chat.lastMessage,
        unreadCounts: chat.unreadCounts || 0,
        subscriptionType: chat.subscriptionType || SubscriptionType.basic,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        participants: chat.participants || [],
        avatar: '', 
        role: Role.Student
      };
  }, [userData?._id]);

  // Initialize chats and set up socket connection once on component mount
  useEffect(() => {
    // Only fetch chats if we have a user ID and haven't done it already
    if (userData?._id ) {
      fetchChatsByUserId();
    }
    
    // Process receiver data if present
    if (receiver && userData?._id && !receiverProcessedRef.current) {
      handleNewReceiver();
    }
  }, [fetchChatsByUserId, handleNewReceiver, receiver, userData?._id,receiverProcessedRef]);

  // Set up socket listeners once
  useEffect(() => {
    if (!socket || !setOnlineUsers) return;
  
    socket.on("online-users", (users: { userId: string; socketId: string }[]) => {
      setOnlineUsers(users);
    });
  
    socket.on("receive-message", handleReceiveMessage);
  
    socket.on("get-delete-message", (messageId: string) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === messageId ? { ...msg, isDeleted: true } : msg
        )
      );
    });
  
    socket.on("message-seen-update", handleMessageSeen);
  
    if (userData?._id) {
      socket.emit("new-user", { userId: userData._id, socketId: socket.id });
    }
  
    return () => {
      socket.off("new-user");
      socket.off("online-users");
      socket.off("receive-message");
      socket.off("get-delete-message");
      socket.off("message-seen-update");
    };
  }, [socket, setOnlineUsers, handleReceiveMessage, handleMessageSeen, userData?._id]);

  // Mark messages as seen when viewing a chat
  useEffect(() => {
    if (currentChat && messages.length > 0 && socket && userData?._id) {
      const unseenMessages = messages.filter(
        msg => !msg.receiverSeen && msg.senderId !== userData._id
      );

      if (unseenMessages.length > 0) {
        socket.emit("message-seen", {
          roomId,
          chatId: currentChat.chatId,
          userId: userData._id,
        });

        setUnreadCounts(prevCounts => ({
          ...prevCounts,
          [currentChat.chatId]: 0,
        }));

        dispatch(updateUnreadCount({
          _id: currentChat.chatId as string,
          unreadCount: 0,
        }));
      }
    }
  }, [messages, currentChat, socket, userData?._id, dispatch, roomId]);

  const handleSendMessage = async (message: { content: string, contentType: contentType }) => {
    if (!roomId || !currentChat || !userData?._id) return;

    const newMessage: MessageEntity = {
      roomId,
      chatId: currentChat.chatId,
      senderId: userData._id,
      content: message.content,
      contentType: message.contentType,
    };

    socket?.emit("send-message", newMessage);
    await dispatch(createMessageAction(newMessage));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto h-screen">
        <div className={`h-full ${isMobileView ? 'relative' : 'grid md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'}`}>
          <div className={`md:col-span-1 h-full ${isMobileView && selectedUserId ? 'hidden' : 'block'}`}>
            <ChatList
              users={chats || []}
              userId={userData?._id || ""}
              selectedUserId={selectedUserId}
              onSelectUser={(userId) => {
                setSelectedUserId(userId);
                // Find the selected chat
                if (userId && chats) {
                  const selectedChat = chats.find(chat => {
                    if ('receiverId' in chat) {
                      return chat.receiverId === userId;
                    }
                    // For compatibility with ChatEntity type
                    const participant = chat.participants.find(p => {
                      if (typeof p !== "string") return p._id === userId
                    });
                    return !!participant;
                  });
                  
                  if (selectedChat) {
                    // Create room ID
                    const newRoomId = createPrivateRoomId(userData?._id || '', userId);
                    setRoomId(newRoomId);
                    
                    // Join room
                    socket?.emit("join-room", { roomId: newRoomId });
                    
                    // Create a properly typed UIChatEntity
                    const uiChat = createUIChatEntity(
                      selectedChat, 
                      userId, 
                      onlineUsers?.some(user => user.userId === userId) || false,
                      newRoomId
                    );
                    
                    // Set current chat
                    setCurrentChat(uiChat);
                    
                    // Get messages only if we haven't already loaded them
                    if (currentChat?.chatId !== uiChat.chatId) {
                      dispatch(getMessagesByChatIdAction(uiChat.chatId))
                        .then((response) => {
                          if (response.payload && response.payload.data) {
                            setMessages(response.payload.data);
                          }
                        });
                    }
                  }
                }
              }}
              loading={chatListLoading}
              unreadCounts={unreadCounts}
            />
          </div>
          <div className={`md:col-span-2 lg:col-span-3 h-full ${
            isMobileView && !selectedUserId ? 'hidden' : 'block'
          } ${isMobileView ? 'absolute top-0 left-0 w-full h-full z-10' : ''}`}>
            <ChatBox
              currentChat={currentChat}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={isMobileView ? () => setSelectedUserId(null) : undefined}
              isOnline={onlineUsers?.some(user => user.userId === currentChat?.receiverId) || false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserChat;