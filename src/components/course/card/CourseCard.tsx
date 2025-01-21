
import { Star, Clock, BookOpen } from 'lucide-react';
import { CourseEntity } from '../../../types/ICourse';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hooks';
import { RootState } from '../../../redux';

interface CourseCardProps {
  course: CourseEntity;
  onMessage:(message:string)=>void;
}

export function CourseCard({ course,onMessage }: CourseCardProps) {
  const navigate = useNavigate();
  const {data} = useAppSelector((state:RootState) => state.user);
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 w-full max-w-sm mx-auto flex flex-col">
    <div className="relative">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-110"
      />
      <div className="absolute top-0 left-0 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-br-lg text-sm">
        {course.level}
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">
          {course.description}
        </p>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-current text-yellow-500 dark:text-yellow-400" />
            <span className="ml-1 font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>8 weeks</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>12 modules</span>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {course.pricing?.type === 'free' ? 'Free' : `$${course.pricing?.amount}`}
        </span>
        <button 
        onClick={() => {
          if(data) navigate("/student/enrollement", { state: { id: course._id } })
          else onMessage("You need to log in to enroll in this course. Please log in or sign up to continue!")
        }}
        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm">
          Enroll Now
        </button>
      </div>
    </div>
  </div>
  );
}

