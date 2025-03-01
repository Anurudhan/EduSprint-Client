import { useState } from 'react';
import { format } from 'date-fns';
import { ChatEntity } from '../../types/IChat';
import { SignupFormData } from '../../types';
interface ChatListProps {
  users: ChatEntity[];
  userId:string;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  loading?: boolean;
  unreadCounts?: Record<string, number>;
}


export default function ChatList({ 
  users,
  userId,
  selectedUserId, 
  onSelectUser,
  loading = false,
  unreadCounts = {}
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users
  .map((chat) => {
    // Extract the participant who is NOT the current user
    const participant = chat.participants.find(p =>{if(typeof p !== "string") return p._id === userId});;
    return participant ? { ...chat, participant } : null;
  })
  .filter((chat) => {
    if (!chat) return false; // Skip invalid chats
    if (searchTerm && typeof chat.participant !== "string") {
      return chat.participant.userName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md h-full p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-y-auto flex-1">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chats found
          </div>
        ) : (
          filteredUsers.map((user) => {
            // Create a proper type guard function
            const isSignupFormData = (participant: string | SignupFormData|undefined): participant is SignupFormData => {
              return typeof participant !== "string" && participant !== null && participant !== undefined;
            };
            
            // Skip string participants
            if (!isSignupFormData(user?.participant)) {
              return null;
            }
            
            // Now TypeScript knows participant is SignupFormData
            const participant = user.participant;
            
            return (
              <div
                key={participant._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUserId === participant._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  onSelectUser(participant?._id as string);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={participant.profile?.avatar as string || ''}
                      alt={`${participant.userName}'s avatar`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {participant.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {participant.userName}
                      </h3>
                      {participant.lastLoginDate && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(participant.lastLoginDate), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        participant.role === 'instructor'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {participant.role}
                      </span>
                      {unreadCounts[participant?._id as string] > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts[participant?._id as string]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}