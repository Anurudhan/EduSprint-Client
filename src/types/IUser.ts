export interface User {
    id: string;
    name: string;
    role: 'instructor' | 'student';
    avatar: string;
    lastMessage?: string;
    lastMessageTime?: string;
    online?: boolean;
  }
  
  export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }