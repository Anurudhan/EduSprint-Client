import React from 'react';
import { BookOpen, Clock, Award } from 'lucide-react';
import { CourseEntity } from '../../types/ICourse';


interface CourseCardProps {
  enrollment: {
    course?: CourseEntity;
    progress?: {
      overallCompletionPercentage?: number;
    };
    completionStatus?: string;
  };
}

export const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const { course, progress, completionStatus } = enrollment;
  console.log(course,"this is the length of course")
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center text-white">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {course?.lessons?.length || 0} lessons
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course?.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course?.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <BookOpen className="w-4 h-4 mr-1" />
            <span className="text-sm">{course?.level}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Award className="w-4 h-4 mr-1" />
            <span className="text-sm">{completionStatus}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress?.overallCompletionPercentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress?.overallCompletionPercentage || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}