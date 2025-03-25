import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
      <div className="bg-blue-100 p-6 rounded-full mb-4">
        <MessageSquare size={48} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your messages</h2>
      <p className="text-gray-600 text-center max-w-md mb-4">
        Send private messages to friends and colleagues. Your conversations are end-to-end encrypted.
      </p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Start a new chat
      </button>
    </div>
  );
};

export default EmptyState;