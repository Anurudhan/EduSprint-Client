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


// import { BookOpen, GraduationCap, Award } from 'lucide-react';


// // Mock data for demonstration
// const mockEnrollments: EnrollmentEntity[] = [
//   {
//     _id: '1',
//     completionStatus: CompleationStatus.inProgress,
//     progress: {
//       completedLessons: ['1', '2'],
//       completedAssessments: ['1'],
//       overallCompletionPercentage: 60
//     },
//     course: {
//       _id: '1',
//       title: 'Advanced Web Development',
//       description: 'Learn modern web development techniques and best practices',
//       thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
//       level: 'advanced',
//       instructorRef: 'John Doe',
//       lessons: [
//         {
//           lessonNumber: '1',
//           title: 'Introduction to Modern Web Development',
//           description: 'Overview of current web development landscape and tools',
//           video: 'https://example.com/lesson1.mp4',
//           duration: '15 mins',
//           objectives: ['Understand modern web development', 'Learn about essential tools']
//         },
//         {
//           lessonNumber: '2',
//           title: 'JavaScript Fundamentals',
//           description: 'Core concepts of JavaScript programming',
//           video: 'https://example.com/lesson2.mp4',
//           duration: '20 mins',
//           objectives: ['Master JavaScript basics', 'Understand modern ES6+ features']
//         },
//         {
//           lessonNumber: '3',
//           title: 'Advanced Concepts',
//           description: 'Advanced web development patterns and practices',
//           video: 'https://example.com/lesson3.mp4',
//           duration: '25 mins',
//           objectives: ['Learn advanced patterns', 'Master professional techniques']
//         }
//       ]
//     }
//   },
//   {
//     _id: '2',
//     completionStatus: CompleationStatus.enrolled,
//     progress: {
//       completedLessons: [],
//       completedAssessments: [],
//       overallCompletionPercentage: 0
//     },
//     course: {
//       _id: '2',
//       title: 'UI/UX Design Fundamentals',
//       description: 'Master the principles of user interface and experience design',
//       thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
//       level: 'beginner',
//       instructorRef: 'Jane Smith',
//       lessons: [
//         {
//           lessonNumber: '1',
//           title: 'Design Basics',
//           description: 'Introduction to design principles',
//           video: 'https://example.com/design1.mp4',
//           duration: '15 mins',
//           objectives: ['Understand design fundamentals', 'Learn color theory']
//         },
//         {
//           lessonNumber: '2',
//           title: 'Color Theory',
//           description: 'Understanding color in design',
//           video: 'https://example.com/design2.mp4',
//           duration: '20 mins',
//           objectives: ['Master color combinations', 'Apply color psychology']
//         }
//       ]
//     }
//   }
// ];

// function App() {
//   const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentEntity | null>(null);
//   const [enrollments, setEnrollments] = useState(mockEnrollments);

//   const handleLessonComplete = (enrollmentId: string, lessonNumber: string) => {
//     setEnrollments(prev => prev.map(enrollment => {
//       if (enrollment._id === enrollmentId) {
//         const completedLessons = new Set([
//           ...(enrollment.progress?.completedLessons || []),
//           lessonNumber
//         ]);
        
//         const totalLessons = enrollment.course?.lessons?.length || 0;
//         const progress = {
//           ...enrollment.progress,
//           completedLessons: Array.from(completedLessons),
//           overallCompletionPercentage: (completedLessons.size / totalLessons) * 100
//         };

//         return {
//           ...enrollment,
//           progress,
//           completionStatus: progress.overallCompletionPercentage === 100
//             ? CompleationStatus.Completed
//             : CompleationStatus.inProgress
//         };
//       }
//       return enrollment;
//     }));
//   };

//   if (selectedEnrollment) {
//     return (
//       <CourseLearning
//         enrollment={selectedEnrollment}
//         onLessonComplete={(lessonNumber) => handleLessonComplete(selectedEnrollment._id!, lessonNumber)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <BookOpen className="w-8 h-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
//                 <p className="text-2xl font-semibold text-gray-900">{enrollments.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <GraduationCap className="w-8 h-8 text-green-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">In Progress</p>
//                 <p className="text-2xl font-semibold text-gray-900">
//                   {enrollments.filter(e => e.completionStatus === CompleationStatus.inProgress).length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow">
//             <div className="flex items-center">
//               <Award className="w-8 h-8 text-yellow-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Completed</p>
//                 <p className="text-2xl font-semibold text-gray-900">
//                   {enrollments.filter(e => e.completionStatus === CompleationStatus.Completed).length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Course Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {enrollments.map((enrollment) => (
//             <div
//               key={enrollment._id}
//               onClick={() => setSelectedEnrollment(enrollment)}
//               className="cursor-pointer"
//             >
//               <CourseCard enrollment={enrollment} />
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;