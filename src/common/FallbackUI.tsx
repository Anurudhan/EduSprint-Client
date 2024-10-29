
import React from 'react';

interface FallbackUIProps {
  message: string;
}

const FallbackUI: React.FC<FallbackUIProps> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-bold">{message}</h1>
    </div>
  );
};

export default FallbackUI;
