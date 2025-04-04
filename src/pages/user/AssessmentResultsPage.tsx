import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Trophy, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { CompleationStatus, EnrollmentEntity } from '../../types';
import { getEnrollmentByUserIdAction } from '../../redux/store/actions/enrollment';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import LoadingSpinner from '../../components/common/loadingSpinner';
import { MOTIVATIONAL_QUOTES } from '../../utilities/data/MotivationalQuotes';
import { useNavigate } from 'react-router-dom';


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
  const [allEnrollments, setAllEnrollments] = useState<EnrollmentEntity[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<EnrollmentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.data);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) {
        setLoading(false); // If no user, stop loading but don’t fetch
        return;
      }
      try {
        setLoading(true);
        const response = await dispatch(getEnrollmentByUserIdAction(user._id));
        if (!response.payload?.success) {
          throw new Error('Failed to fetch enrollments');
        }
        setAllEnrollments(response.payload.data);
        setFilteredEnrollments(response.payload.data); // Initially set filtered to all enrollments
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [dispatch, user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEnrollments(allEnrollments);
    } else {
      const filtered = allEnrollments.filter(
        (enrollment) =>
          enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enrollment.course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEnrollments(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, allEnrollments]);

  const handleStartLearning = (enrollmentId: string) => {
    navigate(`/student/MycourseLearning`, { state: { enrollmentId } });
  };

  const handleViewResults = (enrollmentId: string) => {
    navigate(`/student/assessmentResult`, { state: { enrollmentId } });
  };

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnrollments.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent whitespace-nowrap">
            Your Assessment Hub: Track, Learn, Succeed!
          </h1>
          <input
            type="text"
            placeholder="Search courses..."
            className="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredEnrollments.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No courses found matching your search.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map(enrollment => (
                <EnrollmentCourseCard
                  key={enrollment._id as string}
                  enrollment={enrollment}
                  onStartLearning={handleStartLearning}
                  onViewResults={handleViewResults}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-6 mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-purple-100"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssessmentResultsPage;