import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CourseEntity } from "../../types/ICourse";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getCourseByIdAction } from "../../redux/store/actions/course/getCourseByIdAction";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { createEnrollmentAction, getEnrollmentByUserIdAction } from "../../redux/store/actions/enrollment";
import { RootState } from "../../redux";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentSessionAction } from "../../redux/store/actions/payment/createPaymentSessionAction";
import { storeObject } from "../../utilities/localStorage";
import { EnrollmentEntity } from "../../types";

function EnrollmentPage() {
  const { data } = useAppSelector((state: RootState) => state.user);
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseEntity>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getCourseByIdAction(id));
        if (response.payload.success) {
          setCourse(response.payload.data);
        } else {
          console.error("Failed to fetch course:", response.payload.message);
        }
      } catch (error) {
        console.error("Failed to fetch course. Please try again later.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [dispatch, id]);
  const handleFetchEnrollment = useCallback(async () => {
    try {
      if (data && data._id) {
        const response = await dispatch(getEnrollmentByUserIdAction({userId:data._id,page:1,limit:0,search:""}));
        response.payload.data.forEach((item: EnrollmentEntity) => {
          if (item?.courseId === course._id) {
            setIsEnrolled(true);
          }
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching enrollment:", error);
    }
  }, [data, course, dispatch]);
  useEffect(() => {
    if (data?._id && course?._id) {
      handleFetchEnrollment();
    }
  }, [data, course, handleFetchEnrollment]);
  const totalLessons = course.lessons?.length || 0;
  const totalDuration =
    course.lessons?.reduce(
      (sum, lesson) => sum + (parseFloat(lesson.duration || "0") || 0),
      0
    ) || 0;

  // Get the video URL from the first lesson, if available
  const firstLessonVideo = course.lessons && course.lessons[0]?.video;

  if (!course) {
    return (
      <div className="text-center text-lg text-red-600">Course not found</div>
    );
  }
  const handleEnrollment = async () => {
    try {
      console.log("the enrollment button is oke,",course.pricing?.type)
      if (course.pricing?.type === "paid") {
        handlePayment();
        return;
      }
      if (!data || !data._id) return;
      const response = await dispatch(
        createEnrollmentAction({
          userId: data?._id,
          courseId: id,
          enrolledAt: new Date().toISOString(),
        })
      );
      if (response.payload?.success) {
        navigate("/student/mycourses")
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };
  const handlePayment = async () => {
    try {
      if (!data || !data._id) return;
      else if (
        !course.title ||
        !course.thumbnail ||
        !course._id ||
        !course.pricing?.amount
      )
        return;
      console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
      );
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }
      const sessionData = {
        courseName: course?.title,
        courseThumbnail: course?.thumbnail,
        courseId: course._id,
        amount: course?.pricing?.amount,
        userId: data._id,
      };
      const response = await dispatch(createPaymentSessionAction(sessionData));
      if (!response?.payload || !response?.payload?.success) {
        throw new Error("Something went wrong, try again!");
      }

      storeObject("payment_session", {
        ...response.payload?.data,
        amount: course?.pricing?.amount,
        instructorId: course?.instructorRef,
      });

      const sessionId = response.payload.data.sessionId;

      setLoading(false);
      const result = await stripe?.redirectToCheckout({ sessionId });

      if (result?.error) {
        throw new Error(result.error.message);
      }
      //   if (result.error) {
      //     console.error('Payment failed:', result.error.message);
      //   } else if (result.paymentIntent?.status === 'succeeded') {
      //     console.log('Payment successful!', result.paymentIntent);
      //   }
    } catch (error: unknown) {
      console.log(error);
    }
  };
console.log(isEnrolled)
  return (
    <div
      className={`max-w-5xl mx-auto p-6 rounded-lg shadow-xl dark:text-white text-black`}
    >
      <h2 className="text-4xl font-bold mb-6 text-center">
        Enrollment Details
      </h2>

      <div className={`dark:bg-gray-800  bg-gray-100 rounded-lg shadow-md p-6`}>
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full lg:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="text-3xl font-bold mb-3">{course.title}</h3>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <p className="mb-2">
                <strong>Category:</strong> {course.category?.name || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Language:</strong> {course.language || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Level:</strong> {course.level || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Students Enrolled:</strong>{" "}
                {course.studentsEnrolled || "0"}
              </p>
              <p className="mb-2">
                <strong>Lessons:</strong> {totalLessons} lessons,{" "}
                {totalDuration.toFixed(2)} hours
              </p>
              <div className="text-3xl font-bold mt-4">
                {course.pricing?.type === "free"
                  ? "Free"
                  : `$${course.pricing?.amount || 0}`}
              </div>
            </div>
          </div>
        </div>

        {/* Show the first lesson's video as the introduction */}
        {firstLessonVideo && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Introduction Video</h3>
            <div className="relative pb-[56.25%]">
              <iframe
                title="Course Introduction"
                src={firstLessonVideo}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate("/student/allcourse")}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-500 focus:outline-none"
          >
            Cancel
          </button>

          {/* Show Proceed to Payment only if the course is paid */}
          {isEnrolled ? (
            <button
              onClick={()=>navigate("/student/dashboard")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-500 focus:outline-none"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => handleEnrollment()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}

export default EnrollmentPage;
