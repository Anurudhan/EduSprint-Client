import { useEffect, useState } from "react";
import BasicCourseInfo from "./BasicCourseInfo";
import LessonsSection from "./LessonsSection";
import PricingSection from "./PricingSection";
import ThumbnailUpload from "./ThumbnailUpload";
import { CourseEntity, Level, PricingType } from "../../../types/ICourse";
import {
  uploadToCloudinary,
  uploadVideoToCloudinary,
  deleteFromCloudinary,
} from "../../../utilities/axios/claudinary";
import { useAppDispatch } from "../../../hooks/hooks";
import { addCourse } from "../../../redux/store/actions/course/addCourse";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useNavigate, useLocation } from "react-router-dom";
import { editCourse } from "../../../redux/store/actions/course/editCourse";
import { ToastService } from "../../common/Toast/ToastifyV1";

// Key for storing form data in localStorage
const COURSE_FORM_DATA_KEY = "courseFormData";
const COURSE_FORM_STEP_KEY = "courseFormStep";

export function CourseForm({ courseDetails }: { courseDetails?: CourseEntity | null }) {
  // Initialize course state from localStorage or props
  const [course, setCourse] = useState<Partial<CourseEntity>>(() => {
    // Try to get saved form data from localStorage
    const savedFormData = localStorage.getItem(COURSE_FORM_DATA_KEY);
    if (savedFormData) {
      try {
        return JSON.parse(savedFormData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
    
    // Fall back to courseDetails prop or default values
    return {
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
    };
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(course.thumbnail ?? null);
  const [progress, setProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Track original files to know what to delete
  const originalThumbnail = courseDetails?.thumbnail as string || "";
  const [originalLessonVideos, setOriginalLessonVideos] = useState<Record<number, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useSelector((state: RootState) => state.user);

  // Multi-step form logic
  const [step, setStep] = useState<number>(() => {
    return parseInt(localStorage.getItem(COURSE_FORM_STEP_KEY) || "0", 10);
  });

  // Store original lesson videos for tracking changes
  useEffect(() => {
    if (courseDetails?.lessons) {
      const videos: Record<number, string> = {};
      courseDetails.lessons.forEach((lesson, index) => {
        if (lesson.video) {
          videos[index] = lesson.video;
        }
      });
      setOriginalLessonVideos(videos);
    }
  }, [courseDetails]);

  // Save course data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(COURSE_FORM_DATA_KEY, JSON.stringify(course));
  }, [course]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem(COURSE_FORM_STEP_KEY, step.toString());
  }, [step]);

  // Clear localStorage when component unmounts or when navigating away
  useEffect(() => {
    return () => {
      // Only clear localStorage if not submitting the form
      // This prevents data loss during navigation caused by form submission
      if (!isSubmitting) {
        localStorage.removeItem(COURSE_FORM_STEP_KEY);
        localStorage.removeItem(COURSE_FORM_DATA_KEY);
      }
    };
  }, [location, isSubmitting]);

  // Basic info validation (Step 0)
  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!course.title || course.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }
    
    if (!course.description || course.description.trim().length === 0) {
      newErrors.description = "Description is required";
    }
    
    if (!course.level) {
      newErrors.level = "Please select a difficulty level";
    }
    
    if (!course.categoryRef) {
      newErrors.categoryRef = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pricing and thumbnail validation (Step 1)
  const validatePricingAndThumbnail = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (course.pricing?.type === PricingType.paid) {
      if (!course.pricing.amount || course.pricing.amount <= 0) {
        newErrors.pricingAmount = "Price must be greater than zero for paid courses";
      }
    }
    
    if (!course.thumbnail) {
      newErrors.thumbnail = "Course thumbnail is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lessons validation (Step 2)
  const validateLessons = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!course.lessons || course.lessons.length === 0) {
      newErrors.lessons = "At least one lesson is required";
    } else {
      course.lessons.forEach((lesson, index) => {
        if (!lesson.title || lesson.title.trim().length < 5) {
          newErrors[`lesson_${index}_title`] = `Lesson ${index + 1}: Title must be at least 5 characters long`;
        }
        
        if (!lesson.description || lesson.description.trim().length === 0) {
          newErrors[`lesson_${index}_description`] = `Lesson ${index + 1}: Description is required`;
        }
        
        if (!lesson.video) {
          newErrors[`lesson_${index}_video`] = `Lesson ${index + 1}: Video is required`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Complete form validation (for final submit)
  const validateForm = (): boolean => {
    const basicInfoValid = validateBasicInfo();
    const pricingAndThumbnailValid = validatePricingAndThumbnail();
    const lessonsValid = validateLessons();
    
    return basicInfoValid && pricingAndThumbnailValid && lessonsValid;
  };

  const validateThumbnailFile = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      ToastService.error("Please upload a valid image file (JPEG, PNG, JPG, WEBP, GIF)");
      return false;
    }
    return true;
  };

  const validateVideoFile = (file: File): boolean => {
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type)) {
      ToastService.error("Please upload a valid video file (MP4, WEBM, OGG, QuickTime)");
      return false;
    }
    return true;
  };

  const handleThumbnailUpload = async (file: File) => {
    try {
      if (!validateThumbnailFile(file)) return;
      
      // If replacing an existing thumbnail, delete the old one
      if (originalThumbnail && course.thumbnail === originalThumbnail) {
        ToastService.info("Replacing previous thumbnail...");
        await deleteFromCloudinary(originalThumbnail);
      }
      
      const imageUrl = await uploadToCloudinary(file);
      setThumbnailPreview(imageUrl as string);
      setCourse((prev) => ({ ...prev, thumbnail: imageUrl }));
      
      if (errors.thumbnail) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.thumbnail;
          return newErrors;
        });
      }
    } catch (error: unknown) {
      ToastService.error(error instanceof Error ? error.message : "Unknown error while uploading thumbnail image");
    }
  };

  const handleVideoUpload = async (file: File, lessonIndex: number) => {
    try {
      if (!validateVideoFile(file)) return;

      ToastService.info("Uploading video...");
      
      // If replacing an existing video, delete the old one
      if (originalLessonVideos[lessonIndex]) {
        const existingVideo = course.lessons?.[lessonIndex]?.video;
        if (existingVideo === originalLessonVideos[lessonIndex]) {
          ToastService.info("Replacing previous video...");
          await deleteFromCloudinary(existingVideo);
        }
      }

      const videoUrl = await uploadVideoToCloudinary(file, (progress) => {
        setProgress(progress);
      });

      const updatedLessons = course.lessons?.map((lesson, index) =>
        lessonIndex === index ? { ...lesson, video: videoUrl } : lesson
      );

      setCourse((prev) => ({ ...prev, lessons: updatedLessons }));
      ToastService.success("Video uploaded successfully!");

      if (errors[`lesson_${lessonIndex}_video`]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[`lesson_${lessonIndex}_video`];
          return newErrors;
        });
      }
    } catch (error: unknown) {
      ToastService.error(error instanceof Error ? error.message : "Unknown error while uploading video");
    }
  };

  // Handle lesson deletion
  const handleLessonDelete = async (lessonIndex: number) => {
    try {
      // If the lesson has a video, delete it from Cloudinary
      const lessonToDelete = course.lessons?.[lessonIndex];
      if (lessonToDelete?.video) {
        await deleteFromCloudinary(lessonToDelete.video);
      }
      
      // Remove the lesson from the course
      const updatedLessons = course.lessons?.filter((_, index) => index !== lessonIndex);
      setCourse((prev) => ({ ...prev, lessons: updatedLessons }));
      
      // Update our tracking of original videos
      const updatedOriginalVideos = { ...originalLessonVideos };
      delete updatedOriginalVideos[lessonIndex];
      
      // Reindex remaining videos
      const reindexedVideos: Record<number, string> = {};
      Object.entries(updatedOriginalVideos).forEach(([idx, url]) => {
        const numIndex = parseInt(idx, 10);
        const newIndex = numIndex > lessonIndex ? numIndex - 1 : numIndex;
        reindexedVideos[newIndex] = url;
      });
      
      setOriginalLessonVideos(reindexedVideos);
      
      ToastService.success("Lesson deleted successfully");
    } catch (error) {
      ToastService.error("Failed to delete lesson");
      console.error(error);
    }
  };

  const handleNextStep = () => {
    let isValid = false;
    
    switch(step) {
      case 0:
        isValid = validateBasicInfo();
        break;
      case 1:
        isValid = validatePricingAndThumbnail();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      const nextStep = step + 1;
      setStep(nextStep);
    } else {
      ToastService.error("Please fix the errors before proceeding");
    }
  };

  // Clean up unused files after successful form submission
  const cleanupUnusedFiles = async () => {
    const cleanupPromises = [];
    
    // Check if original thumbnail was replaced
    if (originalThumbnail && course.thumbnail !== originalThumbnail) {
      cleanupPromises.push(deleteFromCloudinary(originalThumbnail));
    }
    
    // Check for deleted or replaced lesson videos
    Object.entries(originalLessonVideos).forEach(([indexStr, url]) => {
      const index = parseInt(indexStr, 10);
      const currentLesson = course.lessons?.[index];
      
      // If lesson was deleted or video was replaced
      if (!currentLesson || currentLesson.video !== url) {
        cleanupPromises.push(deleteFromCloudinary(url));
      }
    });
    
    if (cleanupPromises.length > 0) {
      try {
        await Promise.all(cleanupPromises);
        console.log("Cleaned up unused files from Cloudinary");
      } catch (error) {
        console.error("Error cleaning up unused files:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      ToastService.error("Please ensure all course information is complete");
      return;
    }
    
    setIsSubmitting(true);

    let response;
    try {
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
        ToastService.error(response.payload?.message || "An unexpected error occurred");
        setIsSubmitting(false);
      } else {
        // If edit was successful, clean up any unused files
        if (courseDetails) {
          await cleanupUnusedFiles();
        }
        
        // Clear localStorage after successful submission
        localStorage.removeItem(COURSE_FORM_STEP_KEY);
        localStorage.removeItem(COURSE_FORM_DATA_KEY);
        
        ToastService.success(response.payload.message);
        navigate("/instructor/mycourses", { state: { message: response.payload.message } });
      }
    } catch (error) {
      console.log(error,"this is the error I facig");
      ToastService.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  // Function to reset form data
  const resetFormData = () => {
    localStorage.removeItem(COURSE_FORM_STEP_KEY);
    localStorage.removeItem(COURSE_FORM_DATA_KEY);
    window.location.reload();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BasicCourseInfo course={course} setCourse={setCourse} errors={errors} />;
      case 1:
        return (<>
          <PricingSection course={course} setCourse={setCourse} errors={errors} />
          <ThumbnailUpload
            onUpload={handleThumbnailUpload}
            thumbnailPreview={thumbnailPreview}
            error={errors.thumbnail}
          />
        </>);
      case 2:
        return (
          <LessonsSection
            course={course}
            setCourse={setCourse}
            onVideoUpload={handleVideoUpload}
            onLessonDelete={handleLessonDelete}
            progress={progress}
            errors={errors}
          />
        );
      default:
        setStep(0);
        return <BasicCourseInfo course={course} setCourse={setCourse} errors={errors} />;
    }
  };

  const stepTitles = ["Course Details", "Pricing & Thumbnail", "Lessons"];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {courseDetails ? "Edit Course" : "Create New Course"}
          </h2>
          
          {/* Add reset button */}
          {localStorage.getItem(COURSE_FORM_DATA_KEY) && (
            <button
              type="button"
              onClick={resetFormData}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
            >
              Reset Form Data
            </button>
          )}
        </div>
        
        <div className="border-b pb-4 mb-6">
          {localStorage.getItem(COURSE_FORM_DATA_KEY) && (
            <p className="text-sm text-green-600 mb-2">
              <span className="font-medium">✓</span> Your progress is being saved automatically
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            {stepTitles.map((title, i) => (
              <div 
                key={i}
                className={`flex-1 text-center ${i < stepTitles.length - 1 ? 'border-b-2' : ''} 
                ${i <= step ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-400'}`}
              >
                <div className="relative">
                  <div 
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center
                    ${i <= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {i + 1}
                  </div>
                  <div className="mt-2">{title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">{renderStep()}</div>

        <div className="flex justify-between items-center mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`ml-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Publishing..." : courseDetails ? "Update Course" : "Publish Course"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}