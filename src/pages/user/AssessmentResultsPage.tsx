import React, { useEffect, useState, useCallback } from 'react';
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Trophy, 
  CheckCircle2, 
  ArrowRight,
  Search 
} from 'lucide-react';
import { CompleationStatus, EnrollmentEntity } from '../../types';
import { getEnrollmentByUserIdAction } from '../../redux/store/actions/enrollment';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import LoadingSpinner from '../../components/common/loadingSpinner';
import { MOTIVATIONAL_QUOTES } from '../../utilities/data/MotivationalQuotes';
import { useNavigate } from 'react-router-dom';

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

const EnrollmentCourseCard: React.FC<{
  enrollment: EnrollmentEntity;
  onStartLearning: (courseId: string) => void;
  onViewResults: (courseId: string) => void;
}> = ({ enrollment, onStartLearning, onViewResults }) => {
  // Get a random motivational quote
  const getRandomMotivationalQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  };

  // Render course status badge
  const renderStatusBadge = () => {
    switch (enrollment.completionStatus) {
      case CompleationStatus.enrolled:
        return (
          <span className="bg-blue-500/20 text-blue-400 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/30">
            <BookOpen className="mr-1 h-3 w-3 animate-pulse" /> Pending...
          </span>
        );
      case CompleationStatus.inProgress:
        return (
          <span className="bg-yellow-500/20 text-yellow-400 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center backdrop-blur-sm transition-all duration-300 hover:bg-yellow-500/30">
            <CheckCircle2 className="mr-1 h-3 w-3 animate-pulse" /> Pending...
          </span>
        );
      case CompleationStatus.Completed:
        return (
          <span className="bg-green-500/20 text-green-400 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center backdrop-blur-sm transition-all duration-300 hover:bg-green-500/30">
            <Trophy className="mr-1 h-3 w-3 animate-bounce" /> Completed
          </span>
        );
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progressPercentage = enrollment.progress?.overallCompletionPercentage || 0;
    return (
      <div className="w-full bg-gray-300/50 dark:bg-gray-800/30 rounded-full h-1.5 mt-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    );
  };

  // Render action content with fixed height
  const renderActionContent = () => {
    const quote = getRandomMotivationalQuote();

    switch (enrollment.completionStatus) {
      case CompleationStatus.enrolled:
        return (
            <div className="bg-gray-100/80 dark:bg-white/10 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-500/20 shadow-lg h-36 flex flex-col justify-between transition-all duration-300 hover:bg-gray-200/80 dark:hover:bg-white/20">
              <div>
                <p className="italic text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">"{quote.quote}"</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">- {quote.author}</p>
                <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-pulse">
                  Assessment Pending
                </p>
              </div>
              <button 
                onClick={() => onStartLearning(enrollment._id as string)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1.5 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center text-xs font-semibold shadow-md hover:shadow-lg"
              >
                Continue Learning <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
      case CompleationStatus.inProgress:
        return (
          <div className="bg-gray-100/80 dark:bg-white/10 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-500/20 shadow-lg h-36 flex flex-col justify-between transition-all duration-300 hover:bg-gray-200/80 dark:hover:bg-white/20">
            <div>
              <p className="italic text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">"{quote.quote}"</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">- {quote.author}</p>
              <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-pulse">
                Assessment Pending
              </p>
            </div>
            <button 
              onClick={() => onViewResults(enrollment._id as string)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-1.5 rounded-md hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
            >
              View Results
            </button>
          </div>
        );
      
      case CompleationStatus.Completed:
        return (
          <div className="bg-gray-100/80 dark:bg-white/10 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-500/20 shadow-lg h-36 flex flex-col justify-between transition-all duration-300 hover:bg-gray-200/80 dark:hover:bg-white/20">
            
            <p className="italic text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">"{quote.quote}"</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">- {quote.author}</p>
              <div className="flex items-center justify-between">
              <Trophy className="h-4 w-5 text-green-500 dark:text-green-400 animate-spin-slow" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                Course Completed
              </span>
            </div>
            <button 
              onClick={() => onViewResults(enrollment._id as string)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-1.5 rounded-md hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg"
            >
              View Results
            </button>
          </div>
        );
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-sm">
      {/* Thumbnail with overlay */}
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={enrollment?.course?.thumbnail || 'https://via.placeholder.com/300x200'} 
          alt={enrollment?.course?.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-semibold text-white truncate">{enrollment?.course?.title}</h3>
          <p className="text-xs text-gray-200">
            {enrollment?.instructor?.firstName} {enrollment?.instructor?.lastName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-transparent">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            Progress: {enrollment.progress?.overallCompletionPercentage || 0}%
          </span>
          {renderStatusBadge()}
        </div>

        {renderProgressBar()}
        
        <div className="mt-4">
          {renderActionContent()}
        </div>
      </div>
    </div>
  );
};

const AssessmentResultsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.user.data);
  
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use debounce to delay search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination based on total
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
      console.error("Error fetching enrollments:", error);
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

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Navigate to course learning page
  const handleStartLearning = (enrollmentId: string) => {
    navigate(`/student/MycourseLearning`, { state: { enrollmentId } });
  };

  // Navigate to assessment results page
  const handleViewResults = (enrollmentId: string) => {
    navigate(`/student/assessmentResult`, { state: { enrollmentId } });
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
  };

  if (loading && enrollments.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Search */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent whitespace-nowrap mb-4 md:mb-0">
            Your Assessment Hub: Track, Learn, Succeed!
          </h1>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
            {debouncedSearchTerm !== searchTerm && (
              <div className="absolute right-3 top-2.5 h-5 w-5">
                <div className="w-4 h-4 border-t-2 border-purple-500 border-r-2 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </motion.div>
          

        {/* Main Content Panel */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : enrollments.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {enrollments.map(enrollment => (
                  <motion.div
                    key={enrollment._id as string}
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <EnrollmentCourseCard
                      enrollment={enrollment}
                      onStartLearning={handleStartLearning}
                      onViewResults={handleViewResults}
                    />
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
                              ? "bg-blue-600 dark:bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-600/20"
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
              <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-300 text-xl mb-6">
                {searchTerm
                  ? "No courses match your search"
                  : "You haven't enrolled in any courses yet"}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors mr-4"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => navigate("/courses")}
                  className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Explore Courses
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;