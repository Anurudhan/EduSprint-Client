import  { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { PoppularCourseCard } from '../course/card/PoppularCourseCard';


export function PopularCourses() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAll, setShowAll] = useState(false);

  const allCourses = [
    {
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      students: 15420,
      duration: "20 hours",
      price: "$89.99"
    },
    {
      title: "Data Science Fundamentals",
      instructor: "Emily Brown",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      students: 12350,
      duration: "25 hours",
      price: "$94.99"
    },
    {
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      students: 8940,
      duration: "18 hours",
      price: "$79.99"
    },
    {
      title: "Advanced JavaScript Programming",
      instructor: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      students: 10250,
      duration: "22 hours",
      price: "$99.99"
    },
    {
      title: "Machine Learning Basics",
      instructor: "Dr. Alex Chen",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      students: 9870,
      duration: "30 hours",
      price: "$129.99"
    },
    {
      title: "Digital Marketing Strategy",
      instructor: "Lisa Anderson",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      students: 7850,
      duration: "15 hours",
      price: "$74.99"
    }
  ];

  const displayedCourses = showAll ? allCourses : allCourses.slice(0, 3);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Popular Courses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Join thousands of satisfied students</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {displayedCourses.map((course, index) => (
            <PoppularCourseCard key={index} course={course} viewMode={viewMode} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-6 py-3 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors"
          >
            {showAll ? 'Show Less' : 'Show More Courses'}
          </button>
        </div>
      </div>
    </section>
  );
}