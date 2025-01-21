import { useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, BookOpen, Clock, Target, Award, BarChart } from 'lucide-react';
import { CourseEntity, Level } from '../../types/ICourse';
import { EnrollmentEntity } from '../../types';

interface CourseViewerProps {
  enrollment: EnrollmentEntity;
  onBack: () => void;
  onLessonComplete: (lessonNumber: string, enrollmentId: string) => void;
  onAssessmentComplete: (lessonNumber: string, score: number, enrollmentId: string) => void;
  onProgressUpdate: (
    enrollmentId: string,
    update: Partial<{
      completedLessons: string[];
      completedAssessments: string[];
      overallCompletionPercentage: number;
    }>
  ) => void;
}

export function StudentCourseView({ 
  enrollment, 
  onBack, 
  onProgressUpdate
}: CourseViewerProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAssessment, setShowAssessment] = useState(false);

  if (!enrollment?.course?.lessons?.length || !enrollment?.course) return null;

  const currentLesson = enrollment.course.lessons[currentLessonIndex];
  if (!currentLesson) return null;

  const isLessonCompleted = enrollment.progress?.completedLessons?.includes(
    currentLesson.lessonNumber ?? '0'
  ) ?? false;

  const handleNextLesson = () => {
    if (currentLessonIndex < enrollment.course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowAssessment(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowAssessment(false);
    }
  };

  const handleLessonComplete = () => {
    const newCompletedLessons = [
      ...(enrollment.progress?.completedLessons ?? []),
      currentLesson.lessonNumber ?? '0',
    ];
  
    if (enrollment._id) {
      onProgressUpdate(enrollment._id, {
        completedLessons: newCompletedLessons,
        overallCompletionPercentage: calculateCompletionPercentage(
          newCompletedLessons,
          enrollment.course.lessons
        ),
      });
    }
  
    setShowAssessment(true);
  };

  const calculateCompletionPercentage = (
    completedLessons: string[],
    lessons: CourseEntity['lessons']
  ): number => {
    if (!lessons?.length) return 0;
    return Math.round((completedLessons.length / lessons.length) * 100);
  };
  
  const getLevelBadgeColor = (level: Level): string => {
    switch (level) {
      case Level.beginner:
        return 'bg-green-100 text-green-800';
      case Level.intermediate:
        return 'bg-blue-100 text-blue-800';
      case Level.advanced:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>Back to Course</span>
          </button>
          
          <div className="flex flex-col md:items-end">
            <h1 className="text-xl font-bold text-gray-900">{enrollment.course.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              {enrollment.course.level && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(enrollment.course.level)}`}>
                  {enrollment.course.level}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {enrollment.course.instructor?.firstName} {enrollment.course.instructor?.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart size={20} className="text-blue-600" />
              <span className="font-medium">Course Progress</span>
            </div>
            <span className="text-sm text-gray-600">
              {enrollment.progress?.overallCompletionPercentage ?? 0}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${enrollment.progress?.overallCompletionPercentage ?? 0}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {!showAssessment ? (
              <>
                {/* Video Player */}
                <div className="bg-black aspect-video rounded-lg overflow-hidden">
                  {currentLesson.video && (
                    <iframe
                      src={currentLesson.video}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>

                {/* Lesson Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                    {isLessonCompleted && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Award size={18} />
                        <span className="text-sm font-medium">Completed</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    {currentLesson.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>{currentLesson.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <BookOpen size={18} />
                      <span>Lesson {currentLesson.lessonNumber}</span>
                    </div>
                  </div>

                  {currentLesson.description && (
                    <p className="text-gray-700 mb-4">{currentLesson.description}</p>
                  )}

                  {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Target size={18} />
                        Learning Objectives
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {currentLesson.objectives.map((objective, index) => (
                          <li key={index} className="text-gray-700">{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isLessonCompleted && (
                    <button
                      onClick={handleLessonComplete}
                      className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Complete & Continue to Assessment
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Lesson Assessment</h2>
                {/* Add your AssessmentQuiz component here */}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                <span>Previous Lesson</span>
              </button>
              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === enrollment.course.lessons.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                <span>Next Lesson</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Lesson List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="space-y-3">
              {enrollment.course.lessons.map((lesson, index) => {
                const isCompleted = enrollment.progress?.completedLessons?.includes(
                  lesson.lessonNumber ?? ''
                ) ?? false;
                
                return (
                  <button
                    key={lesson.lessonNumber ?? index}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setShowAssessment(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg ${
                      index === currentLessonIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {isCompleted ? (
                      <Award className="text-green-600" size={20} />
                    ) : (
                      <PlayCircle 
                        className={index === currentLessonIndex ? 'text-blue-600' : 'text-gray-400'} 
                        size={20} 
                      />
                    )}
                    <div className="text-left flex-1">
                      <p className="font-medium">Lesson {lesson.lessonNumber}</p>
                      <p className="text-sm text-gray-500">{lesson.title}</p>
                      {lesson.duration && (
                        <p className="text-xs text-gray-400">{lesson.duration}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {enrollment.course.attachments && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Course Materials</h3>
                <a 
                  href={enrollment.course.attachments.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <BookOpen size={16} />
                  <span>{enrollment.course.attachments.title}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}