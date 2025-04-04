
// import React, { useEffect, useState, useMemo } from 'react';
// import { ChevronRight, User, Clock, BookOpen, Lock, PlayCircle, ChevronLeft, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
// import { LessonPlayer } from './LessonPlayer';
// import { EnrollmentEntity } from '../../types';
// import { AssessmentComponent } from './AssessmentComponent';
// import { config } from '../../common/config';
// import { commonRequest, URL } from '../../common/api';
// import { Assessment } from '../../types/IAssessment';
// import LoadingSpinner from '../common/loadingSpinner';
// import { useNavigate } from 'react-router-dom';

// interface CourseLearningProps {
//   enrollment: EnrollmentEntity;
//   onLessonComplete: (lessonNumber: string, assessmentId: string) => void;
//   onBack: () => void;
// }

// interface AssessmentResult {
//   assessmentId: string;
//   lessonId: string;
//   score: number;
//   passed: boolean;
//   completedAt: Date;
// }

// export const CourseLearning: React.FC<CourseLearningProps> = ({
//   enrollment,
//   onLessonComplete,
//   onBack
// }) => {
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showAssessment, setShowAssessment] = useState(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [assessment, setAssessment] = useState<Assessment|null>(null);
//   const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
//   const [currentView, setCurrentView] = useState<'lesson'|'assessment'|'results'|'completed'>('lesson');
//   const [lastAttemptScore, setLastAttemptScore] = useState<number>(0);
//   const [lastAttemptPassed, setLastAttemptPassed] = useState<boolean>(false);
  
//   const navigate = useNavigate();

//   const course = enrollment.course;
//   const currentLesson = course?.lessons?.[currentLessonIndex];
//   const completedLessons = useMemo(() => 
//     enrollment.progress?.completedLessons || [], 
//     [enrollment.progress?.completedLessons]
//   );
  
//   const completedAssessments = enrollment.progress?.completedAssessments || [];

//   useEffect(() => {
//     if (course?.lessons && completedLessons.length > 0) {
//       const lastCompletedIndex = course.lessons.findIndex(
//         lesson => lesson.lessonNumber === completedLessons[completedLessons.length - 1]
//       );
//       const nextLessonIndex = lastCompletedIndex + 1;
      
//       if (nextLessonIndex < course.lessons.length && completedLessons.length < course.lessons.length) {
//         setCurrentLessonIndex(nextLessonIndex);
//       }
//     }
//   }, [course?.lessons, completedLessons]);

//   // Fetch assessment results from backend on load
//   useEffect(() => {
//     fetchAssessmentResults();
//   }, [enrollment]);

//   const fetchAssessmentResults = async () => {
//     if (!enrollment?._id) return;
//     setIsLoading(true);
//     try {
//       const response = await commonRequest<AssessmentResult[]>(
//         "GET",
//         `${URL}/course/assessment-results?enrollmentId=${enrollment._id}`,
//         undefined,
//         config
//       );
      
//       if (response.success && Array.isArray(response.data)) {
//         setAssessmentResults(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching assessment results:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchAssessments = async () => {
//     if (!course?._id || !currentLesson) return null;
//     setIsLoading(true);
//     try {
//       const response = await commonRequest<Assessment>(
//         "GET",
//         `${URL}/course/assessment?courseId=${course?._id}&lessonId=${currentLessonIndex+1}`, 
//         undefined,
//         config
//       );
//       if (!response.success || typeof response !== "object" || !("_id" in response.data)) {
//         console.error("Invalid response in assessment");
//         return null;
//       }    
//       return response.data; 
//     } catch (error) {
//       console.error("An error occurred while fetching assessments:", error);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const moveToNextLesson = () => {
//     if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
//       setCurrentLessonIndex(prev => prev + 1);
//       setAssessment(null);
//       setShowAssessment(false);
//       setCurrentView('lesson');
//     }
//   };

//   const moveToPreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex(prev => prev - 1);
//       setAssessment(null);  
//       setShowAssessment(false);
//       setCurrentView('lesson');
//     }
//   };

//   const handleMessageClick = async() => {
//     navigate('/student/chat', {state: {receiver: enrollment?.instructor ?? null}});
//   };

//   const saveAssessmentResult = async (score: number, passed: boolean) => {
//     if (!assessment?._id || !enrollment?._id) return;
    
//     try {
//       const result: Partial<AssessmentResult> = {
//         assessmentId: assessment._id,
//         lessonId: assessment.lessonId,
//         score,
//         passed,
//         completedAt: new Date()
//       };
      
//       await commonRequest(
//         "POST",
//         `${URL}/course/assessment-results`,
//         { enrollmentId: enrollment._id, ...result },
//         config
//       );
      
//       // Update local state with new result
//       setAssessmentResults(prev => [...prev, result as AssessmentResult]);
//     } catch (error) {
//       console.error("Error saving assessment result:", error);
//     }
//   };

//   const handleAssessmentComplete = async (passed: boolean, score: number) => {
//     setLastAttemptScore(score);
//     setLastAttemptPassed(passed);
    
//     // Save assessment result to backend
//     await saveAssessmentResult(score, passed);
    
//     if (passed) {
//       onLessonComplete(currentLesson?.lessonNumber || '', assessment?._id || '');
//       setCurrentView('results');
//     } else {
//       setCurrentView('results');
//     }
//   };

//   const handleLessonComplete = async (lessonNumber: string) => {
//     const newAssessment = await fetchAssessments();
//     if (newAssessment && !completedAssessments.includes(newAssessment._id || '')) {
//       setAssessment(newAssessment);
//       setShowAssessment(true);
//       setCurrentView('assessment');
//     } else {
//       onLessonComplete(lessonNumber, newAssessment?._id as string);
//       const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
//       if (isLastLesson) {
//         setCurrentView('completed');
//       } else {
//         moveToNextLesson();
//       }
//     }
//   };

//   const renderAssessmentResults = () => {
//     const relevantResults = assessmentResults.filter(
//       result => result.lessonId === `${currentLessonIndex+1}`
//     );
    
//     return (
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-xl font-bold mb-4">Assessment Results</h2>
        
//         <div className="mb-6 p-4 rounded-lg flex items-center gap-4 border">
//           {lastAttemptPassed ? (
//             <div className="flex items-center bg-green-50 p-4 rounded-lg w-full">
//               <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
//               <div>
//                 <h3 className="font-bold text-green-700">Assessment Passed</h3>
//                 <p className="text-green-600">Score: {lastAttemptScore}%</p>
//                 <p className="text-sm text-green-600 mt-1">You've completed this lesson successfully.</p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center bg-red-50 p-4 rounded-lg w-full">
//               <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
//               <div>
//                 <h3 className="font-bold text-red-700">Assessment Not Passed</h3>
//                 <p className="text-red-600">Score: {lastAttemptScore}%</p>
//                 <p className="text-sm text-red-600 mt-1">Required: {assessment?.passingScore}%. Please try again.</p>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {relevantResults.length > 1 && (
//           <>
//             <h3 className="text-lg font-semibold mb-3">Previous Attempts</h3>
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-2 px-4 border-b text-left">Attempt</th>
//                   <th className="py-2 px-4 border-b text-left">Date</th>
//                   <th className="py-2 px-4 border-b text-left">Score</th>
//                   <th className="py-2 px-4 border-b text-left">Result</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {relevantResults.map((result, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border-b">{relevantResults.length - index}</td>
//                     <td className="py-2 px-4 border-b">
//                       {new Date(result.completedAt).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 px-4 border-b">{result.score}%</td>
//                     <td className="py-2 px-4 border-b">
//                       {result.passed ? (
//                         <span className="text-green-600 font-medium">Passed</span>
//                       ) : (
//                         <span className="text-red-600 font-medium">Failed</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </>
//         )}
        
//         <div className="mt-6 flex gap-3">
//           {!lastAttemptPassed && (
//             <button
//               onClick={() => {
//                 setCurrentView('assessment');
//                 setShowAssessment(true);
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Try Again
//             </button>
//           )}
          
//           {lastAttemptPassed && !isLastLesson && (
//             <button
//               onClick={moveToNextLesson}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Next Lesson
//             </button>
//           )}
          
//           <button
//             onClick={() => setCurrentView('lesson')}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//           >
//             Review Lesson
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   const renderCourseCompletedView = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//         <div className="mb-6 inline-block p-3 bg-green-100 rounded-full">
//           <CheckCircle className="w-16 h-16 text-green-600" />
//         </div>
        
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">
//           Congratulations! Course Completed
//         </h2>
        
//         <p className="text-gray-600 mb-6">
//           You've successfully completed all lessons and assessments for {course?.title}.
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-blue-800">Lessons Completed</h3>
//             <p className="text-xl font-bold text-blue-600">{course?.lessons?.length}</p>
//           </div>
          
//           <div className="bg-purple-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-purple-800">Assessments Passed</h3>
//             <p className="text-xl font-bold text-purple-600">{completedAssessments.length}</p>
//           </div>
          
//           <div className="bg-green-50 p-4 rounded-lg">
//             <h3 className="font-semibold text-green-800">Completion</h3>
//             <p className="text-xl font-bold text-green-600">100%</p>
//           </div>
//         </div>
        
//         <div className="flex flex-col sm:flex-row justify-center gap-4">
//           <button
//             onClick={onBack}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Return to Dashboard
//           </button>
          
//           <button
//             onClick={() => setCurrentView('lesson')}
//             className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//           >
//             Review Course Materials
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) return <LoadingSpinner />;
//   if (!course) return <div className="p-8 text-center text-gray-600">Course not found</div>;

//   const isFirstLesson = currentLessonIndex === 0;
//   const isLastLesson = currentLessonIndex === (course.lessons?.length || 0) - 1;
//   const isPreviousLessonCompleted = isFirstLesson || completedLessons.includes(course.lessons?.[currentLessonIndex - 1]?.lessonNumber || '');
//   const isCurrentLessonCompleted = completedLessons.includes(currentLesson?.lessonNumber || '');

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <button
//             onClick={onBack}
//             className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <div className="flex items-center text-sm text-gray-500 mb-1">
//                 <span>{course.level}</span>
//                 <ChevronRight className="w-4 h-4 mx-1" />
//                 <span>Lesson {currentLessonIndex + 1} of {course.lessons?.length}</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center text-sm text-gray-500">
//                   <User className="w-4 h-4 mr-1" />
//                   <span>Instructor: {enrollment.instructor?.userName}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Clock className="w-4 h-4 mr-1" />
//                   <span>{course.lessons?.length} lessons</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {currentView === 'assessment' && assessment ? (
//               <AssessmentComponent
//                 assessment={assessment}
//                 onComplete={handleAssessmentComplete}
//               />
//             ) : currentView === 'results' ? (
//               renderAssessmentResults()
//             ) : currentView === 'completed' ? (
//               renderCourseCompletedView()
//             ) : (
//               currentLesson && (
//                 <LessonPlayer
//                   lesson={currentLesson}
//                   lessonId={currentLessonIndex}
//                   isCompleted={isCurrentLessonCompleted}
//                   isLocked={!isPreviousLessonCompleted}
//                   onComplete={handleLessonComplete}
//                   onMessage={handleMessageClick}
//                 />
//               )
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold mb-4">Course Content</h2>
//             <div className="space-y-2">
//               {course.lessons?.map((lesson, index) => {
//                 const isCompleted = completedLessons.includes(lesson.lessonNumber || '');
//                 const isLocked = index > 0 && !completedLessons.includes(course.lessons?.[index - 1]?.lessonNumber || '');

