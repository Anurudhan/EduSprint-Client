import React, { useState } from 'react';
import { ChevronRight, User, Clock, BookOpen, Lock, PlayCircle } from 'lucide-react';
import { LessonPlayer } from './LessonPlayer';
import { EnrollmentEntity } from '../../types';
import { Assessment } from '../../types/IAssessment';
import { AssessmentComponent } from './AssessmentComponent';


interface CourseLearningProps {
  enrollment: EnrollmentEntity;
  onLessonComplete: (lessonNumber: string) => void;
}

export const CourseLearning: React.FC<CourseLearningProps> = ({
  enrollment,
  onLessonComplete
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);

  const course = enrollment.course;
  const currentLesson = course?.lessons?.[currentLessonIndex];
  const completedLessons = enrollment.progress?.completedLessons || [];

  // Mock assessment data
  const mockAssessment: Assessment = {
    _id: '1',
    courseId: course?._id || '',
    lessonId: currentLesson?.lessonNumber || '',
    title: `${currentLesson?.title} Assessment`,
    description: 'Complete this assessment to proceed to the next lesson.',
    passingScore: 70,
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
        text: 'What is the main concept covered in this lesson?',
        choices: [
          { id: 'a', text: 'Option A', isCorrect: true },
          { id: 'b', text: 'Option B', isCorrect: false },
          { id: 'c', text: 'Option C', isCorrect: false },
        ],
        points: 10
      }
    ],
    isPublished: true
  };

  const handleLessonComplete = () => {
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (passed: boolean) => {
    if (passed) {
      onLessonComplete(currentLesson?.lessonNumber || '');
      if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
        setCurrentLessonIndex(prev => prev + 1);
      }
    }
    setShowAssessment(false);
  };

  if (!course || !currentLesson) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <span>Instructor: {course.instructorRef}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {showAssessment ? (
              <AssessmentComponent
                assessment={mockAssessment}
                onComplete={handleAssessmentComplete}
              />
            ) : (
              <LessonPlayer
                lesson={currentLesson}
                isCompleted={completedLessons.includes(currentLesson.lessonNumber || '')}
                isLocked={currentLessonIndex > 0 && !completedLessons.includes(course.lessons?.[currentLessonIndex - 1]?.lessonNumber || '')}
                onComplete={handleLessonComplete}
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
    </div>
  );
};