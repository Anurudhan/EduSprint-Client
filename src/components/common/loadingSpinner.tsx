import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin relative">
        <div className="absolute w-12 h-12 border-4 border-t-4 border-green-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
