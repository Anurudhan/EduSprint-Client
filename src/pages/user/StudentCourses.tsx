import { Clock, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { EnrollmentEntity } from '../../types';
import { getEnrollmentByUserIdAction } from '../../redux/store/actions/enrollment';
import { CourseEntity, Lesson } from '../../types/ICourse';
import { StudentCourseView } from './StudentCourseView';

// Component: StudentCourses
const StudentCourses = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.user.data);
  const [selectedCourse, setSelectedCourse] = useState<CourseEntity | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) return;
      try {
        const response = await dispatch(getEnrollmentByUserIdAction(user._id));
        if (response.payload.success) {
          setEnrollments(response.payload.data);
        } else {
          console.error('Failed to fetch enrollments:', response.payload.message);
        }
      } catch (error) {
        console.error('An error occurred while fetching enrollments:', error);
      }
    };
    fetchEnrollments();
  }, [dispatch, user]);

  const handleContinueCourse = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.course?._id === courseId);
    if (enrollment?.course) {
      setSelectedCourse(enrollment.course);
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };
  const handleLessonComplete = (lessonNumber: string, enrollmentId: string) => {
    console.log(`Lesson ${lessonNumber} completed for enrollment ${enrollmentId}`);
    // Add your logic to handle lesson completion
  };
  
  const handleAssessmentComplete = (
    lessonNumber: string,
    score: number,
    enrollmentId: string
  ) => {
    console.log(
      `Assessment for lesson ${lessonNumber} completed with score ${score} for enrollment ${enrollmentId}`
    );
    // Add your logic to handle assessment completion
  };
  

  const handleProgressUpdate = (
    enrollmentId: string,
    update: Partial<EnrollmentEntity['progress']>
  ) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e._id === enrollmentId ? { ...e, progress: { ...e.progress, ...update } } : e
      )
    );
  };

  if (selectedCourse) {
    const enrollment = enrollments.find((e) => e.course?._id === selectedCourse._id);
    if (!enrollment) {
      return <div>No enrollment found for this course.</div>;
    } 
    return (
      <StudentCourseView
        enrollment={enrollment}
        onBack={handleBack}
        onProgressUpdate={handleProgressUpdate}
        onLessonComplete={handleLessonComplete}
        onAssessmentComplete={handleAssessmentComplete}
      />
    );
    
  }
console.log(enrollments, "this is our enrollements")
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h1>
        <button onClick={() => navigate('/student/allcourse')} className="btn btn-primary">
          Browse All Courses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => (
          <CourseCard
            key={enrollment._id}
            enrollment={enrollment}
            onContinue={handleContinueCourse}
          />
        ))}
      </div>
    </div>
  );
};

// Component: CourseCard
const CourseCard = ({
  enrollment,
  onContinue,
}: {
  enrollment: EnrollmentEntity;
  onContinue: (courseId: string) => void;
}) => {
  const { course, progress } = enrollment;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-48">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">{course?.title}</h3>
          <p className="text-sm text-gray-200">{course?.instructor?.userName}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{course?.lessons ? getTotalDuration(course.lessons) : '00:00:00'}</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            <span>{course?.lessons?.length || 0} lessons</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {progress?.overallCompletionPercentage || 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress?.overallCompletionPercentage || 0}%` }}
            />
          </div>
        </div>

        <button
          className="w-full btn btn-secondary"
          onClick={() => onContinue(course?._id || '')}
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

// Utility Function: getTotalDuration
const getTotalDuration = (lessons: Lesson[]): string => {
  const totalSeconds = lessons.reduce((total, lesson) => {
    if (!lesson.duration) return total;
    const [hours, minutes, seconds] = lesson.duration.split(':').map(Number);
    return total + hours * 3600 + minutes * 60 + seconds;
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(':');
};

export default StudentCourses;
