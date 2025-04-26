import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Clock, Users, Star } from "lucide-react";
import { CourseEntity, Level } from "../../../types/ICourse";
import { useAppDispatch } from "../../../hooks/hooks";
import { getCoursesByInstructorIdAction } from "../../../redux/store/actions/course/getCoursesByInstructorIdAction";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

// Modify the debounce function to accept both pageNumber and searchQuery
const createDebouncedFetch = (
  callback: (pageNumber: number, searchQuery: string) => Promise<void>
) => debounce(callback, 500);

export function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSelector((state: RootState) => state.user);
  const [courses, setCourse] = useState<CourseEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getLevelColor = (level: Level) => {
    switch (level) {
      case Level.beginner:
        return "bg-green-100 text-green-800";
      case Level.intermediate:
        return "bg-blue-100 text-blue-800";
      case Level.advanced:
        return "bg-purple-100 text-purple-800";
    }
  };
  
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Updated fetchCoursesCallback to include searchQuery
  const fetchCoursesCallback = useCallback(
    async (pageNumber: number, query: string) => {
      setLoading(true);
      try {
        const response = await dispatch(
          getCoursesByInstructorIdAction({
            instructorId: data?._id as string,
            pageNumber: pageNumber.toString(),
            searchQuery: query // Add searchQuery to the action payload
          })
        );
        if (response.payload.success) {
          setCourse(response.payload.data.courses);
          setTotalPages(response.payload.data.totalPages);
        }
      } catch (error) {
        console.error(
          "Failed to fetch Course by using Instructor reference:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, data?._id]
  );

  const fetchCourses = useMemo(
    () => createDebouncedFetch(fetchCoursesCallback),
    [fetchCoursesCallback]
  );

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
    fetchCourses(1, query);
  };

  useEffect(() => {
    fetchCourses(page, searchQuery);
    return () => {
      fetchCourses.cancel();
    };
  }, [page, fetchCourses,searchQuery]);
  
  if(loading && courses.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link
          to="/instructor/create-course"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {courses.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No courses found matching your search" : "No courses yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? "Try adjusting your search terms or browse all courses."
              : "Create your first course to start teaching."}
          </p>
          {!searchQuery && (
            <Link
              to="/instructor/create-course"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </Link>
          )}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                fetchCourses(1, "");
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Show All Courses
            </button>
          )}
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id?.toString()}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getLevelColor(
                      course.level ? course?.level : Level.beginner
                    )}`}
                  >
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {course.lessons ? course.lessons.length : 0} lessons
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.studentsEnrolled} students</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold">
                    {course.pricing
                      ? course.pricing.type === "free"
                        ? "Free"
                        : `$${course.pricing.amount}`
                      : "paid"}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        navigate(`/instructor/edit-course`, {
                          state: { courseId: course._id },
                        });
                      }}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        navigate("/instructor/mycourse-details", {
                          state: { course },
                        })
                      }
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 mb-6 flex justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </motion.button>

          <span className="mx-4 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </motion.button>
        </div>
        </>
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
}