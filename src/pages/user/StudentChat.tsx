import  { useState } from 'react';
import { Send, User, Bot, Search } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! How can I help you with your studies today?",
    sender: 'bot',
    timestamp: new Date('2024-03-20T10:00:00')
  },
  {
    id: 2,
    text: "I'm having trouble understanding React hooks. Can you help?",
    sender: 'user',
    timestamp: new Date('2024-03-20T10:01:00')
  },
  {
    id: 3,
    text: "Of course! React hooks are functions that allow you to use state and other React features in functional components. The most commonly used hooks are useState and useEffect. Would you like me to explain them in detail?",
    sender: 'bot',
    timestamp: new Date('2024-03-20T10:01:30')
  }
];

const StudentChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "I understand your question. Let me help you with that...",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chat Support</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[70%] ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              } rounded-lg px-4 py-2`}>
                <p>{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t dark:border-gray-700 pt-4 px-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="btn btn-primary"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;