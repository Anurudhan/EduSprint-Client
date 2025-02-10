import  { useContext, useEffect, useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { User,Message } from '../../types/IUser';
import Peer from "peerjs";
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { ChatEntity } from '../../types/IChat';
import { MessageEntity } from '../../types/IMessageType';
import { createMessageAction, getChatsByUserIdAction, getMessagesByChatIdAction, updateUnreadCount } from '../../redux/store/actions/chat';
import { SocketContext } from '../../context/SocketProvider';
import { SignupFormData } from '../../types';
interface messageSeenProps{
  messageId:string,
  userId:string
}
 const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'How is your progress on the assignment?',
    lastMessageTime: '10:30 AM',
    online: true,
  },
  {
    id: '2',
    name: 'John Davis',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    lastMessage: 'Thank you for the feedback!',
    lastMessageTime: '9:45 AM',
    online: true,
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastMessage: 'Can we schedule a meeting?',
    lastMessageTime: 'Yesterday',
    online: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      text: 'How is your progress on the assignment?',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      senderId: 'current-user',
      text: 'I\'m working on it, almost finished!',
      timestamp: '10:31 AM',
    },
  ],
  '2': [
    {
      id: '1',
      senderId: 'current-user',
      text: 'Here\'s my submission for review',
      timestamp: '9:30 AM',
    },
    {
      id: '2',
      senderId: '2',
      text: 'Thank you for the feedback!',
      timestamp: '9:45 AM',
    },
  ],
};

