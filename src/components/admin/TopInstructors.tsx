

const TopInstructors = () => {
  const instructors = [
    {
      name: 'Sarah Johnson',
      subject: 'Web Development',
      students: 4521,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'David Chen',
      subject: 'Machine Learning',
      students: 3876,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Emily Parker',
      subject: 'Digital Marketing',
      students: 3654,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Top Instructors</h2>
      <div className="space-y-4">
        {instructors.map((instructor, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
            <img 
              src={instructor.image} 
              alt={instructor.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{instructor.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{instructor.subject}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {instructor.students.toLocaleString()} students
                </span>
                <span className="mx-2">•</span>
                <span className="text-sm text-yellow-500">
                  ★ {instructor.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopInstructors;