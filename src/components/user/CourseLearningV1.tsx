
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle, Award, Trophy, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Assessment } from '../../types/IAssessment';
import { AssessmentResult, EnrollmentEntity } from '../../types';
import { AssessmentResultV1 } from './AssessmentResult';
import { LessonPlayer } from './LessonPlayerV1';
import LoadingSpinner from '../common/loadingSpinner';
import { CourseLearningService } from '../../utilities/CourseLearningService';

interface LessonStatus {
  [lessonNumber: string]: 'not-started' | 'in-progress' | 'completed';
}

interface AssessmentStatus {
  [lessonNumber: string]: 'locked' | 'available' | 'completed';
}

function CourseLearningV1() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [enrollment, setEnrollment] = useState<EnrollmentEntity>({});
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>({});
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>({});
  const location = useLocation();
  const { enrollmentId } = location.state;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showLessonCompletionOptions, setShowLessonCompletionOptions] = useState(false);

  const lessons = useMemo(() => enrollment.course?.lessons || [], [enrollment]);
  const currentLesson = lessons[currentLessonIndex];
  const currentAssessment = currentLesson 
    ? assessments.find(a => a.lessonId === currentLesson.lessonNumber) 
    : null;

  useEffect(() => {
    if (enrollment.course?.lessons) {
      const initialLessonStatus = lessons.reduce((acc, lesson) => {
        const lessonNumber = lesson.lessonNumber || '';
        const isCompleted = enrollment.progress?.completedLessons?.includes(lessonNumber);
        acc[lessonNumber] = isCompleted ? 'completed' : 'not-started';
        return acc;
      }, {} as LessonStatus);
      setLessonStatus(initialLessonStatus);

      const initialAssessmentStatus = assessments.reduce((acc, assessment) => {
        const isCompleted = enrollment.progress?.completedAssessments?.includes(assessment.lessonId);
        const correspondingLessonIndex = lessons.findIndex(l => l.lessonNumber === assessment.lessonId);
        acc[assessment.lessonId] = isCompleted 
          ? 'completed' 
          : correspondingLessonIndex <= currentLessonIndex 
            ? 'available' 
            : 'locked';
        return acc;
      }, {} as AssessmentStatus);
      setAssessmentStatus(initialAssessmentStatus);
    }
  }, [enrollment, assessments, currentLessonIndex,lessons]);

  useEffect(() => {
    if (enrollmentId) {
      CourseLearningService.fetchEnrollmentAndAssessments(
        enrollmentId,
        setEnrollment,
        setAssessments,
        setLoading
      );
    }
  }, [enrollmentId]);

  const handleLessonComplete = () => {
    if (!currentLesson?.lessonNumber) return;
    CourseLearningService.handleLessonComplete(
      enrollment,
      currentLesson.lessonNumber,
      lessons,
      assessments,
      setEnrollment,
      setLessonStatus,
      setAssessmentStatus,
      setShowAssessment,
      setShowCompletionModal,
      setCurrentLessonIndex,
      currentLessonIndex,
      setShowLessonCompletionOptions
    );
  };

  const handleAssessmentComplete = (
    score: number,
    answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[]
  ) => {
    if (!currentLesson?.lessonNumber || !currentAssessment) return;
    CourseLearningService.handleAssessmentComplete(
      enrollment,
      currentLesson.lessonNumber,
      currentAssessment,
      score,
      answers,
      lessons,
      assessmentResults,
      setEnrollment,
      setAssessmentResults,
      setAssessmentStatus,
      setShowAssessment,
      setCurrentLessonIndex,
      setShowCompletionModal,
      currentLessonIndex
    );
  };

  const handleLessonSelection = (index: number) => {
    const selectedLesson = lessons[index];
    const selectedLessonNumber = selectedLesson.lessonNumber || '';
    const previousLessonIndex = index - 1;
    const previousLesson = previousLessonIndex >= 0 ? lessons[previousLessonIndex] : null;
    const previousLessonNumber = previousLesson?.lessonNumber || '';

    const isPreviousLessonCompleted = !previousLesson || 
      lessonStatus[previousLessonNumber] === 'completed';
    const isPreviousAssessmentCompleted = !previousLesson || 
      !assessments.find(a => a.lessonId === previousLessonNumber) ||
      assessmentStatus[previousLessonNumber] === 'completed';

    if (isPreviousLessonCompleted && isPreviousAssessmentCompleted) {
      setCurrentLessonIndex(index);
      setShowAssessment(false);
    } else {
      alert('Complete the previous lesson and its assessment first!');
    }
  };

  const handleLessonCompletionNavigation = (action: 'assessment' | 'next-lesson') => {
    setShowLessonCompletionOptions(false);
    if (action === 'assessment' && currentAssessment) {
      setAssessmentStatus(prev => ({
        ...prev,
        [currentLesson.lessonNumber || '']: 'available'
      }));
      setShowAssessment(true);
    } else if (action === 'next-lesson' && currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentLessonIndex === lessons.length - 1) {
      setShowCompletionModal(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!enrollment) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      Enrollment not found
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{enrollment.course?.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Course Progress</h2>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${enrollment.progress?.overallCompletionPercentage || 0}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {enrollment.progress?.overallCompletionPercentage?.toFixed(1) || 0}% Complete
                </p>
                {enrollment.progress?.totalScore !== undefined && (
                  <p className="text-sm text-gray-600">
                    Average Score: {enrollment.progress.totalScore.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <div className="space-y-3">
                {lessons.map((lesson, index) => {
                  const lessonNumber = lesson.lessonNumber || '';
                  const assessmentForLesson = assessments.find(a => a.lessonId === lessonNumber);
                  const lessonResultStatus = assessmentResults.find(r => r.lessonId === lessonNumber);

                  return (
                    <button
                      key={lessonNumber}
                      onClick={() => handleLessonSelection(index)}
                      className={`w-full text-left p-3 rounded-lg flex items-center gap-3 
                        ${index === currentLessonIndex ? 'bg-blue-50 text-blue-700' : 
                          index < currentLessonIndex ? 'bg-green-50 text-green-700' : 
                          'bg-gray-50 text-gray-400'}`}
                    >
                      {lessonStatus[lessonNumber] === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                      <span className="flex-1">{lesson.title}</span>
                      {assessmentForLesson && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          {assessmentStatus[lessonNumber] === 'locked' && (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          {lessonResultStatus && (
                            <span className={`text-sm ${
                              lessonResultStatus.status === 'passed' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {lessonResultStatus.bestScore}%
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {assessmentResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Assessment History</h2>
                <div className="space-y-4">
                  {assessmentResults.map((result) => {
                    const lesson = lessons.find(l => l.lessonNumber === result.lessonId);
                    return (
                      <div key={result._id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium">{lesson?.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {result.status === 'passed' ? (
                            <Trophy className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm ${
                            result.status === 'passed' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Score: {result.bestScore}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {showLessonCompletionOptions && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Lesson Completed!</h2>
                  <p className="text-gray-600 mb-6">
                    You've successfully completed the lesson. What would you like to do next?
                  </p>
                  <div className="flex justify-center space-x-4">
                    {currentAssessment && (
                      <button
                        onClick={() => handleLessonCompletionNavigation('assessment')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Trophy className="mr-2 w-5 h-5" />
                        Take Assessment
                      </button>
                    )}
                    {currentLessonIndex < lessons.length - 1 && (
                      <button
                        onClick={() => handleLessonCompletionNavigation('next-lesson')}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <ArrowRight className="mr-2 w-5 h-5" />
                        Next Lesson
                      </button>
                    )}
                    {currentLessonIndex === lessons.length - 1 && (
                      <button
                        onClick={() => setShowCompletionModal(true)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <Trophy className="mr-2 w-5 h-5" />
                        Course Summary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="lg:col-span-3">
            {currentLesson && showAssessment && currentAssessment ? (
              assessmentStatus[currentLesson.lessonNumber || ''] === 'available' ? (
                <AssessmentResultV1
                  questions={currentAssessment.questions}
                  onComplete={handleAssessmentComplete}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Assessment is locked. Complete the lesson first.</p>
                </div>
              )
            ) : currentLesson ? (
              <LessonPlayer
                lesson={currentLesson}
                courseId={enrollment.courseId as string}
                enrollment={enrollment}
                onComplete={handleLessonComplete}
                isCompleted={lessonStatus[currentLesson.lessonNumber || ''] === 'completed'}
              />
            ) : null}
          </div>
        </div>
      </div>
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You've completed {enrollment.course?.title} with an average score of{' '}
                {enrollment.progress?.totalScore?.toFixed(1)}%
              </p>
              {enrollment.certificate && (
                <p className="text-gray-600 mb-6">
                  Certificate Number: {enrollment.certificate.certificateNumber}
                </p>
              )}
              <button
                onClick={() => setShowCompletionModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseLearningV1;




















// import  { useEffect, useState } from 'react';
// import { BookOpen, CheckCircle, Award, Trophy, AlertCircle, Lock } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// // Import necessary types and interfaces
// import { Assessment } from '../../types/IAssessment';
// import { 
//   AssessmentResult, 
//   CompleationStatus, 
//   EnrollmentEntity, 
// } from '../../types';

// // Import components and services
// import { AssessmentResultV1 } from './AssessmentResult';
// import { LessonPlayer } from './LessonPlayerV1';
// import LoadingSpinner from '../common/loadingSpinner';
// import { commonRequest, URL } from '../../common/api';
// import { config } from '../../common/config';
// import { LessonProgressService } from './LessonProgressService';

// // Type definitions (if not already defined in your types file)
// interface LessonStatus {
//   [lessonNumber: string]: 'not-started' | 'in-progress' | 'completed';
// }

// interface AssessmentStatus {
//   [lessonNumber: string]: 'locked' | 'available' | 'completed';
// }

// function CourseLearningV1() {
//   // State management
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [enrollment, setEnrollment] = useState<EnrollmentEntity>({});
//   const [showAssessment, setShowAssessment] = useState(false);
//   const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
//   const [showCompletionModal, setShowCompletionModal] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Progression control states
//   const [lessonStatus, setLessonStatus] = useState<LessonStatus>({});
//   const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>({});

//   // Route and data management
//   const location = useLocation();
//   const { enrollmentId } = location.state;
//   const [assessments, setAssessments] = useState<Assessment[]>([]);
//   const [showLessonCompletionOptions, setShowLessonCompletionOptions] = useState(false);
  
//   // Derived data
//   const lessons = enrollment.course?.lessons || [];
//   const currentLesson = lessons[currentLessonIndex];
//   const currentAssessment = currentLesson 
//     ? assessments.find(a => a.lessonId === currentLesson.lessonNumber) 
//     : null;

//   // Initialize lesson and assessment statuses
//   useEffect(() => {
//     if (enrollment.course?.lessons) {
//       // Initialize lesson status
//       const initialLessonStatus = lessons.reduce((acc, lesson) => {
//         const lessonNumber = lesson.lessonNumber || '';
//         const isCompleted = enrollment.progress?.completedLessons?.includes(lessonNumber);
//         acc[lessonNumber] = isCompleted ? 'completed' : 'not-started';
//         return acc;
//       }, {} as LessonStatus);
//       setLessonStatus(initialLessonStatus);

//       // Initialize assessment status
//       const initialAssessmentStatus = assessments.reduce((acc, assessment) => {
//         const isCompleted = enrollment.progress?.completedAssessments?.includes(assessment.lessonId);
//         const correspondingLessonIndex = lessons.findIndex(l => l.lessonNumber === assessment.lessonId);
        
//         acc[assessment.lessonId] = isCompleted 
//           ? 'completed' 
//           : correspondingLessonIndex <= currentLessonIndex 
//             ? 'available' 
//             : 'locked';
//         return acc;
//       }, {} as AssessmentStatus);
//       setAssessmentStatus(initialAssessmentStatus);
//     }
//   }, [enrollment, assessments, currentLessonIndex]);

//   // Fetch enrollment and assessments
//   useEffect(() => {
//     const loadEnrollment = async () => {
//       try {
//         setLoading(true);
//         // Fetch enrollment details
//         const response = await commonRequest<EnrollmentEntity>(
//           "GET", 
//           `${URL}/course/enrollment/${enrollmentId}`, 
//           undefined, 
//           config
//         );
//         setEnrollment(response.data);

//         // Fetch course assessments
//         if (response.data.courseId) {
//           const assessmentsResponse = await commonRequest<Assessment[]>(
//             "GET", 
//             `${URL}/course/assessment?courseId=${response.data.courseId}`, 
//             undefined, 
//             config
//           );
//           setAssessments(assessmentsResponse.data);
//         }
//       } catch (error) {
//         console.error('Error fetching enrollment or assessments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (enrollmentId) {
//       loadEnrollment();
//     }
//   }, [enrollmentId]);

//   // Calculate overall course progress
//   const calculateProgress = (completedLessons: string[], completedAssessments: string[]) => {
//     const totalSteps = lessons.length + assessments.length;
//     const completedSteps = completedLessons.length + completedAssessments.length;
//     return (completedSteps / totalSteps) * 100;
//   };

//   // Calculate total score across all assessments
//   const calculateTotalScore = (results: AssessmentResult[]) => {
//     if (results.length === 0) return 0;
//     return results.reduce((acc, result) => acc + result.bestScore, 0) / results.length;
//   };

//   // Handle lesson completion
//   const handleLessonComplete = async () => {
//     if (!currentLesson?.lessonNumber) return;

//     const lessonNumber = currentLesson.lessonNumber;

//     // Update lesson status
//     setLessonStatus(prev => ({
//       ...prev,
//       [lessonNumber]: 'completed'
//     }));

//     // Update completed lessons in enrollment
//     const newCompletedLessons = [...(enrollment.progress?.completedLessons || [])];
//     if (!newCompletedLessons.includes(lessonNumber)) {
//       newCompletedLessons.push(lessonNumber);
//     }

//     const progress = calculateProgress(newCompletedLessons, enrollment.progress?.completedAssessments || []);

//     try {
//       // Update lesson progress
//       const result = await LessonProgressService.updateLessonProgress({
//         ...enrollment,
//         progress: {
//           ...enrollment.progress,
//           completedLessons: newCompletedLessons,
//           overallCompletionPercentage: progress
//         }
//       });
//       setEnrollment(result);
//       setShowLessonCompletionOptions(true);
//       // Handle next steps
//       if (currentAssessment) {
//         // Make assessment available if exists
//         setAssessmentStatus(prev => ({
//           ...prev,
//           [lessonNumber]: 'available'
//         }));
//         setShowAssessment(true);
//       } else if (currentLessonIndex < lessons.length - 1) {
//         // Move to next lesson if no assessment
//         setCurrentLessonIndex(currentLessonIndex + 1);
//       } else {
//         // Course completion if last lesson
//         setShowCompletionModal(true);
//       }
//     } catch (err) {
//       console.error("Error updating lesson progress:", err);
//     }
//   };

//   // Handle assessment completion
//   const handleAssessmentComplete = async (
//     score: number, 
//     answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[]
//   ) => {
//     if (!currentLesson?.lessonNumber || !currentAssessment) return;

//     const lessonNumber = currentLesson.lessonNumber;

//     // Update completed assessments
//     const newCompletedAssessments = [...(enrollment.progress?.completedAssessments || [])];
//     if (!newCompletedAssessments.includes(lessonNumber)) {
//       newCompletedAssessments.push(lessonNumber);
//     }

//     // Update assessment status
//     setAssessmentStatus(prev => ({
//       ...prev,
//       [lessonNumber]: 'completed'
//     }));

//     // Calculate total points
//     const totalPoints = currentAssessment.questions.reduce((sum, q) => sum + q.points, 0);
//     const earnedPoints = Math.round((score / 100) * totalPoints);

//     // Create assessment result
//     const assessmentResult: AssessmentResult = {
//       enrollmentId: enrollment._id || '',
//       courseId: currentAssessment.courseId,
//       lessonId: lessonNumber,
//       assessmentId: currentAssessment._id || '',
//       attempts: [{
//         score,
//         passed: score >= currentAssessment.passingScore,
//         completedAt: new Date(),
//         answers
//       }],
//       bestScore: score,
//       totalPoints,
//       earnedPoints,
//       status: score >= currentAssessment.passingScore ? 'passed' : 'failed',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     try {
//       // Save assessment result
//       const savedAssessment = await LessonProgressService.createAssessmentResult(assessmentResult);
//       setAssessmentResults([...assessmentResults, savedAssessment]);

//       // Update enrollment progress
//       const progress = calculateProgress(
//         enrollment.progress?.completedLessons || [],
//         newCompletedAssessments
//       );

//       // Check if assessment is passed
//       if (score >= currentAssessment.passingScore) {
//         // Move to next lesson or complete course
//         if (currentLessonIndex < lessons.length - 1) {
//           setTimeout(() => {
//             setCurrentLessonIndex(currentLessonIndex + 1);
//             setShowAssessment(false);
//           }, 2000);
//         } else {
//           // Course completion
//           setShowCompletionModal(true);
//           await LessonProgressService.updateLessonProgress({
//             ...enrollment,
//             completionStatus: CompleationStatus.Completed,
//             certificate: {
//               _id: 'cert1',
//               enrollmentId: enrollment._id || '',
//               userId: enrollment.userId || '',
//               courseId: enrollment.courseId || '',
//               issuedAt: new Date(),
//               certificateNumber: `CERT-${Date.now()}`,
//               score: calculateTotalScore([...assessmentResults, assessmentResult])
//             }
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error saving assessment:", error);
//     }
//   };

//   // Handle lesson selection with progression rules
//   const handleLessonSelection = (index: number) => {
//     const selectedLesson = lessons[index];
//     const selectedLessonNumber = selectedLesson.lessonNumber || '';

//     // Check previous lesson completion
//     const previousLessonIndex = index - 1;
//     const previousLesson = previousLessonIndex >= 0 ? lessons[previousLessonIndex] : null;
//     const previousLessonNumber = previousLesson?.lessonNumber || '';

//     // Progression rules
//     const isPreviousLessonCompleted = !previousLesson || 
//       lessonStatus[previousLessonNumber] === 'completed';
    
//     const isPreviousAssessmentCompleted = !previousLesson || 
//       !assessments.find(a => a.lessonId === previousLessonNumber) ||
//       assessmentStatus[previousLessonNumber] === 'completed';

//     // Apply progression rules
//     if (isPreviousLessonCompleted && isPreviousAssessmentCompleted) {
//       setCurrentLessonIndex(index);
//       setShowAssessment(false);
//     } else {
//       // Optional: Show a more user-friendly notification
//       alert('Complete the previous lesson and its assessment first!');
//     }
//   };
//   const handleLessonCompletionNavigation = (action: 'assessment' | 'next-lesson') => {
//     // Reset completion options
//     setShowLessonCompletionOptions(false);

//     // Handle navigation based on action
//     if (action === 'assessment' && currentAssessment) {
//       // Make assessment available and show it
//       setAssessmentStatus(prev => ({
//         ...prev,
//         [currentLesson.lessonNumber || '']: 'available'
//       }));
//       setShowAssessment(true);
//     } else if (action === 'next-lesson' && currentLessonIndex < lessons.length - 1) {
//       // Move to next lesson
//       setCurrentLessonIndex(currentLessonIndex + 1);
//     } else if (currentLessonIndex === lessons.length - 1) {
//       // If it's the last lesson, show course completion modal
//       setShowCompletionModal(true);
//     }
//   };
//   // Render loading state
//   if (loading) return <LoadingSpinner />;

//   // Render not found state
//   if (!enrollment) return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       Enrollment not found
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">{enrollment.course?.title}</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Progress Card */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Course Progress</h2>
//               <div className="space-y-4">
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                     style={{ 
//                       width: `${enrollment.progress?.overallCompletionPercentage || 0}%` 
//                     }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   {enrollment.progress?.overallCompletionPercentage?.toFixed(1) || 0}% Complete
//                 </p>
//                 {enrollment.progress?.totalScore !== undefined && (
//                   <p className="text-sm text-gray-600">
//                     Average Score: {enrollment.progress.totalScore.toFixed(1)}%
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Course Content */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-4">Course Content</h2>
//               <div className="space-y-3">
//                 {lessons.map((lesson, index) => {
//                   const lessonNumber = lesson.lessonNumber || '';
//                   const assessmentForLesson = assessments.find(a => a.lessonId === lessonNumber);
//                   const lessonResultStatus = assessmentResults.find(r => r.lessonId === lessonNumber);

//                   return (
//                     <button
//                       key={lessonNumber}
//                       onClick={() => handleLessonSelection(index)}
//                       className={`w-full text-left p-3 rounded-lg flex items-center gap-3 
//                         ${index === currentLessonIndex ? 'bg-blue-50 text-blue-700' : 
//                           index < currentLessonIndex ? 'bg-green-50 text-green-700' : 
//                           'bg-gray-50 text-gray-400'}`}
//                     >
//                       {lessonStatus[lessonNumber] === 'completed' ? (
//                         <CheckCircle className="w-5 h-5" />
//                       ) : (
//                         <BookOpen className="w-5 h-5" />
//                       )}
//                       <span className="flex-1">{lesson.title}</span>
                      
//                       {assessmentForLesson && (
//                         <div className="flex items-center gap-2">
//                           <Award className="w-4 h-4" />
//                           {assessmentStatus[lessonNumber] === 'locked' && (
//                             <Lock className="w-4 h-4 text-gray-400" />
//                           )}
//                           {lessonResultStatus && (
//                             <span className={`text-sm ${
//                               lessonResultStatus.status === 'passed' ? 'text-green-600' : 'text-red-600'
//                             }`}>
//                               {lessonResultStatus.bestScore}%
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Assessment History */}
//             {assessmentResults.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold mb-4">Assessment History</h2>
//                 <div className="space-y-4">
//                   {assessmentResults.map((result) => {
//                     const lesson = lessons.find(l => l.lessonNumber === result.lessonId);
//                     return (
//                       <div key={result._id} className="border-l-4 border-blue-500 pl-4">
//                         <h3 className="font-medium">{lesson?.title}</h3>
//                         <div className="flex items-center gap-2 mt-1">
//                           {result.status === 'passed' ? (
//                             <Trophy className="w-4 h-4 text-green-500" />
//                           ) : (
//                             <AlertCircle className="w-4 h-4 text-red-500" />
//                           )}
//                           <span className={`text-sm ${
//                             result.status === 'passed' ? 'text-green-600' : 'text-red-600'
//                           }`}>
//                             Score: {result.bestScore}%
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//           {showLessonCompletionOptions && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-8 max-w-md w-full">
//             <div className="text-center">
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold mb-2">Lesson Completed!</h2>
//               <p className="text-gray-600 mb-6">
//                 You've successfully completed the lesson. What would you like to do next?
//               </p>

//               <div className="flex justify-center space-x-4">
//                 {currentAssessment && (
//                   <button
//                     onClick={() => handleLessonCompletionNavigation('assessment')}
//                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//                   >
//                     <Trophy className="mr-2 w-5 h-5" />
//                     Take Assessment
//                   </button>
//                 )}

//                 {currentLessonIndex < lessons.length - 1 && (
//                   <button
//                     onClick={() => handleLessonCompletionNavigation('next-lesson')}
//                     className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
//                   >
//                     <ArrowRight className="mr-2 w-5 h-5" />
//                     Next Lesson
//                   </button>
//                 )}

//                 {currentLessonIndex === lessons.length - 1 && (
//                   <button
//                     onClick={() => setShowCompletionModal(true)}
//                     className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
//                   >
//                     <Trophy className="mr-2 w-5 h-5" />
//                     Course Summary
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//           {/* Main Content Area */}
//           <div className="lg:col-span-3">
//             {currentLesson && showAssessment && currentAssessment ? (
//               // Conditional rendering of assessment
//               assessmentStatus[currentLesson.lessonNumber || ''] === 'available' ? (
//                 <AssessmentResultV1
//                   questions={currentAssessment.questions}
//                   onComplete={handleAssessmentComplete}
//                 />
//               ) : (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-gray-500">Assessment is locked. Complete the lesson first.</p>
//                 </div>
//               )
//             ) : currentLesson ? (
//               // Lesson player
//               <LessonPlayer
//                 lesson={currentLesson}
//                 courseId={enrollment.courseId as string}
//                 enrollment={enrollment}
//                 onComplete={handleLessonComplete}
//                 isCompleted={lessonStatus[currentLesson.lessonNumber || ''] === 'completed'}
//               />
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {/* Course Completion Modal */}
//       {showCompletionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-8 max-w-md w-full">
//             <div className="text-center">
//               <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
//               <p className="text-gray-600 mb-6">
//                 You've completed {enrollment.course?.title} with an average score of{' '}
//                 {enrollment.progress?.totalScore?.toFixed(1)}%
//               </p>
//               {enrollment.certificate && (
//                 <p className="text-gray-600 mb-6">
//                   Certificate Number: {enrollment.certificate.certificateNumber}
//                 </p>
//               )}
//               <button
//                 onClick={() => setShowCompletionModal(false)}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CourseLearningV1;