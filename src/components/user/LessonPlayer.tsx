import React, { useState } from 'react';
import { CheckCircle, Lock, MessageSquare, PlayCircle } from 'lucide-react';
import { Lesson } from '../../types/ICourse';

interface LessonPlayerProps {
  lesson: Lesson;
  lessonId:number;
  isCompleted: boolean;
  isLocked: boolean;
  onComplete: (lessonNumber: string) => void;
  onMessage:()=>void; // Accepts lessonNumber as a parameter
}


export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  isCompleted,
  isLocked,
  onComplete,
  onMessage
}) => {
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    onComplete();
  };
 
  if (isLocked) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Complete the previous lesson to unlock this content</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {lesson.video ? (
          <video
            className="w-full h-full"
            controls
            onEnded={handleVideoEnd}
            src={lesson.video}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <PlayCircle className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          {lesson.title}
        </h3>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Learning Objectives:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {lesson.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
        <button
              onClick={onMessage}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Message Instructor</span>
        </button>
      </div>
    </div>
  );
};