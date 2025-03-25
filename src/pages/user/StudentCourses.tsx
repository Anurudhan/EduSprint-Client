import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux";
import { CompleationStatus, EnrollmentEntity } from "../../types";
import { getEnrollmentByUserIdAction } from "../../redux/store/actions/enrollment";
import { CourseCard } from "../../components/user/StudentMyCourseCard";
import {
  Award,
  BookOpen,
  GraduationCap,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

// Component: StudentCourses
const StudentCourses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.user.data);
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<
    EnrollmentEntity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const response = await dispatch(getEnrollmentByUserIdAction(user._id));

        if (response.payload.success) {
          setEnrollments(response.payload.data);
          setFilteredEnrollments(response.payload.data);
        } else {
          setError(response.payload.message || "Failed to fetch enrollments");
        }
      } catch (error) {
        setError("An error occurred while fetching enrollments");
        console.error("An error occurred while fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [dispatch, user]);

  // Filter enrollments based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEnrollments(enrollments);
    } else {
      const filtered = enrollments.filter(
        (enrollment) =>
          enrollment.course?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enrollment.course?.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredEnrollments(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, enrollments]);

  // Navigate to course learning page
  const handleCourseSelect = (enrollmentId: string) => {
    navigate(`/student/MycourseLearning`, { state: { enrollmentId } });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnrollments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page changes
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
    <div className="min-h-screen bg-gray-50">
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
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Courses Enrolled
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {enrollments.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center">
              <div className="rounded-full bg-teal-100 p-4">
                <GraduationCap className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    enrollments.filter(
                      (e) => e.completionStatus === CompleationStatus.inProgress
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center">
              <div className="rounded-full bg-amber-100 p-4">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    enrollments.filter(
                      (e) => e.completionStatus === CompleationStatus.Completed
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Course Grid with Search and Filtering */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              My Learning Collection
            </h2>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={() => {
                  if (user?._id) {
                    dispatch(getEnrollmentByUserIdAction(user._id));
                  } else {
                    console.error("User ID is undefined");
                  }
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredEnrollments.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentItems.map((enrollment) => (
                  <motion.div
                    key={enrollment._id}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleCourseSelect(enrollment._id!)}
                    className="cursor-pointer h-full" // Fixed height container
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
            disabled={currentPage === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </motion.button>

          <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}
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
          ) : (
            <motion.div
              className="text-center py-16 bg-gray-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl mb-6">
                {searchTerm
                  ? "No courses match your search"
                  : "You haven't enrolled in any courses yet"}
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Explore Courses
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default StudentCourses;
