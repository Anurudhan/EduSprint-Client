import React from 'react';
import { BookOpen, Clock, Award, Calendar, User } from 'lucide-react';
import { CourseEntity } from '../../types/ICourse';
import { motion } from 'framer-motion';

interface CourseCardProps {
  enrollment: {
    course?: CourseEntity;
    progress?: {
      overallCompletionPercentage?: number;
    };
    completionStatus?: string;
    createdAt?: string;
  };
}

export const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const { course, progress, completionStatus, createdAt } = enrollment;
  
  // Calculate days since enrollment
  const daysSinceEnrollment = createdAt 
    ? Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24))
    : 0;
  
  // Format the level text
  const formatLevel = (level?: string) => {
    if (!level) return 'All Levels';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600';
    switch(status.toLowerCase()) {
      case 'completed': return 'text-green-600';
      case 'inprogress': return 'text-amber-600';
      default: return 'text-purple-600';
    }
  };

  // Get progress color
  const getProgressColor = (percentage?: number) => {
    if (!percentage) return 'bg-purple-600';
    if (percentage >= 75) return 'bg-green-600';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-purple-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={course?.title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center text-white">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{course?.lessons?.length || 0} lessons</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">
          {course?.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {course?.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="text-sm">{formatLevel(course?.level)}</span>
            </div>
            <div className={`flex items-center ${getStatusColor(completionStatus)}`}>
              <Award className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{completionStatus}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{daysSinceEnrollment} days ago</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{course?.instructor?.userName || 'Instructor'}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-200">Progress</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {progress?.overallCompletionPercentage?.toFixed(0) || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className={`${getProgressColor(progress?.overallCompletionPercentage)} h-2.5 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress?.overallCompletionPercentage || 0}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};