import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  Mic, 
  MoreVertical, 
  Reply, 
  Edit, 
  Trash, 
  CheckCheck, 
  Check, 
  X, 
  ArrowLeft,
  MessageCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IChat } from '../../types/IChat';
import { contentType, IMessage } from '../../types/IMessageType';
import { SignupFormData } from '../../types';

interface ChatBoxProps {
  chat: IChat | null;
  messages: IMessage[];
  users: SignupFormData[];
  currentUser: SignupFormData | null;
  onSendMessage: (content: string, contentType: contentType, replyToId?: string, fileUrl?: string) => void;
  onBack?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  chat, 
  messages, 
  users, 
  currentUser, 
  onSendMessage,
  onBack 
}) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [replyTo, setReplyTo] = useState<IMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatMessageDate = (date?: Date | string): string => {
    const messageDate = date ? new Date(date) : new Date();
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date?: Date | string): string => {
    const dateObj = date ? new Date(date) : new Date();
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUserById = (userId: string): SignupFormData | undefined => {
    return users.find(user => user._id === userId);
  };

  const getChatName = (): string => {
    if (!chat) return 'Chat';
    
    if (chat.chatType === 'group') {
      return chat.name || 'Unnamed Group';
    } else {
      const otherParticipantId = chat.participants.find(id => id !== currentUser?._id);
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : (chat.name?chat.name:'Unknown User');
      }
      return 'Unknown User';
    }
  };

  const getChatAvatar = (): string => {
    if (!chat) return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    
    if (chat.chatType === 'group') {
      return chat.avatar || 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80';
    } else {
      const otherParticipantId = chat.participants.find(id => id !== currentUser?._id);
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser?.profile?.avatar as string||chat.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80';
      }
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80';
    }
  };

  const getParticipantsStatus = (): string => {
    if (!chat) return '';
    
    if (chat.chatType === 'group') {
      return `${chat.participants.length} members`;
    } else {
      const otherParticipantId = chat.participants.find(id => id !== currentUser?._id);
      if (otherParticipantId) {
        const otherUser = getUserById(otherParticipantId);
        return otherUser?.isOnline ? 'Online' : 'Offline';
      }
      return '';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && chat?._id) {
      onSendMessage(newMessage, contentType.text, replyTo?._id);
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Normalize messages to ensure createdAt is a Date object
  const normalizedMessages = messages.map(message => ({
    ...message,
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
    updatedAt: message.updatedAt ? new Date(message.updatedAt) : new Date()
  }));

  const groupedMessages: { [date: string]: IMessage[] } = {};
  normalizedMessages.forEach(message => {
    const date = formatMessageDate(message.createdAt);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  const isReadByAll = (message: IMessage): boolean => {
    if (!chat || !currentUser) return false;
    
    if (message.sender === currentUser._id) {
      const otherParticipants = chat.participants.filter(id => id !== currentUser._id);
      return otherParticipants.every(participantId => 
        (message.readBy || []).some(read => read.userId === participantId)
      );
    }
    
    return false;
  };

  const isReadBySome = (message: IMessage): boolean => {
    if (!chat || !currentUser) return false;
    
    if (message.sender === currentUser._id) {
      const otherParticipants = chat.participants.filter(id => id !== currentUser._id);
      return otherParticipants.some(participantId => 
        (message.readBy || []).some(read => read.userId === participantId)
      );
    }
    
    return false;
  };

  const renderMessageContent = (message: IMessage) => {
    switch (message.contentType) {
      case contentType.image:
        return (
          <div className="mt-1 rounded-lg overflow-hidden">
            <img 
              src={message.fileUrl || ''} 
              alt="Image" 
              className="max-w-xs md:max-w-sm rounded-lg"
            />
          </div>
        );
      case contentType.file:
        return (
          <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg inline-block">
            <a 
              href={message.fileUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Paperclip size={16} className="mr-2" />
              <span>{message.content}</span>
            </a>
          </div>
        );
      case contentType.video:
        return (
          <div className="mt-1 rounded-lg overflow-hidden">
            <video 
              src={message.fileUrl || ''} 
              controls 
              className="max-w-xs md:max-w-sm rounded-lg"
            />
          </div>
        );
      case contentType.audio:
        return (
          <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <audio src={message.fileUrl || ''} controls className="w-full" />
          </div>
        );
      default:
        return <p className="mt-1">{message.content}</p>;
    }
  };

  const renderReplyMessage = (replyToId: string) => {
    const replyMessage = normalizedMessages.find(m => m._id === replyToId);
    if (!replyMessage) return null;
    
    const replySender = getUserById(replyMessage.sender);
    
    return (
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mb-2 border-l-4 border-gray-300 dark:border-gray-600">
        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
          Reply to {replySender ? `${replySender.firstName} ${replySender.lastName}` : 'Unknown'}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-200 truncate">
          {replyMessage.contentType === contentType.text 
            ? replyMessage.content 
            : `${replyMessage.contentType} attachment`}
        </div>
      </div>
    );
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 1,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      x: -50,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="mr-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <img 
          src={getChatAvatar()} 
          alt={getChatName()}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div className="flex-grow">
          <h2 className="font-medium text-gray-900 dark:text-white">{getChatName()}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-300">{getParticipantsStatus()}</p>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreVertical size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      {chat ? (
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          {Object.keys(groupedMessages).map(date => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              <AnimatePresence>
                {groupedMessages[date].map(message => {
                  const isCurrentUser = currentUser && message.sender === currentUser._id;
                  const sender = getUserById(message.sender);
                  
                  return (
                    <motion.div
                      key={message._id || Math.random().toString()}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ originX: isCurrentUser ? 1 : 0 }}
                      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                        {!isCurrentUser && (
                          <div className="flex items-center mb-1">
                            <img 
                              src={sender?.profile?.avatar as string||chat.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'} 
                              alt={`${sender?.firstName} ${sender?.lastName}`} 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {sender ? `${sender.firstName} ${sender.lastName}` : (chat.name?chat.name:'Unknown User')}
                            </span>
                          </div>
                        )}
                        
                        <div className={`relative group ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {message.replyTo && renderReplyMessage(message.replyTo)}
                          
                          <div 
                            className={`inline-block rounded-lg px-4 py-2 ${
                              isCurrentUser 
                                ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                            }`}
                          >
                            {renderMessageContent(message)}
                            
                            {message.isEdited && (
                              <span className="text-xs opacity-70 ml-1">(edited)</span>
                            )}
                          </div>
                          
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-300">
                              {formatTime(message.createdAt)}
                            </span>
                            
                            {isCurrentUser && (
                              <span className="ml-1">
                                {isReadByAll(message) ? (
                                  <CheckCheck size={14} className="text-blue-500 dark:text-blue-400" />
                                ) : isReadBySome(message) ? (
                                  <CheckCheck size={14} className="text-gray-400 dark:text-gray-300" />
                                ) : (
                                  <Check size={14} className="text-gray-400 dark:text-gray-300" />
                                )}
                              </span>
                            )}
                          </div>
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className={`flex mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <div className="bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-sm border border-gray-100 dark:border-gray-600 flex">
                                {message.reactions.map((reaction, index) => (
                                  <span key={reaction.userId || index} className="mr-1 last:mr-0">
                                    {reaction.emoji}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className={`absolute top-0 ${
                            isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
                          } hidden group-hover:flex bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-600`}>
                            <button 
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                              onClick={() => setReplyTo(message)}
                            >
                              <Reply size={16} className="text-gray-600 dark:text-gray-300" />
                            </button>
                            {isCurrentUser && (
                              <>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <Edit size={16} className="text-gray-600 dark:text-gray-300" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg">
                                  <Trash size={16} className="text-gray-600 dark:text-gray-300" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageCircle size={48} className="mx-auto text-gray-400 dark:text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">Please chat with your instructor</h3>
            <p className="text-gray-500 dark:text-gray-300 mt-2">Select a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
      
      {replyTo && chat && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center">
          <div className="flex-grow">
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Replying to {getUserById(replyTo.sender) ? 
                `${getUserById(replyTo.sender)?.firstName} ${getUserById(replyTo.sender)?.lastName}` : 'Unknown'}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200 truncate">
              {replyTo.content}
            </div>
          </div>
          <button 
            className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
            onClick={() => setReplyTo(null)}
          >
            <X size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}
      
      {chat && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-600">
          <form onSubmit={handleSendMessage} className="flex items-end">
            <div className="flex items-center mr-2">
              <button 
                type="button" 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleFileUpload}
              >
                <Paperclip size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    const fileUrl = URL.createObjectURL(file);
                    onSendMessage(file.name, contentType.file, replyTo?._id, fileUrl);
                    setReplyTo(null);
                  }
                }}
              />
              
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Image size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Mic size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div className="flex-grow relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                rows={1}
                style={{ maxHeight: '120px', minHeight: '40px' }}
              />
              <button type="button" className="absolute right-3 bottom-2">
                <Smile size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <button 
              type="submit" 
              className="ml-2 p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2"
              disabled={!newMessage.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;