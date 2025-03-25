
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


import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, User, Clock, BookOpen, Lock, PlayCircle, ChevronLeft, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { LessonPlayer } from './LessonPlayer';
import { EnrollmentEntity } from '../../types';
import { AssessmentComponent } from './AssessmentComponent';
import { config } from '../../common/config';
import { commonRequest, URL } from '../../common/api';
import { Assessment } from '../../types/IAssessment';
import LoadingSpinner from '../common/loadingSpinner';
import { useNavigate } from 'react-router-dom';

interface CourseLearningProps {
  enrollment: EnrollmentEntity;
  onLessonComplete: (lessonNumber: string, assessmentId: string) => void;
  onBack: () => void;
}

interface AssessmentResult {
  assessmentId: string;
  lessonId: string;
  score: number;
  passed: boolean;
  completedAt: Date;
}

export const CourseLearning: React.FC<CourseLearningProps> = ({
  enrollment,
  onLessonComplete,
  onBack
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<Assessment|null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [currentView, setCurrentView] = useState<'lesson'|'assessment'|'results'|'completed'|'lessonCompleted'>('lesson');
  const [lastAttemptScore, setLastAttemptScore] = useState<number>(0);
  const [lastAttemptPassed, setLastAttemptPassed] = useState<boolean>(false);
  const [hasAssessmentForCurrentLesson, setHasAssessmentForCurrentLesson] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const course = enrollment.course;
  const currentLesson = course?.lessons?.[currentLessonIndex];
  const completedLessons = useMemo(() => 
    enrollment.progress?.completedLessons || [], 
    [enrollment.progress?.completedLessons]
  );
  
  const completedAssessments = enrollment.progress?.completedAssessments || [];

  useEffect(() => {
    if (course?.lessons && completedLessons.length > 0) {
      const lastCompletedIndex = course.lessons.findIndex(
        lesson => lesson.lessonNumber === completedLessons[completedLessons.length - 1]
      );
      const nextLessonIndex = lastCompletedIndex + 1;
      
      if (nextLessonIndex < course.lessons.length && completedLessons.length < course.lessons.length) {
        setCurrentLessonIndex(nextLessonIndex);
      }
    }
  }, [course?.lessons, completedLessons]);

  // Check if current lesson has an assessment when lesson changes
  useEffect(() => {
    const checkForAssessment = async () => {
      if (currentLesson) {
        const hasAssessment = await checkAssessmentExists();
        setHasAssessmentForCurrentLesson(hasAssessment);
      }
    };
    
    checkForAssessment();
  }, [currentLessonIndex, currentLesson]);

  // Fetch assessment results from backend on load
  useEffect(() => {
    fetchAssessmentResults();
  }, [enrollment]);

  const fetchAssessmentResults = async () => {
    if (!enrollment?._id) return;
    setIsLoading(true);
    try {
      const response = await commonRequest<AssessmentResult[]>(
        "GET",
        `${URL}/course/assessment-results?enrollmentId=${enrollment._id}`,
        undefined,
        config
      );
      
      if (response.success && Array.isArray(response.data)) {
        setAssessmentResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching assessment results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAssessmentExists = async () => {
    if (!course?._id || !currentLesson) return false;
    
    try {
      const response = await commonRequest(
        "GET",
        `${URL}/course/assessment/exists?courseId=${course?._id}&lessonId=${currentLessonIndex+1}`, 
        undefined,
        config
      );
      
      return response.success && response.data?.exists;
    } catch (error) {
      console.error("Error checking if assessment exists:", error);
      return false;
    }
  };

  const fetchAssessments = async () => {
    if (!course?._id || !currentLesson) return null;
    setIsLoading(true);
    try {
      const response = await commonRequest<Assessment>(
        "GET",
        `${URL}/course/assessment?courseId=${course?._id}&lessonId=${currentLessonIndex+1}`, 
        undefined,
        config
      );
      if (!response.success || typeof response !== "object" || !("_id" in response.data)) {
        console.error("Invalid response in assessment");
        return null;
      }    
      return response.data; 
    } catch (error) {
      console.error("An error occurred while fetching assessments:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const moveToNextLesson = () => {
    if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setAssessment(null);
      setShowAssessment(false);
      setCurrentView('lesson');
    }
  };

  const moveToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setAssessment(null);  
      setShowAssessment(false);
      setCurrentView('lesson');
    }
  };

  const handleMessageClick = async() => {
    navigate('/student/chat', {state: {receiver: enrollment?.instructor ?? null}});
  };

  const saveAssessmentResult = async (score: number, passed: boolean, answers: Record<string, string>) => {
    if (!assessment?._id || !enrollment?._id) return;
    
    try {
      const result: Partial<AssessmentResult> = {
        assessmentId: assessment._id,
        lessonId: assessment.lessonId,
        score,
        passed,
        completedAt: new Date()
      };
      
      await commonRequest(
        "POST",
        `${URL}/course/assessment-results`,
        { enrollmentId: enrollment._id, answers, ...result },
        config
      );
      
      // Update local state with new result
      setAssessmentResults(prev => [...prev, result as AssessmentResult]);
    } catch (error) {
      console.error("Error saving assessment result:", error);
    }
  };

  const handleAssessmentComplete = async (passed: boolean, score: number, answers: Record<string, string>) => {
    setLastAttemptScore(score);
    setLastAttemptPassed(passed);
    
    // Save assessment result to backend
    await saveAssessmentResult(score, passed, answers);
    
    if (passed) {
      onLessonComplete(currentLesson?.lessonNumber || '', assessment?._id || '');
      setCurrentView('results');
    } else {
      setCurrentView('results');
    }
  };

  const handleLessonComplete = async (lessonNumber: string) => {
    // First, show the lesson completed view
    setCurrentView('lessonCompleted');
    
    // Check if there's an assessment for this lesson
    const newAssessment = await fetchAssessments();
    
    if (newAssessment && !completedAssessments.includes(newAssessment._id || '')) {
      setAssessment(newAssessment);
      setShowAssessment(true);
    } else {
      // If no assessment, mark the lesson as completed
      onLessonComplete(lessonNumber, newAssessment?._id as string);
      const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
      if (isLastLesson) {
        setCurrentView('completed');
      }
    }
  };

  const renderAssessmentResults = () => {
    const relevantResults = assessmentResults.filter(
      result => result.lessonId === `${currentLessonIndex+1}`
    );
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Assessment Results</h2>
        
        <div className="mb-6 p-4 rounded-lg flex items-center gap-4 border">
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
              onClick={() => {
                setCurrentView('assessment');
                setShowAssessment(true);
              }}
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
          <div className="lg:col-span-2">
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
                  onComplete={handleLessonComplete}
                  onMessage={handleMessageClick}
                />
              )
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.lessons?.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.lessonNumber || '');
                const isLocked = index > 0 && !completedLessons.includes(course.lessons?.[index - 1]?.lessonNumber || '');
                const hasAssessment = assessmentResults.some(result => result.lessonId === `${index+1}`);

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
      </div>

      {/* Navigation Controls at bottom */}
      <div className="sticky bottom-0 bg-white border-t">
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
      </div>
    </div>
  );
};