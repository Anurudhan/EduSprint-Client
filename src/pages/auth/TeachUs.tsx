// TeachUs.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
const TeachUs: React.FC = () => {
  const navigate = useNavigate();

  // Handle Sign In button click
  const handleSignIn = () => {
    navigate('/login?role=instructor');
  };

  // Handle Sign Up button click
  const handleSignUp = () => {
    navigate('/signup?role=instructor');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-gray-100 h-screen">
      {/* Left Side: Sign In Section */}
      <div className="flex-1 flex flex-col items-center p-4">
        <img
          src="/src/assets/5839955.webp"
          alt="Instructors"
          className="w-48 h-48 object-cover mb-4"
        />
        <blockquote className="text-center text-lg italic font-semibold text-gray-700 mb-4">
          "Education is the most powerful weapon which you can use to change the world." 
          - Nelson Mandela
        </blockquote>
        <button
          onClick={handleSignIn}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Sign In as Teacher
        </button>
      </div>

      {/* Vertical Line */}
      <div className="w-px bg-gray-300 h-3/4 mx-4 hidden md:block"></div>

      {/* Right Side: Sign Up Section */}
      <div className="flex-1 flex flex-col items-center p-4">
        <img
          src="/src/assets/DALL·E 2024-10-23 11.07.36 - A transparent background image showing a teacher conducting an online e-learning session. The teacher is sitting at a desk with a laptop open, explain.webp"
          alt="Instructors"
          className="w-48 h-48 object-cover mb-4"
        />
        <blockquote className="text-center text-lg italic font-semibold text-gray-700 mb-4">
          "Teaching is the greatest act of optimism." 
          - Colleen Wilcox
        </blockquote>
        <button
          onClick={handleSignUp}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Sign Up as Teacher
        </button>
      </div>
    </div>
  );
};

export default TeachUs;
