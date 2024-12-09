
import { Star, Clock, Users } from 'lucide-react';

interface CourseCardProps {
  course: {
    title: string;
    instructor: string;
    image: string;
    rating: number;
    students: number;
    duration: string;
    price: string;
  };
  viewMode: 'grid' | 'list';
}

export function PoppularCourseCard({ course, viewMode }: CourseCardProps) {
  const isGrid = viewMode === 'grid';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
      isGrid ? 'flex-col' : 'flex'
    }`}>
      <div className={`relative ${isGrid ? 'w-full' : 'w-1/3'}`}>
        <img 
          src={course.image} 
          alt={course.title}
          className={`${isGrid ? 'w-full h-48' : 'w-full h-full'} object-cover`}
        />
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-700 px-2 py-1 rounded-lg shadow">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{course.price}</span>
        </div>
      </div>
      <div className={`p-6 ${isGrid ? '' : 'flex-1'}`}>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">by {course.instructor}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-gray-600 dark:text-gray-300">{course.rating}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="h-5 w-5 mr-1" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="h-5 w-5 mr-1" />
            <span>{course.duration}</span>
          </div>
        </div>
        <button className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors">
          Enroll Now
        </button>
      </div>
    </div>
  );
}