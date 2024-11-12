import { Clock, Star, Users, PlayCircle } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  rating: number;
  students: number;
  image: string;
  lessons: number;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Advanced JavaScript Concepts",
    instructor: "Dr. Sarah Wilson",
    progress: 75,
    duration: "12h 30m",
    rating: 4.8,
    students: 1234,
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=400",
    lessons: 24
  },
  {
    id: 2,
    title: "React.js Masterclass",
    instructor: "Michael Chen",
    progress: 45,
    duration: "15h 45m",
    rating: 4.9,
    students: 2156,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400",
    lessons: 32
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Alex Johnson",
    progress: 20,
    duration: "18h 15m",
    rating: 4.7,
    students: 1876,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400",
    lessons: 28
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    instructor: "Emma Davis",
    progress: 90,
    duration: "10h 20m",
    rating: 4.6,
    students: 1543,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400",
    lessons: 20
  }
];

const StudentCourses = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h1>
        <button className="btn btn-primary">
          Browse All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-48">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
          <p className="text-sm text-gray-200">{course.instructor}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{course.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">{course.students.toLocaleString()} students</span>
          </div>
        </div>

        <button className="w-full btn btn-secondary">
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default StudentCourses;