//                 return (
//                   <button
//                     key={lesson.lessonNumber}
//                     onClick={() => !isLocked && setCurrentLessonIndex(index) && setCurrentView('lesson')}
//                     className={`w-full text-left p-3 rounded-lg flex items-center ${
//                       currentLessonIndex === index
//                         ? 'bg-blue-50 text-blue-700'
//                         : isLocked
//                         ? 'bg-gray-50 text-gray-400'
//                         : 'hover:bg-gray-50'
//                     }`}
//                     disabled={isLocked}
//                   >
//                     {isCompleted ? (
//                       <BookOpen className="w-5 h-5 mr-2 text-green-500" />
//                     ) : isLocked ? (
//                       <Lock className="w-5 h-5 mr-2" />
//                     ) : (
//                       <PlayCircle className="w-5 h-5 mr-2" />
//                     )}
//                     <div>
//                       <div className="font-medium">{lesson.title}</div>
//                       <div className="text-sm text-gray-500">
//                         {lesson.duration || '15 mins'}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Controls at bottom */}
//       <div className="sticky bottom-0 bg-white border-t">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between">
//             <button
//               onClick={moveToPreviousLesson}
//               disabled={isFirstLesson || !isPreviousLessonCompleted}
//               className={`flex items-center px-4 py-2 rounded-md border ${
//                 isFirstLesson || !isPreviousLessonCompleted
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <ChevronLeft className="w-4 h-4 mr-2" />
//               Previous Lesson
//             </button>
//             <button
//               onClick={moveToNextLesson}
//               disabled={isLastLesson || !isCurrentLessonCompleted}
//               className={`flex items-center px-4 py-2 rounded-md border ${
//                 isLastLesson || !isCurrentLessonCompleted
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Next Lesson
//               <ChevronRight className="w-4 h-4 ml-2" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };











// import React, { useEffect, useState, useMemo } from 'react';
// import { ChevronRight, User, Clock, BookOpen, Lock, PlayCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
// import { LessonPlayer } from './LessonPlayer';
// import { EnrollmentEntity } from '../../types';
// import { AssessmentComponent } from './AssessmentComponent';
// import { config } from '../../common/config';
// import { commonRequest, URL } from '../../common/api';
// import { Assessment } from '../../types/IAssessment';
// import LoadingSpinner from '../common/loadingSpinner';
// import { useNavigate } from 'react-router-dom';

// interface CourseLearningProps {
//   enrollment: EnrollmentEntity;
//   onLessonComplete: (lessonNumber: string, assessmentId: string) => void;
//   onBack: () => void;
// }

// export const CourseLearning: React.FC<CourseLearningProps> = ({
//   enrollment,
//   onLessonComplete,
//   onBack
// }) => {
//   const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
//   const [showAssessment, setShowAssessment] = useState(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [assessment, setAssessment] = useState<Assessment|null>(null);
//   const navigate = useNavigate();

//   const course = enrollment.course;
//   const currentLesson = course?.lessons?.[currentLessonIndex];
//   const completedLessons = useMemo(() => 
//     enrollment.progress?.completedLessons || [], 
//     [enrollment.progress?.completedLessons]
//   );
  
//   const completedAssessments = enrollment.progress?.completedAssessments || [];

//   useEffect(() => {
//     if (course?.lessons && completedLessons.length > 0) {
//       const lastCompletedIndex = course.lessons.findIndex(
//         lesson => lesson.lessonNumber == completedLessons[completedLessons.length - 1]
//       );
//       const nextLessonIndex = lastCompletedIndex + 1;
      
//       if (nextLessonIndex < course.lessons.length && completedLessons.length < course.lessons.length) {
//         setCurrentLessonIndex(nextLessonIndex);
//       }
//     }
//   }, [course?.lessons, completedLessons]);

//   const fetchAssessments = async () => {
//     if (!course?._id || !currentLesson) return null;
//     setIsLoading(true);
//     try {
//       const response = await commonRequest<Assessment>(
//         "GET",
//         `${URL}/course/assessment?courseId=${course?._id}&lessonId=${currentLessonIndex+1}`, 
//         undefined,
//         config
//       );
//       if (!response.success || typeof response !== "object" || !("_id" in response.data)) {
//         console.error("Invalid response in assessment");
//         return null;
//       }    
//       return response.data; 
//     } catch (error) {
//       console.error("An error occurred while fetching assessments:", error);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const moveToNextLesson = () => {
//     if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
//       setCurrentLessonIndex(prev => prev + 1);
//       setAssessment(null);
//       setShowAssessment(false);
//     }
//   };

//   const moveToPreviousLesson = () => {
//     if (currentLessonIndex > 0) {
//       setCurrentLessonIndex(prev => prev - 1);
//       setAssessment(null);  
//       setShowAssessment(false);
//     }
//   };
//   const handleMessageClick = async() => {
//     navigate('/student/chat',{state:{receiver:enrollment?.instructor??null}});
//   };
//   const handleAssessmentComplete = (passed: boolean) => {
//     if (passed) {
//       onLessonComplete(currentLesson?.lessonNumber || '', assessment?._id || '');
//       const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
//       if (!isLastLesson) {
//         moveToNextLesson();
//       }
//     }
//     setShowAssessment(false);
//   };

//   const handleLessonComplete = async (lessonNumber: string) => {
//     const newAssessment = await fetchAssessments();
//     if (newAssessment && !completedAssessments.includes(newAssessment._id || '')) {
//       setAssessment(newAssessment);
//       setShowAssessment(true);
//     } else {
//       onLessonComplete(lessonNumber, newAssessment?._id as string);
//       const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
//       if (!isLastLesson) {
//         moveToNextLesson();
//       }
//     }
//   };

//   if (!course || !currentLesson) return null;
//   if (isLoading) return <LoadingSpinner/>;