function UserChat() {


  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state: RootState) => state.user);
  const [currentChat, setCurrentChat] = useState<SignupFormData|null>(null);
  const [chats, setChats] = useState<ChatEntity[]>([]);
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
 
  const [peer, setPeer] = useState<Peer | null>(null);
  const [localPeerId, setLocalPeerId] = useState<string>("");
  const { socket, onlineUsers, setOnlineUsers } =
    useContext(SocketContext) || {};
    const [chatListLoading, setChatListLoading] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<{
      [chatId: string]: number;
    }>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {

      setLocalPeerId(id);
    });
    setPeer(peer);
    return () => {
      peer.destroy();
    };
  }, []);
  useEffect(() => {
    socket?.on("online-users", (users) => {
      setOnlineUsers && setOnlineUsers(users);
    });

    if (data?._id && socket) {
      socket.emit("new-user", data._id);
    }

    socket?.on("receive-message", async (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Update unread count
      if (message.senderId !== data?._id) {
        setUnreadCounts((prevCount) => ({
          ...prevCount,
          [message.chatId]: (prevCount[message.chatId] || 0) + 1,
        }));

        await dispatch(
          updateUnreadCount({
            _id: message.chatId,
            unreadCount: unreadCounts[message.chatId] + 1,
          })
        );
      }

      // Move the chat to the top of the list
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat._id === message?.chatId
            ? { ...chat, lastMessage: message }
            : chat
        );
        const sortedChats = updatedChats.sort((a, b) =>
          new Date(b.lastMessage?.createdAt || b.createdAt) >
          new Date(a.lastMessage?.createdAt || a.createdAt)
            ? 1
            : -1
        );
        return sortedChats;
      });
    });

    
    socket?.on("get-delete-message", (messageId:string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isDeleted: true } : msg
        )
      );
    });

    socket?.on("message-seen-update", ({ messageId, userId }:messageSeenProps) => {
      if (userId !== data?._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, receiverSeen: true } : msg
          )
        );
      }

      // Reseting unread count
      if (currentChat?.chatId) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [currentChat?.chatId as string] : 0,
        }));
      }
    });

    socket?.on("last-seen", (userId:string) => {
      console.log(currentChat, "last seen trigger---", userId);
    });

    
    return () => {
      socket?.off("new-user");
      socket?.off("online-users");
      socket?.off("receive-message");
      socket?.off("isTyping");
      socket?.off("get-delete-message");
      socket?.off("message-seen-update");
    };
  }, [socket, setOnlineUsers, currentChat, data?._id,dispatch,unreadCounts]);

  const selectedUser = selectedUserId 
    ? mockUsers.find(user => user.id === selectedUserId) 
    : null;


  const handleBack = () => {
    setSelectedUserId(null);
  };

  // Get messages for the selected user, or return an empty array if none exist
  const currentMessages = selectedUserId && mockMessages[selectedUserId] 
    ? mockMessages[selectedUserId] 
    : [];

    useEffect(() => {
      if (currentChat && messages.length > 0) {
        const unseenMessages = messages.filter(
          (msg) => !msg.receiverSeen && msg.senderId !== data?._id
        );
  
        unseenMessages.forEach(() => {
          socket?.emit("message-seen", {
            roomId,
            chatId: currentChat._id,
            userId: data?._id,
          });
        });
  
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [currentChat.chatId]: 0,
        }));
  
        // Update the server about unread count reset
        dispatch(
          updateUnreadCount({
            _id: currentChat._id as string,
            unreadCount: 0,
          })
        );
      }
    }, [messages, currentChat, socket, data?._id,dispatch,roomId]);
  
    useEffect(() => {
      fetchChatsByUserId();
    }, [data, dispatch]);
    const fetchChatsByUserId = async () => {
      if (data?._id) {
        setChatListLoading(true);
        const response = await dispatch(getChatsByUserIdAction(data?._id));
  
        const chatDataMap = new Map();
        const unreadCountsMap: any = {};
  
        response.payload.data.forEach((chat: ChatEntity) => {
          const participant = chat?.participants.find(
            (participantId: any) => participantId._id !== data?._id
          );
          if (participant && !chatDataMap.has(participant._id)) {
            chatDataMap.set(participant._id, {
              ...participant,
              name: participant.userName,
              chatId: chat._id,
              receiverId: participant._id,
              createdAt: Date.now(),
              lastSeen: chat?.lastSeen,
              unreadCounts: chat.unreadCounts,
              subscriptionType: chat.subscriptionType,
            });
            unreadCountsMap[chat._id] = chat.unreadCounts || 0;
          }
        });
        setChatListLoading(false);
        const chatData = Array.from(chatDataMap.values());
        setChats(chatData);
      }
    };
    const createPrivateRoomId = (id1: string, id2: string) => {
      return id1 > id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
    };
  
    const handleCreateNewChat = async (receiverData: any, isOnline: any) => {
      if (data?._id) {
        const newRoomId = createPrivateRoomId(data?._id, receiverData._id);
        setRoomId(newRoomId);
        socket?.emit("join-room", newRoomId);
        setCurrentChat({ ...receiverData, isOnline, roomId: newRoomId });
  
        const response = await dispatch(
          getMessagesByChatIdAction(receiverData.chatId)
        );
  
        //check subscription
        if (receiverData.subscriptionType == "none") {
          toast.error("Please subscribe to chat");
          return;
        }
  
        setMessages(response.payload.data);
  
      }
    };
    const onSendMessage = async ({ content, contentType }: any) => {
      if (roomId && currentChat && data?._id) {
        const newMessage:MessageEntity = {
          roomId,
          chatId: currentChat?._id as string,
          senderId: data?._id,
          content,
          contentType,
        };
        socket?.emit("send-message", newMessage);
        await dispatch(createMessageAction(newMessage));
      }
    };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto h-screen">
        <div className={`h-full ${isMobileView ? 'relative' : 'grid md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'}`}>
          <div 
            className={`md:col-span-1 h-full ${
              isMobileView && selectedUserId ? 'hidden' : 'block'
            }`}
          >
            <ChatList
              users={chats}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          </div>
          <div 
            className={`md:col-span-2 lg:col-span-3 h-full ${
              isMobileView && !selectedUserId ? 'hidden' : 'block'
            } ${
              isMobileView ? 'absolute top-0 left-0 w-full h-full z-10' : ''
            }`}
          >
            <ChatBox
              selectedUser={selectedUser}
              currentChat={currentChat}
              messages={messages}
              onSendMessage={onSendMessage}
              onBack={isMobileView ? handleBack : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserChat;