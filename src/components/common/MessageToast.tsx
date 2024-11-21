import React, {  useState } from 'react';
import { MessageType } from '../../types/IMessageType';

export interface MessageProps {
  message: string;
  type?: MessageType;
  onMessage?:(Message:string)=>void;
}
const handleIsVisible =(setIsVisible:React.Dispatch<React.SetStateAction<boolean>>,isVisible:boolean)=>{
    setIsVisible(!isVisible)
}
const MessageToast: React.FC<MessageProps> = ({ message, type = 'error',onMessage = () => {} }) => {
  const [isVisible, setIsVisible] = useState(true);


  const getMessageStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-200 text-red-800'; 
    }
  };

  // Get icon for each type
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️'; // Warning icon
      case 'info':
        return 'ℹ️'; // Info icon
      case 'success':
        return '✅'; // Success icon
      default:
        return '❌'; 
    }
  };

 

  return (    
    isVisible && (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-md z-50 ${getMessageStyle()} flex items-center justify-between space-x-3 w-96 max-w-xs transition-all duration-300 ease-in-out opacity-90`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getIcon()}</span> {/* Display icon */}
          <span className="font-medium">{message}</span>
        </div>
        <button
          className="text-xl font-bold text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={() =>{
            onMessage("")
            handleIsVisible(setIsVisible,isVisible)
          }}
        >
          &times;
        </button>
      </div>
    )
  );
};

export default MessageToast;