//   const isFirstLesson = currentLessonIndex === 0;
//   const isLastLesson = currentLessonIndex === (course.lessons?.length || 0) - 1;
//   const isPreviousLessonCompleted = isFirstLesson || completedLessons.includes(course.lessons?.[currentLessonIndex - 1]?.lessonNumber || '');

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <button
//             onClick={onBack}
//             className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </button>

//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <div className="flex items-center text-sm text-gray-500 mb-1">
//                 <span>{course.level}</span>
//                 <ChevronRight className="w-4 h-4 mx-1" />
//                 <span>Lesson {currentLessonIndex + 1} of {course.lessons?.length}</span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center text-sm text-gray-500">
//                   <User className="w-4 h-4 mr-1" />
//                   <span>Instructor: {enrollment.instructor?.userName}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Clock className="w-4 h-4 mr-1" />
//                   <span>{course.lessons?.length} lessons</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {showAssessment && assessment ? (
//               <AssessmentComponent
//                 assessment={assessment}
//                 onComplete={handleAssessmentComplete}
//               />
//             ) : (
//               <LessonPlayer
//                 lesson={currentLesson}
//                 lessonId={currentLessonIndex}
//                 isCompleted={completedLessons.includes(currentLesson.lessonNumber || '')}
//                 isLocked={!isPreviousLessonCompleted}
//                 onComplete={handleLessonComplete}
//                 onMessage={handleMessageClick}
//               />
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold mb-4">Course Content</h2>
//             <div className="space-y-2">
//               {course.lessons?.map((lesson, index) => {
//                 const isCompleted = completedLessons.includes(lesson.lessonNumber || '');
//                 const isLocked = index > 0 && !completedLessons.includes(course.lessons?.[index - 1]?.lessonNumber || '');

//                 return (
//                   <button
//                     key={lesson.lessonNumber}
//                     onClick={() => !isLocked && setCurrentLessonIndex(index)}
//                     className={`w-full text-left p-3 rounded-lg flex items-center ${
//                       currentLessonIndex === index
//                         ? 'bg-blue-50 text-blue-700'
//                         : isLocked
//                         ? 'bg-gray-50 text-gray-400'
//                         : 'hover:bg-gray-50'
//                     }`}
//                     disabled={isLocked}
//                   >
//                     {isCompleted ? (
//                       <BookOpen className="w-5 h-5 mr-2 text-green-500" />
//                     ) : isLocked ? (
//                       <Lock className="w-5 h-5 mr-2" />
//                     ) : (
//                       <PlayCircle className="w-5 h-5 mr-2" />
//                     )}
//                     <div>
//                       <div className="font-medium">{lesson.title}</div>
//                       <div className="text-sm text-gray-500">
//                         {lesson.duration || '15 mins'}
//                       </div>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Controls at bottom */}
//       <div className="sticky bottom-0 bg-white border-t">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between">
//             <button
//               onClick={moveToPreviousLesson}
//               disabled={isFirstLesson || !isPreviousLessonCompleted}
//               className={`flex items-center px-4 py-2 rounded-md border ${
//                 isFirstLesson || !isPreviousLessonCompleted
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <ChevronLeft className="w-4 h-4 mr-2" />
//               Previous Lesson
//             </button>
//             <button
//               onClick={moveToNextLesson}
//               disabled={isLastLesson || !completedLessons.includes(currentLesson.lessonNumber || '')}
//               className={`flex items-center px-4 py-2 rounded-md border ${
//                 isLastLesson || !completedLessons.includes(currentLesson.lessonNumber || '')
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Next Lesson
//               <ChevronRight className="w-4 h-4 ml-2" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React from 'react';
// import { ChevronRight, BookOpen, Lock, PlayCircle, ChevronLeft} from 'lucide-react';
// import { LessonPlayer } from './LessonPlayer';
import { EnrollmentEntity } from '../../types';
// import { AssessmentComponent } from './AssessmentComponent';
// import { config } from '../../common/config';
// import { commonRequest, URL } from '../../common/api';
// import { Assessment } from '../../types/IAssessment';
// import LoadingSpinner from '../common/loadingSpinner';
// import { useNavigate } from 'react-router-dom';

interface CourseLearningProps {
  enrollment: EnrollmentEntity;
  onLessonComplete: (lessonNumber: string, assessmentId: string) => void;
  onBack: () => void;
}

