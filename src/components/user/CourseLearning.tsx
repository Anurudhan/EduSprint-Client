import React, { useEffect, useState, useMemo } from 'react';
import { ChevronRight, User, Clock, BookOpen, Lock, PlayCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import { LessonPlayer } from './LessonPlayer';
import { EnrollmentEntity } from '../../types';
import { AssessmentComponent } from './AssessmentComponent';
import { config } from '../../common/config';
import { commonRequest, URL } from '../../common/api';
import { Assessment } from '../../types/IAssessment';
import LoadingSpinner from '../common/loadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useChatProcessing } from '../../context/useChatProcessing';

interface CourseLearningProps {
  enrollment: EnrollmentEntity;
  onLessonComplete: (lessonNumber: string, assessmentId: string) => void;
  onBack: () => void;
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
  const navigate = useNavigate();

  const course = enrollment.course;
  const currentLesson = course?.lessons?.[currentLessonIndex];
  const { receiverProcessedRef } = useChatProcessing();
  const completedLessons = useMemo(() => 
    enrollment.progress?.completedLessons || [], 
    [enrollment.progress?.completedLessons]
  );
  
  const completedAssessments = enrollment.progress?.completedAssessments || [];

  useEffect(() => {
    if (course?.lessons && completedLessons.length > 0) {
      const lastCompletedIndex = course.lessons.findIndex(
        lesson => lesson.lessonNumber == completedLessons[completedLessons.length - 1]
      );
      const nextLessonIndex = lastCompletedIndex + 1;
      
      if (nextLessonIndex < course.lessons.length && completedLessons.length < course.lessons.length) {
        setCurrentLessonIndex(nextLessonIndex);
      }
    }
  }, [course?.lessons, completedLessons]);

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
    }
  };

  const moveToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setAssessment(null);  
      setShowAssessment(false);
    }
  };
  const handleMessageClick = () => {
    receiverProcessedRef.current=false;
    navigate('/student/chat',{state:{receiver:enrollment?.instructor??null}});
  };
  const handleAssessmentComplete = (passed: boolean) => {
    if (passed) {
      onLessonComplete(currentLesson?.lessonNumber || '', assessment?._id || '');
      const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
      if (!isLastLesson) {
        moveToNextLesson();
      }
    }
    setShowAssessment(false);
  };

  const handleLessonComplete = async (lessonNumber: string) => {
    const newAssessment = await fetchAssessments();
    if (newAssessment && !completedAssessments.includes(newAssessment._id || '')) {
      setAssessment(newAssessment);
      setShowAssessment(true);
    } else {
      onLessonComplete(lessonNumber, newAssessment?._id as string);
      const isLastLesson = currentLessonIndex === (course?.lessons?.length || 0) - 1;
      if (!isLastLesson) {
        moveToNextLesson();
      }
    }
  };

  if (!course || !currentLesson) return null;
  if (isLoading) return <LoadingSpinner/>;

  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === (course.lessons?.length || 0) - 1;
  const isPreviousLessonCompleted = isFirstLesson || completedLessons.includes(course.lessons?.[currentLessonIndex - 1]?.lessonNumber || '');

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
            {showAssessment && assessment ? (
              <AssessmentComponent
                assessment={assessment}
                onComplete={handleAssessmentComplete}
              />
            ) : (
              <LessonPlayer
                lesson={currentLesson}
                lessonId={currentLessonIndex}
                isCompleted={completedLessons.includes(currentLesson.lessonNumber || '')}
                isLocked={!isPreviousLessonCompleted}
                onComplete={handleLessonComplete}
                onMessage={handleMessageClick}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.lessons?.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.lessonNumber || '');
                const isLocked = index > 0 && !completedLessons.includes(course.lessons?.[index - 1]?.lessonNumber || '');

                return (
                  <button
                    key={lesson.lessonNumber}
                    onClick={() => !isLocked && setCurrentLessonIndex(index)}
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
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-gray-500">
                        {lesson.duration || '15 mins'}
                      </div>
                    </div>
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
              disabled={isLastLesson || !completedLessons.includes(currentLesson.lessonNumber || '')}
              className={`flex items-center px-4 py-2 rounded-md border ${
                isLastLesson || !completedLessons.includes(currentLesson.lessonNumber || '')
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