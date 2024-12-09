import { useEffect, useState } from "react";
import { CourseForm } from "../../../components/course/courseform/CourseForm";
import { useAppDispatch } from "../../../hooks/hooks";
import { getCourseByIdAction } from "../../../redux/store/actions/course/getCourseByIdAction";
import { useLocation } from "react-router-dom";


function EditCourse() {
  const location = useLocation();
  const courseId  = location.state.courseId
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await dispatch(getCourseByIdAction(courseId as string))
        console.log(response.payload.data,"hiaj hkak s")
        if(response.payload.success) setCourse(response.payload.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [dispatch,courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12" id="edit-course">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Edit Your Course
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Update your course details.
            </p>
          </div>
          <CourseForm courseDetails={course} /> {/* Pass the course details to the form */}
        </div>
      </div>
    </div>
  );
}

export default EditCourse;