// interface AssessmentResult {
//   assessmentId: string;
//   lessonId: string;
//   score: number;
//   passed: boolean;
//   completedAt: Date;
// }

export const CourseLearning: React.FC<CourseLearningProps> = (
  // enrollment,
  // onLessonComplete,
  // onBack
) => {
  // const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [assessment, setAssessment] = useState<Assessment | null>(null);
  // const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  // const [currentView, setCurrentView] = useState<'lesson' | 'assessment' | 'results' | 'completed' | 'lessonCompleted'>('lesson');
  // const [lastAttemptScore, setLastAttemptScore] = useState<number>(0);
  // const [lastAttemptPassed, setLastAttemptPassed] = useState<boolean>(false);
  // const [hasAssessmentForCurrentLesson, setHasAssessmentForCurrentLesson] = useState<boolean>(false);
  
  // const navigate = useNavigate();

  // const course = enrollment.course;
  // const currentLesson = course?.lessons?.[currentLessonIndex];
  // const completedLessons = useMemo(() => 
  //   enrollment.progress?.completedLessons || [], 
  //   [enrollment.progress?.completedLessons]
  // );
  
  // const completedAssessments = enrollment.progress?.completedAssessments || [];

  // useEffect(() => {
  //   if (course?.lessons && completedLessons.length > 0) {
  //     const lastCompletedIndex = course.lessons.findIndex(
  //       lesson => lesson.lessonNumber === completedLessons[completedLessons.length - 1]
  //     );
  //     const nextLessonIndex = lastCompletedIndex + 1;
      
  //     if (nextLessonIndex < course.lessons.length && completedLessons.length < course.lessons.length) {
  //       setCurrentLessonIndex(nextLessonIndex);
  //     }
  //   }
  // }, [course?.lessons, completedLessons]);

  // // Check if current lesson has an assessment when lesson changes
  // useEffect(() => {
  //   const checkForAssessment = async () => {
  //     if (currentLesson) {
  //       const hasAssessment = await checkAssessmentExists();
  //       setHasAssessmentForCurrentLesson(hasAssessment);
  //     }
  //   };
    
  //   checkForAssessment();
  // }, [currentLessonIndex, currentLesson]);

  // // Fetch assessment results from backend on load
  // useEffect(() => {
  //   fetchAssessmentResults();
  // }, [enrollment]);

  // const fetchAssessmentResults = async () => {
  //   if (!enrollment?._id) return;
  //   setIsLoading(true);
  //   try {
  //     const response = await commonRequest<AssessmentResult[]>(
  //       "GET",
  //       `${URL}/course/assessment-results?enrollmentId=${enrollment._id}`,
  //       undefined,
  //       config
  //     );
      
  //     if (response.success && Array.isArray(response.data)) {
  //       setAssessmentResults(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching assessment results:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const checkAssessmentExists = async () => {
  //   if (!course?._id || !currentLesson) return false;
    
  //   try {
  //     const response = await commonRequest(
  //       "GET",
  //       `${URL}/course/assessment/exists?courseId=${course?._id}&lessonId=${currentLessonIndex + 1}`,
  //       undefined,
  //       config
  //     );
      
  //     return response.success && response.data?.exists;
  //   } catch (error) {
  //     console.error("Error checking if assessment exists:", error);
  //     return false;
  //   }
  // };

  // const fetchAssessments = async () => {
  //   if (!course?._id || !currentLesson) return null;
  //   setIsLoading(true);
  //   try {
  //     const response = await commonRequest<Assessment>(
  //       "GET",
  //       `${URL}/course/assessment?courseId=${course?._id}&lessonId=${currentLessonIndex + 1}`,
  //       undefined,
  //       config
  //     );
  //     if (!response.success || typeof response !== "object" || !("_id" in response.data)) {
  //       console.error("Invalid response in assessment");
  //       return null;
  //     }    
  //     return response.data; 
  //   } catch (error) {
  //     console.error("An error occurred while fetching assessments:", error);
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const moveToNextLesson = () => {
  //   if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
  //     setCurrentLessonIndex(prev => prev + 1);
  //     setAssessment(null);
  //     setCurrentView('lesson');
  //   }
  // };

  // const moveToPreviousLesson = () => {
  //   if (currentLessonIndex > 0) {
  //     setCurrentLessonIndex(prev => prev - 1);
  //     setAssessment(null);  
  //     setCurrentView('lesson');
  //   }
  // };

  // const handleMessageClick = async () => {
  //   navigate('/student/chat', { state: { receiver: enrollment?.instructor ?? null } });
  // };

  // const saveAssessmentResult = async (score: number, passed: boolean, answers: Record<string, string>) => {
  //   if (!assessment?._id || !enrollment?._id) return;
    
  //   try {
  //     const result: Partial<AssessmentResult> = {
  //       assessmentId: assessment._id,
  //       lessonId: assessment.lessonId,
  //       score,
  //       passed,
  //       completedAt: new Date()
  //     };
      
  //     await commonRequest(
  //       "POST",
  //       `${URL}/course/assessment-results`,
  //       { enrollmentId: enrollment._id, answers, ...result },
  //       config
  //     );
      
  //     setAssessmentResults(prev => [...prev, result as AssessmentResult]);
  //   } catch (error) {
  //     console.error("Error saving assessment result:", error);
  //   }
  // };

  // const handleAssessmentComplete = async (passed: boolean, score: number, answers: Record<string, string>) => {
  //   setLastAttemptScore(score);
  //   setLastAttemptPassed(passed);
    
  //   await saveAssessmentResult(score, passed, answers);
    
  //   if (passed) {
  //     onLessonComplete(currentLesson?.lessonNumber || '', assessment?._id || '');
  //     setCurrentView('results');
  //   } else {
  //     setCurrentView('results');
  //   }
  // };

  // const handleLessonAComplete = async (lessonNumber: string) => {
  //   setCurrentView('lessonCompleted');
    
  //   const newAssessment = await fetchAssessments();
    
  //   if (newAssessment && !completedAssessments.includes(newAssessment._id || '')) {
  //     setAssessment(newAssessment);
  //   } else {
  //     onLessonComplete(lessonNumber, newAssessment?._id as string);
  //     const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
  //     if (isLastLesson) {
  //       setCurrentView('completed');
  //     }
  //   }
  // };

  // const renderAssessmentResults = () => {
  //   const relevantResults = assessmentResults.filter(
  //     result => result.lessonId === `${currentLessonIndex + 1}`
  //   );
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Assessment Results</h2>
        
        {/* <div className="mb-6 p-4 rounded-lg flex items-center gap-4 border">
          {lastAttemptPassed ? (
            <div className="flex items-center bg-green-50 p-4 rounded-lg w-full">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-bold text-green-700">Assessment Passed</h3>
                <p className="text-green-600">Score: {lastAttemptScore}%</p>
                <p className="text-sm text-green-600 mt-1">You've completed this lesson successfully.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center bg-red-50 p-4 rounded-lg w-full">
              <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="font-bold text-red-700">Assessment Not Passed</h3>
                <p className="text-red-600">Score: {lastAttemptScore}%</p>
                <p className="text-sm text-red-600 mt-1">Required: {assessment?.passingScore}%. Please try again.</p>
              </div>
            </div>
          )}
        </div>
        
        {relevantResults.length > 1 && (
          <>
            <h3 className="text-lg font-semibold mb-3">Previous Attempts</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Attempt</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Score</th>
                  <th className="py-2 px-4 border-b text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {relevantResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{relevantResults.length - index}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{result.score}%</td>
                    <td className="py-2 px-4 border-b">
                      {result.passed ? (
                        <span className="text-green-600 font-medium">Passed</span>
                      ) : (
                        <span className="text-red-600 font-medium">Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        
        <div className="mt-6 flex gap-3">
          {!lastAttemptPassed && (
            <button
              onClick={() => setCurrentView('assessment')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
          
          {lastAttemptPassed && !isLastLesson && (
            <button
              onClick={moveToNextLesson}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Next Lesson
            </button>
          )}
          
          <button
            onClick={() => setCurrentView('lesson')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Review Lesson
          </button>
        </div>
      </div>
    );
  };
  
  const renderLessonCompletedView = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-700">Lesson Completed!</h2>
          <p className="text-gray-600 mt-2">You've successfully completed this lesson.</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">Next Steps</h3>
          {hasAssessmentForCurrentLesson ? (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Take the Assessment</h4>
                <p className="text-sm text-gray-600">Complete the assessment to test your knowledge</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">No Assessment Required</h4>
                <p className="text-sm text-gray-600">You can proceed to the next lesson</p>
              </div>
            </div>
          )}
          
          {!isLastLesson && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">{hasAssessmentForCurrentLesson ? '2' : '1'}</span>
              </div>
              <div>
                <h4 className="font-medium">Continue to Next Lesson</h4>
                <p className="text-sm text-gray-600">Move on to the next part of the course</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          {hasAssessmentForCurrentLesson ? (
            <button
              onClick={() => setCurrentView('assessment')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Assessment
            </button>
          ) : !isLastLesson ? (
            <button
              onClick={moveToNextLesson}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next Lesson
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('completed')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Complete Course
            </button>
          )}
          
          <button
            onClick={() => setCurrentView('lesson')}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Review Lesson
          </button>
        </div>
      </div>
    );
  };
  
  const renderCourseCompletedView = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 inline-block p-3 bg-green-100 rounded-full">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Congratulations! Course Completed
        </h2>
        
        <p className="text-gray-600 mb-6">
          You've successfully completed all lessons and assessments for {course?.title}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Lessons Completed</h3>
            <p className="text-xl font-bold text-blue-600">{course?.lessons?.length}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Assessments Passed</h3>
            <p className="text-xl font-bold text-purple-600">{completedAssessments.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Completion</h3>
            <p className="text-xl font-bold text-green-600">100%</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
          
          <button
            onClick={() => setCurrentView('lesson')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Review Course Materials
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="p-8 text-center text-gray-600">Course not found</div>;

  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === (course.lessons?.length || 0) - 1;
  const isPreviousLessonCompleted = isFirstLesson || completedLessons.includes(course.lessons?.[currentLessonIndex - 1]?.lessonNumber || '');
  const isCurrentLessonCompleted = completedLessons.includes(currentLesson?.lessonNumber || '');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span>{course.level}</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span>Lesson {currentLessonIndex + 1} of {course.lessons?.length}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-1" />
                  <span>Instructor: {enrollment.instructor?.userName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.lessons?.length} lessons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          {/* <div className="lg:col-span-2">
            {currentView === 'assessment' && assessment ? (
              <AssessmentComponent
                assessment={assessment}
                onComplete={handleAssessmentComplete}
              />
            ) : currentView === 'results' ? (
              renderAssessmentResults()
            ) : currentView === 'completed' ? (
              renderCourseCompletedView()
            ) : currentView === 'lessonCompleted' ? (
              renderLessonCompletedView()
            ) : (
              currentLesson && (
                <LessonPlayer
                  lesson={currentLesson}
                  lessonId={currentLessonIndex}
                  isCompleted={isCurrentLessonCompleted}
                  isLocked={!isPreviousLessonCompleted}
                  onComplete={handleLessonAComplete}
                  onMessage={handleMessageClick}
                />
              )
            )}
          </div>

          {/* Sidebar */}
          {/* <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.lessons?.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.lessonNumber || '');
                const isLocked = index > 0 && !completedLessons.includes(course.lessons?.[index - 1]?.lessonNumber || '');
                const hasAssessment = assessmentResults.some(result => result.lessonId === `${index + 1}`);

                return (
                  <button
                    key={lesson.lessonNumber}
                    onClick={() => !isLocked && setCurrentLessonIndex(index) && setCurrentView('lesson')}
                    className={`w-full text-left p-3 rounded-lg flex items-center ${
                      currentLessonIndex === index
                        ? 'bg-blue-50 text-blue-700'
                        : isLocked
                        ? 'bg-gray-50 text-gray-400'
                        : 'hover:bg-gray-50'
                    }`}
                    disabled={isLocked}
                  >
                    {isCompleted ? (
                      <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 mr-2" />
                    ) : (
                      <PlayCircle className="w-5 h-5 mr-2" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-gray-500">
                        {lesson.duration || '15 mins'}
                      </div>
                    </div>
                    {hasAssessment && (
                      <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Quiz
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}

      {/* Navigation Controls at bottom */}
      {/* <div className="sticky bottom-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <button
              onClick={moveToPreviousLesson}
              disabled={isFirstLesson || !isPreviousLessonCompleted}
              className={`flex items-center px-4 py-2 rounded-md border ${
                isFirstLesson || !isPreviousLessonCompleted
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </button>
            <button
              onClick={moveToNextLesson}
              disabled={isLastLesson || !isCurrentLessonCompleted}
              className={`flex items-center px-4 py-2 rounded-md border ${
                isLastLesson || !isCurrentLessonCompleted
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div> */} 
    </div>
  );
};


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