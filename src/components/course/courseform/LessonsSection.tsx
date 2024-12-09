import { Plus } from "lucide-react";
import { CourseEntity } from "../../../types/ICourse";
import LessonInput from "./LessonInput";

const LessonsSection: React.FC<{
    course: Partial<CourseEntity>, 
    setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>,
    onVideoUpload: (file: File,lessonIndex:number) => void,
    progress:number
  }> = ({ 
    course, 
    setCourse, 
    onVideoUpload,
    progress
  }) => {
    const addLesson = () => {
      setCourse(prev => ({
        ...prev,
        lessons: [...(prev.lessons || []), {
          lessonNumber: `${(prev.lessons?.length || 0) + 1}`,
          title: '',
          description: '',
          video: '',
          duration: '',
          objectives: ['']
        }]
      }));
    };
  
    const removeLesson = (indexToRemove: number) => {
      setCourse(prev => {
        const newLessons = prev.lessons?.filter((_, index) => index !== indexToRemove)
          .map((lesson, index) => ({
            ...lesson,
            lessonNumber: `${index + 1}` // Update lesson numbers
          }));
        
        return {
          ...prev,
          lessons: newLessons
        };
      });
    };
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Lessons</h3>
          <button
            type="button"
            onClick={addLesson}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </button>
        </div>
  
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
          />
        ))}
      </div>
    );
  };
export default LessonsSection;  