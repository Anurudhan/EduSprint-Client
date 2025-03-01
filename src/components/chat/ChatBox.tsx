// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Send, ArrowLeft } from 'lucide-react';
// import { User } from '../../types/IUser';
// import { MessageEntity } from '../../types/IMessageType';
// import { SocketContext } from '../../context/SocketProvider';
// import { useAppSelector } from '../../hooks/hooks';
// import { RootState } from '../../redux';
// import { SignupFormData } from '../../types';


// interface ChatBoxProps {
//   selectedUser: User | null| undefined;
//   currentChat:SignupFormData|null;
//   messages: MessageEntity[];
//   onSendMessage: (message: { content: string; contentType?: string }) => void;
//   onBack?: () => void;
// }

// export default function ChatBox({ selectedUser,currentChat, messages = [], onSendMessage, onBack }: ChatBoxProps) {
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { socket } = useContext(SocketContext) || {};
//   const { data } = useAppSelector((state: RootState) => state.user);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     socket?.emit("typing", {
//       roomId: currentChat?.roomId,
//       senderId: data?._id,
//     });
//     setInputMessage(e.target.value);
//   };

//   const handleSendMessage = async () => {
//     if (inputMessage.trim() ) {

//       const messageContent =  inputMessage;
//       const messageType =  "text";

//       onSendMessage({ content: messageContent, contentType: messageType });
//       setInputMessage("");
//     }
//   };
  


//   if (!selectedUser) {
//     return (
//       <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md">
//         <p className="text-gray-500">Select a chat to start messaging</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
//       <div className="p-4 border-b flex items-center space-x-3">
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//         )}
//         <img
//           src={currentChat?.profile?.avatar as string}
//           alt="User Avatar"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <div >
//           <h2 className="font-semibold">{currentChat?.userName}</h2>
//           <span className={`text-xs px-2 py-1 rounded-full ${
//             currentChat?.role === 'instructor' 
//               ? 'bg-purple-100 text-purple-800' 
//               : 'bg-blue-100 text-blue-800'
//           }`}>
//             {currentChat?.role}
//           </span>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message._id}
//             className={`flex ${
//               message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             <div
//               className={`max-w-[70%] rounded-lg p-3 ${
//                 message.senderId === 'current-user'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-100 text-gray-900'
//               }`}
//             >
//               <p>{message.content}</p>
//               <span className={`text-xs ${
//                 message.senderId === 'current-user' 
//                   ? 'text-blue-100' 
//                   : 'text-gray-500'
//               }`}>
//                 {message.createdAt as string}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSendMessage} className="p-4 border-t">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={inputMessage}
//             onChange={handleInputChange}
//             placeholder="Type your message..."
//             className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Send, ArrowLeft, CheckCheck} from 'lucide-react';
import { format } from 'date-fns';
import { SocketContext } from '../../context/SocketProvider';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { contentType, MessageEntity } from '../../types/IMessageType';
import { UIChatEntity } from '../../types/IChat';

// Types
interface ChatBoxProps {
  currentChat: UIChatEntity | null;
  messages: MessageEntity[];
  onSendMessage: (message:{ content: string; contentType: contentType }) => void;
  onBack?: () => void;
  isOnline?: boolean;
}
// Message Component
const Message = React.memo(({ message, isCurrentUser }: { 
  message: MessageEntity; 
  isCurrentUser: boolean 
}) => {
  const time = message.createdAt ? format(new Date(message.createdAt), 'HH:mm') : '';
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg p-3 relative group ${
        isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
      }`}>
        {message.isDeleted ? (
          <p className="italic text-gray-500">Message deleted</p>
        ) : (
          <>
            <p className="break-words">{message.content}</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              <span className={`text-xs ${
                isCurrentUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {time}
              </span>
              {isCurrentUser && (
                <CheckCheck className={`w-4 h-4 ${
                  message.receiverSeen ? 'text-blue-200' : 'text-blue-300'
                }`} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// ChatBox Component
export default function ChatBox({ 
  currentChat, 
  messages = [], 
  onSendMessage, 
  onBack,
  isOnline 
}: ChatBoxProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useContext(SocketContext) || {};
  const { data: currentUser } = useAppSelector((state: RootState) => state.user);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("isTyping", (data: { senderId: string }) => {
      if (data.senderId !== currentUser?._id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off("isTyping");
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, currentUser?._id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    socket?.emit("typing", {
      roomId: currentChat?.roomId,
      senderId: currentUser?._id,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const message = { 
        content: inputMessage.trim(), 
        contentType: contentType.text
      }
      onSendMessage(message);
      setInputMessage("");
    }
  };

  if (!currentChat) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div className="relative">
          <img
            src={currentChat.avatar as string}
            alt={`${currentChat.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{currentChat.name}</h2>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentChat.role === 'instructor' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {currentChat.role}
            </span>
            {isTyping && (
              <span className="text-xs text-gray-500">typing...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message 
            key={message._id}
            message={message}
            isCurrentUser={message.senderId === currentUser?._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}