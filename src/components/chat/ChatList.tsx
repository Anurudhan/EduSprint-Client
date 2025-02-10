import { SignupFormData } from "../../types";


interface ChatListProps {
  users: SignupFormData[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export default function ChatList({ users, selectedUserId, onSelectUser }: ChatListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {users.map((user) => (
          <div
            key={user._id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUserId === user._id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectUser(user?._id as string) }
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={user?.profile?.avatar as string}
                  alt="user avtar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {user.userName}
                  </h3>
                  <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'instructor' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}