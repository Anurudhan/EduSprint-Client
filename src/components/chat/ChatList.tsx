
import React from "react";
import { Users, CheckCheck } from "lucide-react";
import { IChat, SignupFormData } from "../../types";
import { formatDistanceToNow } from "../../utilities/progress/dateUtilities";

interface ChatListProps {
  chats: IChat[];
  users: SignupFormData[];
  currentUser: SignupFormData | null;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onlineUsers: { userId: string; socketId?: string }[] | [];
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  users,
  currentUser,
  selectedChatId,
  onSelectChat,
}) => {
  const getUserById = (userId: string): SignupFormData | undefined => {
    return users.find((user) => user._id === userId);
  };

  const getChatName = (chat: IChat): string => {
    if (!chat._id) return "Unnamed Chat";
    if (chat.chatType === "group") {
      return chat.name || "Unnamed Group";
    } else {
      const otherParticipantId = chat.participants.find(
        (id) => id !== currentUser?._id
      );
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser?.userName || chat.name || "Unknown User";
      }
      return "Unknown User";
    }
  };

  const getChatAvatar = (chat: IChat): string => {
    if (chat.chatType === "group") {
      return (
        chat.avatar ||
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
      );
    } else {
      const otherParticipantId = chat.participants.find(
        (id) => id !== currentUser?._id
      );
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return (
          (otherUser?.profile?.avatar as string) || chat.avatar ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
        );
      }
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80";
    }
  };

  const getUnreadCount = (chat: IChat): number => {
    const unreadInfo = chat.unreadCount.find(
      (u) => u.userId === currentUser?._id
    );
    return unreadInfo ? unreadInfo.count : 0;
  };

  const getLastMessageSender = (chat: IChat): string => {
    if (!chat.lastMessage?.sender) return "";

    if (chat.lastMessage.sender === currentUser?._id) {
      return "You";
    }

    const sender = getUserById(chat.lastMessage.sender);
    return sender?.userName?.split(" ")[0] || "Unknown";
  };

  const sortedChats = [...chats].sort((a, b) => {
    const getTimestamp = (chat: IChat) => {
      if (chat.lastMessage?.timestamp instanceof Date) {
        return chat.lastMessage.timestamp.getTime();
      } else if (chat.lastMessage?.timestamp) {
        return new Date(chat.lastMessage.timestamp).getTime();
      } else if (chat.updatedAt instanceof Date) {
        return chat.updatedAt.getTime();
      } else if (chat.updatedAt) {
        return new Date(chat.updatedAt).getTime();
      } else {
        return 0;
      }
    };
  
    return getTimestamp(b) - getTimestamp(a);
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h2>
      </div>

      <div className="overflow-y-auto flex-grow">
        {sortedChats.map((chat) => {
          if (!chat._id) return null;

          const chatName = getChatName(chat);
          const avatar = getChatAvatar(chat);
          const unreadCount = getUnreadCount(chat);
          const lastMessageTime = chat.lastMessage?.timestamp
            ? formatDistanceToNow(chat.lastMessage.timestamp)
            : formatDistanceToNow(chat.updatedAt);
          const lastMessageSender = getLastMessageSender(chat);
          const lastMessageContent =
            chat.lastMessage?.content || "No messages yet";
          const isSelected = selectedChatId === chat._id;

          return (
            <div
              key={chat._id}
              onClick={() => chat._id && onSelectChat(chat._id)}
              className={`p-3 border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-start">
                <div className="relative mr-3">
                  <img
                    src={avatar as string}
                    alt={chatName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.chatType === "group" ? (
                    <span className="absolute bottom-0 right-0 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                      <Users size={12} className="text-gray-600 dark:text-gray-300" />
                    </span>
                  ) : (
                    getUserById(
                      chat.participants.find((id) => id !== currentUser?._id) ||
                        ""
                    )?.isOnline && (
                      <span className="absolute bottom-0 right-0 bg-green-500 dark:bg-green-400 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"></span>
                    )
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {chatName}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap ml-2">
                      {lastMessageTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {chat.lastMessage && (
                        <span className="inline-flex items-center">
                          {lastMessageSender && `${lastMessageSender}: `}
                          {lastMessageContent}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center ml-2">
                      {unreadCount > 0 ? (
                        <span className="bg-blue-500 dark:bg-blue-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      ) : chat.lastMessage &&
                        chat.lastMessage.sender !== currentUser?._id ? (
                        <CheckCheck size={16} className="text-gray-400 dark:text-gray-300" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
