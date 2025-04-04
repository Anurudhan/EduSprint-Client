import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle, Award, Trophy, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Assessment } from '../../../types/IAssessment';
import { AssessmentResult, EnrollmentEntity } from '../../../types';
import { AssessmentResultV1 } from './AssessmentResult';
import { LessonPlayer } from './LessonPlayerV1';
import LoadingSpinner from '../../common/loadingSpinner';
import { AssessmentStatus, CourseLearningService, LessonStatus } from './CourseLearningService';


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
  const [assessmentAttempts, setAssessmentAttempts] = useState<{ [lessonNumber: string]: number }>({});

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
  }, [enrollment, assessments, currentLessonIndex, lessons]);

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

  const handleRetryAssessment = () => {
    if (!currentLesson?.lessonNumber) return;
    const lessonNumber = currentLesson.lessonNumber;


    // Reset assessment status to 'available' for retry
    setAssessmentStatus(prev => ({
      ...prev,
      [lessonNumber]: 'available'
    }));
    setShowAssessment(true); // Show the assessment page
  };
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
    );
  };

  const handleAssessmentComplete = (
    score: number,
    answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[]
  ) => {
    if (!currentLesson?.lessonNumber || !currentAssessment) return;

    const passingScore = currentAssessment.passingScore || 70;
    const status = score >= passingScore ? 'passed' : 'failed';

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
      currentLessonIndex,
      assessments
    );

    const lessonNumber = currentLesson.lessonNumber || '';
    setAssessmentAttempts(prev => ({
      ...prev,
      [lessonNumber]: (prev[lessonNumber] || 0) + 1
    }));

    if (status === 'failed') {
      setShowAssessment(true);
    }
  };

  const handleLessonSelection = (index: number) => {
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
  

  const handleBackToLesson = () => {
    setShowAssessment(false);
  };

  const renderAssessmentContent = () => {
    if (!currentLesson || !currentAssessment) return null;
  
    const currentLessonNumber = currentLesson.lessonNumber || '';
    const lessonResult = assessmentResults.find(r => r.lessonId === currentLessonNumber);
    const passingScore = currentAssessment.passingScore || 70;
    
    // When assessment is first available and no previous results
    if (assessmentStatus[currentLessonNumber] === 'available' && (!lessonResult || lessonResult.status === 'failed')) {
      return (
        <div className="space-y-6">
          <button
            onClick={handleBackToLesson}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2 transform rotate-180" />
            Back to Lesson
          </button>
          <AssessmentResultV1
            questions={currentAssessment.questions}
            onComplete={handleAssessmentComplete}
          />
        </div>
      );
    }
  
    // When assessment is failed
    if (lessonResult && lessonResult.status === 'failed') {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">Assessment Result</h2>
          </div>
          <p className="text-gray-600">
            Your score: {lessonResult.bestScore.toFixed(1)}% (Passing score: {passingScore}%)
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleRetryAssessment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Trophy className="mr-2 w-5 h-5" />
              Retry Assessment
            </button>
            
            {currentLessonIndex < lessons.length - 1 && (
              <button
                onClick={() => {
                  if (assessmentAttempts[currentLesson.lessonNumber || ''] >= 3) {
                    alert('Maximum retry attempts reached. Please review the lesson.');
                  } else {
                    setShowAssessment(true);
                  }
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ArrowRight className="mr-2 w-5 h-5" />
                Next Lesson
              </button>
            )}
            
            <button
              onClick={handleBackToLesson}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Lesson
            </button>
          </div>
        </div>
      );
    }
  
    // When assessment is passed
    if (lessonResult && lessonResult.status === 'passed') {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold">Assessment Passed!</h2>
          </div>
          <p className="text-gray-600">
            Your score: {lessonResult.bestScore.toFixed(1)}%
          </p>
          <div className="flex gap-4">
            {currentLessonIndex < lessons.length - 1 && (
              <button
                onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Next Lesson
              </button>
            )}
            <button
              onClick={handleBackToLesson}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Lesson
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Assessment is locked. Complete the lesson first.</p>
      </div>
    );
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
          <div className="lg:col-span-3 relative">
            {currentLesson && showAssessment && currentAssessment ? (
              renderAssessmentContent()
            ) : currentLesson ? (
              <div>
                <LessonPlayer
                  lesson={currentLesson}
                  courseId={enrollment.courseId as string}
                  enrollment={enrollment}
                  onComplete={handleLessonComplete}
                  isCompleted={lessonStatus[currentLesson.lessonNumber || ''] === 'completed'}
                />
                {lessonStatus[currentLesson.lessonNumber || ''] === 'completed' && (
                  <div className="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                    {currentAssessment ? (
                      <button
                        onClick={() => setShowAssessment(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Trophy className="mr-2 w-5 h-5" />
                        Take Assessment
                      </button>
                    ) : (
                      <div></div>
                    )}
                    {currentLessonIndex < lessons.length - 1 && (
                      <button
                        onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <ArrowRight className="mr-2 w-5 h-5" />
                        Next Lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
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