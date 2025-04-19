import React, { useState } from "react";
import { Plus, Info, AlertCircle } from "lucide-react";
import { CourseEntity } from "../../../types/ICourse";
import LessonInput from "./LessonInput";

interface LessonsSectionProps {
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
  onVideoUpload: (file: File, lessonIndex: number) => void;
  onLessonDelete?: (lessonIndex: number) => Promise<void>; // New prop for file deletion
  progress: number;
  errors?: Record<string, string>;
}

const LessonsSection: React.FC<LessonsSectionProps> = ({
  course,
  setCourse,
  onVideoUpload,
  onLessonDelete,
  progress,
  errors = {}
}) => {
  const [lessonValidations, setLessonValidations] = useState<Record<number, boolean>>({});
  // Add a new lesson to the course
  const addLesson = () => {
    setCourse((prev) => ({
      ...prev,
      lessons: [
        ...(prev.lessons || []),
        {
          lessonNumber: `${(prev.lessons?.length || 0) + 1}`,
          title: "",
          description: "",
          video: "",
          duration: "",
          objectives: [""],
        },
      ],
    }));
  };

  // Remove a lesson at the specified index
  const removeLesson = async (indexToRemove: number) => {
    // If we have a deletion handler from parent, use it
    if (onLessonDelete) {
      await onLessonDelete(indexToRemove);
    } else {
      // Fallback to the default behavior if no handler is provided
      setCourse((prev) => {
        const newLessons = prev.lessons
          ?.filter((_, index) => index !== indexToRemove)
          .map((lesson, index) => ({
            ...lesson,
            lessonNumber: `${index + 1}`, // Update lesson numbers
          }));

        return {
          ...prev,
          lessons: newLessons,
        };
      });
    }
  };

  // Track lesson validation status
  const handleLessonValidationChange = (index: number, isValid: boolean) => {
    setLessonValidations(prev => ({...prev, [index]: isValid}));
  };

  const totalLessons = course.lessons?.length || 0;
  const hasLessons = totalLessons > 0;
  
  // Collect lesson-specific errors from the parent component
  const getLessonErrors = (index: number) => {
    const lessonErrors: Record<string, string> = {};
    
    // Check for title, description, video errors for this specific lesson
    if (errors[`lesson_${index}_title`]) {
      lessonErrors.title = errors[`lesson_${index}_title`].replace(`Lesson ${index + 1}: `, '');
    }
    
    if (errors[`lesson_${index}_description`]) {
      lessonErrors.description = errors[`lesson_${index}_description`].replace(`Lesson ${index + 1}: `, '');
    }
    
    if (errors[`lesson_${index}_video`]) {
      lessonErrors.video = errors[`lesson_${index}_video`].replace(`Lesson ${index + 1}: `, '');
    }
    
    return lessonErrors;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Course Lessons</h3>
          <p className="text-sm text-gray-600 mt-1">
            Structure your course content with clear, focused lessons
          </p>
        </div>
        <button
          type="button"
          onClick={addLesson}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </button>
      </div>

      {/* General Lessons Error */}
      {errors.lessons && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.lessons}</p>
            </div>
          </div>
        </div>
      )}

      {!hasLessons && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Start building your course by adding your first lesson. Each lesson should focus on a specific topic or skill.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {course.lessons?.map((lesson, index) => (
          <LessonInput
            key={index}
            lesson={lesson}
            index={index}
            course={course}
            setCourse={setCourse}
            removeLesson={removeLesson}
            onVideoUpload={onVideoUpload}
            progress={progress}
            isLastLesson={index === (course.lessons?.length || 0) - 1}
            totalLessons={totalLessons}
            onValidationChange={(isValid) => handleLessonValidationChange(index, isValid)}
            lessonErrors={getLessonErrors(index)}
          />
        ))}
      </div>

      {hasLessons && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={addLesson}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Lesson
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonsSection;