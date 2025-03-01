import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import { CompleationStatus, EnrollmentEntity } from '../../types';
import { getEnrollmentByUserIdAction } from '../../redux/store/actions/enrollment';
import { CourseLearning } from '../../components/user/CourseLearning';
import { CourseCard } from '../../components/user/StudentMyCourseCard';
import { Award, BookOpen, GraduationCap } from 'lucide-react';
import { commonRequest, URL } from '../../common/api';
import { config } from '../../common/config';
// Component: StudentCourses
const StudentCourses = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.user.data);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentEntity | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentEntity[]>([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) return;
      try {
        const response = await dispatch(getEnrollmentByUserIdAction(user._id));
        console.log(response.payload.data,"This is the enrollement data from user")
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

  
  const handleLessonComplete = async (enrollmentId: string, lessonNumber: string,assessmentId:string) => {
    try {

      const calculateOverallCompletionPercentage = (): number => {
        // Example logic: Calculate percentage based on completed lessons and total lessons
        const totalLessons = selectedEnrollment?.course?.lessons?.length || 1; // Avoid division by zero
        const completedLessons = selectedEnrollment?.progress?.completedLessons?.length || 0;
        return (completedLessons / totalLessons) * 100;
    };
    
    const calculateCompletionStatus = (): CompleationStatus => {
        const percentage = calculateOverallCompletionPercentage();
        if (percentage === 100) {
            return CompleationStatus.Completed;
        } else if (percentage > 0) {
            return CompleationStatus.inProgress;
        } else {
            return CompleationStatus.enrolled;
        }
    };

      const requestBody: Partial<EnrollmentEntity> = {
        _id: enrollmentId,
        userId: user?._id,
        courseId: selectedEnrollment?.course?._id,
        progress: {
            completedLessons: [...(selectedEnrollment?.progress?.completedLessons||[]),lessonNumber],
            completedAssessments: [...(selectedEnrollment?.progress?.completedAssessments||[]),assessmentId],
            overallCompletionPercentage: calculateOverallCompletionPercentage(),
        },
        completionStatus: calculateCompletionStatus(),
        
    };
      const response = await  commonRequest<EnrollmentEntity>(
        'PUT',
        `${URL}/course/enrollment`,
        requestBody,
          config
        )

      if (!response.success) {
        // If the API call fails, revert the optimistic update
        console.error('Failed to update lesson completion status:', response.message);
        // Refresh enrollments to ensure sync with backend
        
      }
      const data = await response.data;
      setSelectedEnrollment(data)
    } catch (error) {
      console.error('Error updating lesson completion status:', error);
      // Refresh enrollments to ensure sync with backend
      // dispatch(getEnrollmentByUserIdAction(user?._id as string));
    }
  };
    if (selectedEnrollment) {
      return (
        <CourseLearning
          enrollment={selectedEnrollment}
          onLessonComplete={(lessonNumber,assessmentId) => handleLessonComplete(selectedEnrollment._id!, lessonNumber,assessmentId)}
          onBack={() => setSelectedEnrollment(null)}
        />
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
                  <p className="text-2xl font-semibold text-gray-900">{enrollments.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enrollments.filter(e => e.completionStatus === CompleationStatus.inProgress).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enrollments.filter(e => e.completionStatus === CompleationStatus.Completed).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                onClick={() => setSelectedEnrollment(enrollment)}
                className="cursor-pointer"
              >
                <CourseCard enrollment={enrollment} />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
};


// // Utility Function: getTotalDuration
// const getTotalDuration = (lessons: Lesson[]): string => {
//   const totalSeconds = lessons.reduce((total, lesson) => {
//     if (!lesson.duration) return total;
//     const [hours, minutes, seconds] = lesson.duration.split(':').map(Number);
//     return total + hours * 3600 + minutes * 60 + seconds;
//   }, 0);

//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   return [hours, minutes, seconds]
//     .map((unit) => String(unit).padStart(2, '0'))
//     .join(':');
// };

export default StudentCourses;

