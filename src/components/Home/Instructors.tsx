
import { Star } from 'lucide-react';

export function Instructors() {
  const instructors = [
    {
      name: "Dr. Robert Anderson",
      expertise: "Web Development",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      students: 45000,
      courses: 12
    },
    {
      name: "Prof. Lisa Martinez",
      expertise: "Data Science",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      students: 38000,
      courses: 8
    },
    {
      name: "David Kim",
      expertise: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      students: 42000,
      courses: 15
    },
    {
      name: "Dr. Sarah Johnson",
      expertise: "Business Strategy",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      students: 35000,
      courses: 10
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn from the Best</h2>
          <p className="text-xl text-gray-600">Meet our top-rated instructors</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-center">
                <img 
                  src={instructor.image} 
                  alt={instructor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{instructor.name}</h3>
                <p className="text-indigo-600 mb-3">{instructor.expertise}</p>
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{instructor.rating}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{instructor.students.toLocaleString()} students</p>
                  <p>{instructor.courses} courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}