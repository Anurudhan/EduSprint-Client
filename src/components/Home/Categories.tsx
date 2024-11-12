
import React from 'react';

interface Category {
  id: number;
  name: string;
  image: string;
}

const categories: Category[] = [
  { id: 1, name: 'Development', image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Design', image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Marketing', image: 'https://via.placeholder.com/100' },
  { id: 4, name: 'Business', image: 'https://via.placeholder.com/100' }
];

const Categories: React.FC = () => {
  return (
    <div className="py-12 bg-gray-100 ">
      <h2 className="text-3xl font-bold text-center mb-6">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="text-center">
            <img src={category.image} alt={category.name} className="w-24 h-24 rounded-full mx-auto" />
            <p className="mt-4 font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
