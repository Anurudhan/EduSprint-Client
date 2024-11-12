
import { Search, Plus } from 'lucide-react';

const AdminCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Sarah Johnson',
      category: 'Development',
      price: 99.99,
      students: 1234,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      status: 'Published'
    },
    // Add more courses...
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Courses</h1>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Plus size={20} className="mr-2" />
          Add Course
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          <option>All Categories</option>
          <option>Development</option>
          <option>Business</option>
          <option>Design</option>
        </select>
        <select className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white">
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{course.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{course.instructor}</p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 dark:text-blue-400 font-bold">${course.price}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${course.status === 'Published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                  {course.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;