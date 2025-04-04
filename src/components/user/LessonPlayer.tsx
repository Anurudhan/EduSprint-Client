import React, { useState } from 'react';
import { CheckCircle, Lock, MessageSquare, PlayCircle } from 'lucide-react';
import { Lesson } from '../../types/ICourse';

interface LessonPlayerProps {
  lesson: Lesson;
  lessonId: number;
  isCompleted: boolean;
  isLocked: boolean;
  onComplete: (lessonNumber: string) => void;
  onMessage: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  lessonId,
  isCompleted,
  isLocked,
  onComplete,
  onMessage
}) => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    onComplete(lessonId.toString()); // Fixed: Pass lessonId as string
  };

  if (isLocked) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
        <Lock className="mr-2 text-gray-500" />
        <p className="text-gray-600">Complete the previous lesson to unlock this content</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 p-4">
        {lesson.video ? (
          <video 
            className="w-full rounded-lg" 
            controls
            onEnded={handleVideoEnd}
          >
            <source src={lesson.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-200 rounded-lg">
            <PlayCircle size={48} className="text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          {isCompleted && <CheckCircle size={18} className="mr-2 text-green-500" />}
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
        </div>
        
        <p className="text-gray-700 mb-4">{lesson.description}</p>
        
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Learning Objectives:</h3>
            <ul className="list-disc pl-6">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="text-gray-600 mb-1">{objective}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          onClick={onMessage}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <MessageSquare size={18} className="mr-2" />
          Message Instructor
        </button>
        
        {!isCompleted && videoEnded && (
          <div className="mt-4 text-green-600">
            Video completed! Click "Mark as Complete" to continue.
          </div>
        )}
      </div>
    </div>
  );
};