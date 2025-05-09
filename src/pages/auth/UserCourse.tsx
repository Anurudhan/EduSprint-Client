import { useState, useEffect } from "react";
import { SearchBar } from "../../components/common/Search/SearchBar";
import { Filters } from "../../components/course/Filters";
import { CourseCard } from "../../components/course/card/CourseCard";
import { Pagination } from "../../components/common/Pagination/Pagination";
import { CourseEntity, FilterState } from "../../types/ICourse";
import { useAppDispatch } from "../../hooks/hooks";
import { getAllCourse } from "../../redux/store/actions/course/getAllCourse";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { SearchX } from "lucide-react";
import { MessageType } from "../../types/IMessageType";
import MessageToast from "../../components/common/Toast/MessageToast";

function UserCourse() {
  const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const type: MessageType = "info";
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceType: "",
    minPrice: 0,
    maxPrice: 1000,
    level: "",
    minRating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await dispatch(
          getAllCourse({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            filters: filters,
          })
        );

        if (response.payload.success) {
          setCourses(response.payload.data.courses);
          setTotalPages(response.payload.data.totalPages);
        } else {
          console.log("Failed to fetch courses:", response.payload.message);
        }
      } catch (error) {
        console.log("Failed to fetch courses. Please try again later.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, filters, dispatch]);

  const handleMessage = (message: string) => {
    setMessage(message);
  };

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  return (
    <div className={`container mx-auto px-4 py-20 min-h-screen`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4 pl-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center lg:text-left">
          Explore Courses
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:gap-8 lg:justify-start w-full lg:w-auto">
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
          />
          <div className="mt-4 sm:mt-0 sm:ml-4 flex justif-end sm:flex-row flex-col">
            <Filters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} onMessage={handleMessage} />
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center pt-28 pb-28">
            <div className="text-6xl text-gray-500 dark:text-gray-400 mb-4">
              <SearchX />
            </div>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Sorry, no courses match your criteria.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting the filters or search for something else.
            </p>
          </div>
        )}

        {courses.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      {message && <MessageToast message={message} type={type} onMessage={handleMessage} />}
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default UserCourse;