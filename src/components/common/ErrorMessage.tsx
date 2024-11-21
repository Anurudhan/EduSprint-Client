
import React, { useState } from 'react';
import { MessageType } from '../../types/IMessageType';



export interface ErrorMessageProps {
  message: string;
  type?:MessageType
}


const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error' }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Style based on error type
  const getErrorStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-red-100 text-red-700'; // Default is error
    }
  };

  return (
    isVisible && (
      <div
        className={`p-4 rounded-md shadow-md ${getErrorStyle()} flex items-center justify-between`}
      >
        <span>{message}</span>
        <button
          className="ml-4 text-lg font-semibold text-gray-600 hover:text-gray-900"
          onClick={() => setIsVisible(false)}
        >
          &times;
        </button>
      </div>
    )
  );
};

export default ErrorMessage;
