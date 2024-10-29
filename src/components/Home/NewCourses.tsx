
import React from 'react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  image: string;
}

const newCourses: Course[] = [
  { id: 1, title: 'React for Beginners', instructor: 'John Doe', image: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Advanced CSS', instructor: 'Jane Smith', image: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Python Masterclass', instructor: 'Mike Johnson', image: 'https://via.placeholder.com/150' }
];

const NewCourses: React.FC = () => {
  return (
    <div className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">New Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newCourses.map((course) => (
          <div key={course.id} className="bg-white shadow-lg rounded-lg p-6">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-md" />
            <h3 className="mt-4 font-bold text-lg">{course.title}</h3>
            <p className="mt-2 text-gray-600">Instructor: {course.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCourses;
