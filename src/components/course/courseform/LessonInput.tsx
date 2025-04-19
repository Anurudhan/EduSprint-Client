import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, ChevronUp, Upload, Film, Clock, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { CourseEntity, Lesson } from "../../../types/ICourse";
import { ToastService } from "../../common/Toast/ToastifyV1";

interface LessonInputProps {
  lesson: Lesson;
  index: number;
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
  removeLesson: (index: number) => Promise<void>;
  onVideoUpload: (file: File, lessonIndex: number) => void;
  progress: number;
  isLastLesson?: boolean;
  totalLessons: number;
  onValidationChange: (isValid: boolean) => void;
  lessonErrors?: Record<string, string>;
}

interface LessonErrors {
  title?: string;
  description?: string;
  video?: string;
}

const LessonInput: React.FC<LessonInputProps> = ({
  lesson,
  index,
  setCourse,
  removeLesson,
  onVideoUpload,
  progress,
  isLastLesson,
  totalLessons,
  onValidationChange,
  lessonErrors = {}
}) => {
  const [expanded, setExpanded] = useState<boolean>(isLastLesson || false);
  const [errors, setErrors] = useState<LessonErrors>({});
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  
  // Merge component errors with passed-in errors from parent
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      ...lessonErrors
    }));
  }, [lessonErrors]);
  
  // Function to validate a single field
  const validateField = (field: keyof Lesson, value: unknown): boolean => {
    let error = "";
    
    switch (field) {
      case 'title':
        if (!value?.toString().trim()) {
          error = "Lesson title is required";
        } else if (value.toString().trim().length < 3) {
          error = "Title must be at least 3 characters";
        } else if (value.toString().trim().length > 100) {
          error = "Title must be less than 100 characters";
        }
        break;
        
      case 'description':
        if (!value?.toString().trim()) {
          error = "Lesson description is required";
        } else if (value.toString().trim().length < 10) {
          error = "Description must be at least 10 characters";
        }
        break;
        
      case 'video':
        if (!value) {
          error = "Video is required";
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return error === "";
  };
  
  // Run initial validation on mount and when lesson changes
  useEffect(() => {
    // Store validation results
    const titleValid = validateField('title', lesson.title);
    const descriptionValid = validateField('description', lesson.description);
    const videoValid = validateField('video', lesson.video);
    
    // Overall validation status
    const isLessonValid = titleValid && descriptionValid && videoValid;
    
    // Inform parent component about validation status
    onValidationChange(isLessonValid);
    
  }, [lesson.title, lesson.description, lesson.video]);

  // Extract duration from video file
  const extractVideoDuration = (file: File) => {
    return new Promise<string>((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        
        // Format duration as HH:MM:SS
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        resolve(formattedDuration);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate video file
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setErrors({...errors, video: "Please upload a valid video file (MP4, WebM, or OGG)"});
      return;
    }

    // Maximum size: 500MB
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({...errors, video: "Video size must be less than 500MB"});
      return;
    }

    try {
      // Get duration from video file
      const duration = await extractVideoDuration(file);
      
      // Update lesson with extracted duration
      updateLessonField('duration', duration);
      
      // Clear video error if exists
      if (errors.video) {
        setErrors({...errors, video: undefined});
      }
      
      // Upload video file
      onVideoUpload(file, index);
    } catch (error) {
      console.error("Error extracting video duration:", error);
      setErrors({...errors, video: "Could not process video, please try again"});
    }
  };

  const updateLessonField = (field: keyof Lesson, value: string) => {
    setCourse((prev) => {
      const updatedLessons = prev.lessons?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, lessons: updatedLessons };
    });
  };

  const getVideoFileName = () => {
    if (!lesson.video) return null;
    // Extract filename from URL or path
    const parts = lesson.video.split('/');
    return parts[parts.length - 1];
  };

  const handleDeleteLesson = async () => {
    if (window.confirm(`Are you sure you want to delete Lesson ${index + 1}? This action cannot be undone.`)) {
      try {
        setIsDeleting(true);
        await removeLesson(index);
        // Parent component handles the file deletion and updating the course state
      } catch (error) {
        console.error("Error deleting lesson:", error);
        ToastService.error("Failed to delete lesson");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const navigateToLesson = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < totalLessons) {
      // Close current lesson
      setExpanded(false);
      
      // After a short delay, open the target lesson
      setTimeout(() => {
        const targetLessonElement = document.getElementById(`lesson-${targetIndex}`);
        if (targetLessonElement) {
          targetLessonElement.scrollIntoView({ behavior: 'smooth' });
          
          // Dispatch a custom event to open the target lesson
          document.dispatchEvent(new CustomEvent('openLesson', { 
            detail: { index: targetIndex } 
          }));
        }
      }, 300);
    }
  };

  // Listen for custom events to open this lesson
  useEffect(() => {
    const handleOpenLesson = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.index === index) {
        setExpanded(true);
      }
    };
    
    document.addEventListener('openLesson', handleOpenLesson);
    
    return () => {
      document.removeEventListener('openLesson', handleOpenLesson);
    };
  }, [index]);

  return (
    <div id={`lesson-${index}`} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Lesson Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          expanded ? "bg-blue-50 border-b border-gray-200" : "bg-white"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-sm font-semibold text-blue-800">{index + 1}</span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{lesson.title || `Lesson ${index + 1}`}</h4>
            {lesson.duration && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {lesson.duration}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {lesson.video && (
            <span className="inline-flex mr-3 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Video Uploaded
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Lesson Content (Expandable) */}
      {expanded && (
        <div className="bg-white p-5 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`block w-full px-4 py-3 rounded-lg shadow-sm text-sm focus:outline-none transition duration-200 ${
                errors.title
                  ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              value={lesson.title || ""}
              onChange={(e) => updateLessonField("title", e.target.value)}
              placeholder="Enter an engaging lesson title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`block w-full px-4 py-3 rounded-lg shadow-sm text-sm focus:outline-none transition duration-200 ${
                errors.description
                  ? "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
              rows={3}
              value={lesson.description || ""}
              onChange={(e) => updateLessonField("description", e.target.value)}
              placeholder="Describe what students will learn in this lesson"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Video <span className="text-red-500">*</span>
            </label>
            
            <div className={`border rounded-lg ${errors.video ? 'border-red-300' : 'border-gray-300'}`}>
              {lesson.video ? (
                <div className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center">
                        <Film className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {getVideoFileName()}
                          </p>
                          {lesson.duration && (
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" /> {lesson.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // Inform user that replacing will delete the old video
                          if (window.confirm("Replacing this video will delete the current video from storage. Continue?")) {
                            videoInputRef.current?.click();
                          }
                        }}
                        className="p-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Replace
                      </button>
                    </div>
                    
                    {/* Video Preview */}
                    <div className="mt-3 bg-black rounded overflow-hidden">
                      <video 
                        ref={videoPlayerRef}
                        className="w-full h-auto"
                        src={lesson.video}
                        controls
                        preload="metadata"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Upload lesson video</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, WebM, or OGG (max 500MB)</p>
                  
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Files
                  </button>
                  
                  {progress > 0 && progress < 100 && (
                    <div className="w-full mt-4">
                      <div className="bg-gray-200 rounded-full h-2.5 w-full">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">Uploading: {progress}%</p>
                    </div>
                  )}
                </div>
              )}
              
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </div>
            
            {errors.video && (
              <p className="mt-1 text-sm text-red-600">{errors.video}</p>
            )}
          </div>

          {/* Lesson Navigation */}
          <div className="pt-4 mt-6 border-t border-gray-200 flex justify-between">
            <div>
              <button
                type="button"
                onClick={handleDeleteLesson}
                disabled={isDeleting}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isDeleting ? "Deleting..." : "Remove Lesson"}
              </button>
            </div>
            
            <div className="flex space-x-3">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => navigateToLesson(index - 1)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous Lesson
                </button>
              )}
              
              {index < totalLessons - 1 && (
                <button
                  type="button"
                  onClick={() => navigateToLesson(index + 1)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonInput;