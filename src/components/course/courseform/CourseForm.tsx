import { useState } from "react";
import BasicCourseInfo from "./BasicCourseInfo";
import LessonsSection from "./LessonsSection";
import PricingSection from "./PricingSection";
import ThumbnailUpload from "./ThumbnailUpload";
import { CourseEntity, Level, PricingType } from "../../../types/ICourse";
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
} from "../../../utilities/axios/claudinary";
import MessageToast from "../../common/MessageToast";
import { MessageType } from "../../../types/IMessageType";
import { useAppDispatch } from "../../../hooks/hooks";
import { addCourse } from "../../../redux/store/actions/course/addCourse";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useNavigate } from "react-router-dom";
import { editCourse } from "../../../redux/store/actions/course/editCourse";

export function CourseForm({
  courseDetails,
}: {
  courseDetails?: CourseEntity | null;
}) {
  const [course, setCourse] = useState<Partial<CourseEntity>>({
    title: courseDetails?.title ?? "",
    description: courseDetails?.description || "",
    thumbnail: courseDetails?.thumbnail || "",
    language: "English",
    level: courseDetails?.level || Level.beginner,
    pricing: courseDetails?.pricing || {
      type: PricingType.paid,
      amount: 0,
    },
    categoryRef: courseDetails?.categoryRef || "",
    lessons: courseDetails?.lessons || [],
  });
  const [message, setMessage] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    course.thumbnail ?? null
  );
  const [type, setType] = useState<MessageType>("error");
  const [progress, setProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state: RootState) => state.user);

  // Mock upload functions
  const handleThumbnailUpload = async (file: File) => {
    try {
      if (file) {
        const imageUrl = await uploadToCloudinary(file);
        setThumbnailPreview(imageUrl as string);
        setCourse((prev) => ({ ...prev, thumbnail: imageUrl }));
      }
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("Unknown error while uploading thumbnail image");
      setType("error");
    }
  };
  
  const durationRegex = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/;
  const isValidDuration = (duration?: string) => {
    if (!duration) return false;
    const match = duration.match(durationRegex);
    if (!match) return false;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);

    return (
      hours >= 0 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60
    );
  };

  const validateForm = () => {
    const hasTitle = course.title && course.title.trim().length > 0;
    const hasDescription =
      course.description && course.description.trim().length > 0;
    const hasThumbnail = course.thumbnail && course.thumbnail.trim().length > 0;
    
    // Check if there are any lessons
    const hasLessons = course.lessons && course.lessons.length > 0;
    
    // Only validate videos if there are lessons
    const allVideosValid = hasLessons 
      ? course.lessons?.every(
          (lesson) =>
            lesson.video &&
            isValidDuration(lesson.duration) &&
            lesson.video.trim().length > 0
        )
      : true;
    
    if (!hasTitle) {
      setMessage("Please provide a course title");
      return false;
    }
    
    if (!hasDescription) {
      setMessage("Please provide a course description");
      return false;
    }
    
    if (!hasThumbnail) {
      setMessage("Please upload a course thumbnail");
      return false;
    }
    
    if (!hasLessons) {
      setMessage("Please add at least one lesson to your course");
      return false;
    }
    
    if (!allVideosValid) {
      setMessage("Please ensure all lessons have valid videos and durations");
      return false;
    }
    
    return true;
  };

  const handleVideoUpload = async (file: File, lessonIndex: number) => {
    try {
      if (file) {
        setMessage("Uploading video...");
        setType("info");
        
        const videoUrl = await uploadVideoToCloudinary(file, (progress) => {
          setProgress(progress); // Update progress in real-time
        });
        
        const updatedLessons = course.lessons?.map((lesson, index) => {
          if (lessonIndex === index) {
            return { ...lesson, video: videoUrl };
          }
          return lesson;
        });
        
        setCourse((prev) => ({ ...prev, lessons: updatedLessons }));
        setMessage("Video uploaded successfully!");
        setType("success");
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("Unknown error while uploading video");
      setType("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setType("error");
      setIsSubmitting(false);
      return;
    }
    
    try {
      let response;
      if (courseDetails) {
        response = await dispatch(
          editCourse({
            data: { ...course, _id: courseDetails._id },
            studentId: "",
          })
        );
      } else {
        response = await dispatch(
          addCourse({ ...course, instructorRef: data?._id, language: "English" })
        );
      }
      
      if (!response.payload.success) {
        setMessage(response.payload.message);
        setType("error");
      } else {
        navigate("/instructor/mycourses", {
          state: { message: response.payload.message },
        });
      }
    } catch (error) {
      console.log(error)
      setMessage("An unexpected error occurred");
      setType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
          {courseDetails ? "Edit Course" : "Create New Course"}
        </h2>

        <div className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Course Details</h3>
            <BasicCourseInfo course={course} setCourse={setCourse} />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Pricing</h3>
            <PricingSection course={course} setCourse={setCourse} />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Course Thumbnail</h3>
            <ThumbnailUpload
              onUpload={handleThumbnailUpload}
              thumbnailPreview={thumbnailPreview}
            />
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Course Content</h3>
            <LessonsSection
              course={course}
              setCourse={setCourse}
              onVideoUpload={handleVideoUpload}
              progress={progress}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => navigate("/instructor/mycourses", { replace: true })}
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </div>
              ) : (
                "Publish Course"
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6">
            <MessageToast
              message={message}
              type={type}
              onMessage={(Message) => setMessage(Message)}
            />
          </div>
        )}
      </form>
    </div>
  );
}