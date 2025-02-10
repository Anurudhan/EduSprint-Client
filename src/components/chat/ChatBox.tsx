import React, { useContext, useEffect, useRef, useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { User } from '../../types/IUser';
import { MessageEntity } from '../../types/IMessageType';
import { SocketContext } from '../../context/SocketProvider';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { SignupFormData } from '../../types';


interface ChatBoxProps {
  selectedUser: User | null| undefined;
  currentChat:SignupFormData|null;
  messages: MessageEntity[];
  onSendMessage: (message: { content: string; contentType?: string }) => void;
  onBack?: () => void;
}

export default function ChatBox({ selectedUser,currentChat, messages = [], onSendMessage, onBack }: ChatBoxProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useContext(SocketContext) || {};
  const { data } = useAppSelector((state: RootState) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    socket?.emit("typing", {
      roomId: currentChat?.roomId,
      senderId: data?._id,
    });
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() ) {

      const messageContent =  inputMessage;
      const messageType =  "text";

      onSendMessage({ content: messageContent, contentType: messageType });
      setInputMessage("");
    }
  };
  


  if (!selectedUser) {
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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <img
          src={currentChat?.profile?.avatar as string}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div >
          <h2 className="font-semibold">{currentChat?.userName}</h2>
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentChat?.role === 'instructor' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {currentChat?.role}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === 'current-user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
              <span className={`text-xs ${
                message.senderId === 'current-user' 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}>
                {message.createdAt as string}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}