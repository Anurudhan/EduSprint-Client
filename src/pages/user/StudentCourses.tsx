import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux";
import { EnrollmentEntity } from "../../types";
import { getEnrollmentByUserIdAction } from "../../redux/store/actions/enrollment";
import { CourseCard } from "../../components/user/StudentMyCourseCard";
import {
  Award,
  BookOpen,
  GraduationCap,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

// Simple debounce function
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Component: StudentCourses
const StudentCourses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.user.data);
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use debounce to delay search API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination based on total from server
  const totalPages = Math.ceil(totalEnrollments / itemsPerPage);

  // Memoize fetchEnrollments to avoid recreating on every render
  const fetchEnrollments = useCallback(async (
    page: number, 
    search: string, 
    isNewSearch: boolean = false
  ) => {
    if (!user?._id) return;

    setLoading(true);
    setError(null); // Clear any previous errors when starting a new fetch
    
    // If this is a new search, reset to page 1
    const requestPage = isNewSearch ? 1 : page;
    
    try {
      const response = await dispatch(getEnrollmentByUserIdAction({
        userId: user._id,
        page: requestPage,
        limit: itemsPerPage,
        search: search
      }));

      if (response.payload.success) {
        setEnrollments(response.payload.data);
        setTotalEnrollments(response.payload.totalEnrollments);
        setProgressCount(response.payload.progressCount);
        setCompletedCount(response.payload.completedCount);
        
        // If this was a new search and we reset to page 1, update the page state
        if (isNewSearch && page !== 1) {
          setCurrentPage(1);
        }
      } else {
        setError(response.payload.message || "Failed to fetch enrollments");
        // Even on error, clear previous data to ensure UI consistency
        setEnrollments([]);
      }
    } catch (error) {
      setError("An error occurred while fetching enrollments");
      console.error("An error occurred while fetching enrollments:", error);
      // Clear previous data on error
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, user, itemsPerPage]);

  // Combined effect for both initial load and search term changes
  useEffect(() => {
    // Whenever debouncedSearchTerm or currentPage changes, fetch data
    
    if (searchTerm !== debouncedSearchTerm) {
      // Still debouncing, don't fetch yet
      return;
    }
    
    fetchEnrollments(currentPage, debouncedSearchTerm, debouncedSearchTerm !== "");
  }, [fetchEnrollments, currentPage, debouncedSearchTerm, searchTerm]);

  // Navigate to course learning page
  const handleCourseSelect = (enrollmentId: string) => {
    navigate(`/student/MycourseLearning`, { state: { enrollmentId } });
  };

  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Handle retry button click
  const handleRetry = () => {
    if (user?._id) {
      setError(null);
      fetchEnrollments(1, searchTerm, true);
    } else {
      console.error("User ID is undefined");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-4">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Courses Enrolled
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalEnrollments}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-4">
              <GraduationCap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {progressCount}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-4">
              <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {completedCount}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Course Grid with Search and Filtering */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
            My Learning Collection
          </h2>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
            {debouncedSearchTerm !== searchTerm && (
              <div className="absolute right-3 top-2.5 h-5 w-5">
                <div className="w-4 h-4 border-t-2 border-purple-500 border-r-2 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 dark:border-purple-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : enrollments.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {enrollments.map((enrollment) => (
                <motion.div
                  key={enrollment._id}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => handleCourseSelect(enrollment._id!)}
                  className="cursor-pointer h-full"
                >
                  <CourseCard enrollment={enrollment} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-6 mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || loading}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pagination numbers intelligently
                    let pageToShow;
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      // If near start, show first 5 pages
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If near end, show last 5 pages
                      pageToShow = totalPages - 4 + i;
                    } else {
                      // Show 2 before and 2 after current page
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => setCurrentPage(pageToShow)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === pageToShow
                            ? "bg-purple-600 dark:bg-purple-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-600/20"
                        } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || loading}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <GraduationCap className="w-20 h-20 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-300 text-xl mb-6">
              {searchTerm
                ? "No courses match your search"
                : "You haven't enrolled in any courses yet"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors mr-4"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                Explore Courses
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  </div>
  );
};

export default StudentCourses;