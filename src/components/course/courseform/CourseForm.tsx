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
      else setMessage("UnKnown error from the thumbnail image uploading time");
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
    const allVideosValid = course.lessons?.every(
      (lesson) =>
        lesson.video &&
        isValidDuration(lesson.duration) &&
        lesson.video.trim().length > 0
    );
    const hasThumbnail = course.thumbnail && course.thumbnail.trim().length > 0;
    const isValid =
      hasTitle && hasDescription && allVideosValid && hasThumbnail;
    return isValid;
  };

  const handleVideoUpload = async (file: File, lessonIndex: number) => {
    try {
      if (file) {
        console.log(lessonIndex, "This is index");
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
      }
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("UnKnown error from the thumbnail image uploading time");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fill in all required fields and upload videos.");
      setType("error");
      return;
    }
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
      setType("success");
    } else {
      navigate("/instructor/mycourses", {
        state: { message: response.payload.message },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Create New Course</h2>

      <div className="space-y-6">
        <BasicCourseInfo course={course} setCourse={setCourse} />

        <PricingSection course={course} setCourse={setCourse} />

        <ThumbnailUpload
          onUpload={handleThumbnailUpload}
          thumbnailPreview={thumbnailPreview}
        />

        <LessonsSection
          course={course}
          setCourse={setCourse}
          onVideoUpload={(file: File, lessonIndex: number) =>
            handleVideoUpload(file, lessonIndex)
          }
          progress={progress}
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate("/instructor/mycourses", { replace: true })}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700`}
          >
            Publish Course
          </button>
        </div>
      </div>

      {message && (
        <MessageToast
          message={message}
          type={type}
          onMessage={(Message) => setMessage(Message)}
        />
      )}
    </form>
  );
}
