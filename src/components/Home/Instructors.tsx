// components/Instructors.tsx
import React from 'react';

interface Instructor {
  id: number;
  name: string;
  image: string;
}

const instructors: Instructor[] = [
  { id: 1, name: 'John Doe', image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Jane Smith', image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Mike Johnson', image: 'https://via.placeholder.com/100' }
];

const Instructors: React.FC = () => {
  return (
    <div className="py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Best Instructors</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="text-center">
            <img src={instructor.image} alt={instructor.name} className="w-24 h-24 rounded-full mx-auto" />
            <p className="mt-4 font-medium">{instructor.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
