import  { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Clock, Users, Star } from 'lucide-react';
import { CourseEntity, Level } from '../../../types/ICourse';
import MessageToast from '../../../components/common/MessageToast';
import { useAppDispatch } from '../../../hooks/hooks';
import { getCoursesByInstructorIdAction } from '../../../redux/store/actions/course/getCoursesByInstructorIdAction';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import LoadingSpinner from '../../../components/common/loadingSpinner';

export function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const {data} = useSelector((state:RootState)=>state.user)
  const location = useLocation();
  const [courses,setCourse] = useState<CourseEntity[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const dispatch =useAppDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(
    location.state?.message || null
  );
  
  const type = "success"
  const getLevelColor = (level: Level) => {
    switch (level) {
      case Level.beginner:
        return 'bg-green-100 text-green-800';
      case Level.intermediate:
        return 'bg-blue-100 text-blue-800';
      case Level.advanced:
        return 'bg-purple-100 text-purple-800';
    }
  };
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getCoursesByInstructorIdAction(data?._id as string))
        console.log(response.payload.data)
        if(response.payload.success){
          setCourse(response.payload.data);
        }
      } catch (error) {
        console.error("Failed to fetch Course by using Instructor refference:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [dispatch,data?._id]);
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Create your first course to start teaching.</p>
          <Link
            to="/instructor/create-course"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id?.toString()} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level?course?.level:Level.beginner)}`}>
                    {course.level}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.lessons?course.lessons.length:0} lessons</span>
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
                    {course.pricing?course.pricing.type === 'free' ? 'Free' : `$${course.pricing.amount}`:"paid"}
                  </span>
                  <div className="space-x-2">
                    <button
                    onClick={()=>{
                      navigate(`/instructor/edit-course`, { state: { courseId:course._id } })
                    }}
                     className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Edit
                    </button>
                    <button 
                    onClick={() => navigate("/instructor/mycourse-details", { state: { course } })}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {message && (
        <MessageToast
          message={message}
          type={type}
          onMessage={(Message) =>{
            setMessage(Message);
            location.state="";
          }
          }
        />
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
}