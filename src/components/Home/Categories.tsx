import { useRef, useEffect, useCallback, useState } from "react";
// import { Code, Palette, BarChart, Brain, Music, Camera, Globe, Calculator, Microscope, Book, Dumbbell, Heart } from 'lucide-react';
import { getAllCategory } from "../../redux/store/actions/admin";
import { useAppDispatch } from "../../hooks/hooks";
import { Category } from "../../types/ICategory";
import LoadingSpinner from "../common/loadingSpinner";

export function CourseCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //   { icon: <Code />, name: 'Programming', count: 150 },
  //   { icon: <Palette />, name: 'Design', count: 85 },
  //   { icon: <BarChart />, name: 'Business', count: 120 },
  //   { icon: <Brain />, name: 'Data Science', count: 95 },
  //   { icon: <Music />, name: 'Music', count: 70 },
  //   { icon: <Camera />, name: 'Photography', count: 65 },
  //   { icon: <Globe />, name: 'Languages', count: 110 },
  //   { icon: <Calculator />, name: 'Mathematics', count: 80 },
  //   { icon: <Microscope />, name: 'Science', count: 95 },
  //   { icon: <Book />, name: 'Literature', count: 60 },
  //   { icon: <Dumbbell />, name: 'Fitness', count: 45 },
  //   { icon: <Heart />, name: 'Health', count: 75 }
  // ];
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dispatch(getAllCategory({ page: 1, limit: 1000 }));
      if (response.payload.success) {
        setCategories(response.payload.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find the perfect course from our diverse categories
          </p>
        </div>
        <div
          ref={scrollRef}
          className="overflow-hidden whitespace-nowrap"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="inline-flex gap-6 animate-scroll">
            {[...categories, ...categories].map((category, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center w-48">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={category.imageUrl as string}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {category.count} courses
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && <LoadingSpinner />}
    </section>
  );
}
