import { Star } from 'lucide-react';

const TopCourses = () => {
  const courses = [
    {
      title: 'Complete Web Development Bootcamp',
      instructor: 'Sarah Johnson',
      students: 1234,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'Machine Learning A-Z',
      instructor: 'David Chen',
      students: 987,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'Digital Marketing Masterclass',
      instructor: 'Emily Parker',
      students: 856,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Top Performing Courses</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.instructor}</p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">{course.rating}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  {course.students.toLocaleString()} students
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCourses;