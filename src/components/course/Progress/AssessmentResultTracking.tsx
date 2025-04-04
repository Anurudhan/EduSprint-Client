import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  ChevronRight as ChevronRightPagination,
  BookOpen,
  Download
} from "lucide-react";
import { useLocation } from 'react-router-dom';
import { commonRequest, URL } from '../../../common/api';
import { AssessmentResult, CompleationStatus, EnrollmentEntity } from '../../../types';
import { config } from '../../../common/config';
import { useAppSelector } from '../../../hooks/hooks';
import { RootState } from '../../../redux';
import EnhancedCertificate from './EnhancedCertificate';

const AssessmentResultsTracking: React.FC = () => {
    const [expandedAssessments, setExpandedAssessments] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [enrollment, setEnrollment] = useState<EnrollmentEntity | null>(null);
    const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCertificate, setShowCertificate] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 6;
  
    const location = useLocation();
    const { enrollmentId } = location.state || {};
    const user =  useAppSelector((state:RootState)=>state.user.data)
  
    useEffect(() => {
      const fetchData = async () => {
        if (!enrollmentId) {
          setError("No enrollment ID provided");
          setLoading(false);
          return;
        }
  
        try {
          setLoading(true);
          const enrollmentResponse = await commonRequest<EnrollmentEntity>(
            "GET",
            `${URL}/course/enrollment/${enrollmentId}`,
            undefined,
            config
          );
          const assessmentResponse = await commonRequest<AssessmentResult[]>(
            "GET",
            `${URL}/course/assessment-results?enrollmentId=${enrollmentId}`,
            undefined,
            config
          );
  
          setEnrollment(enrollmentResponse.data);
          setAssessmentResults(assessmentResponse.data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [enrollmentId]);
    const toggleAssessmentExpansion = (assessmentId: string) => {
      setExpandedAssessments(prev => 
        prev.includes(assessmentId)
          ? prev.filter(id => id !== assessmentId)
          : [...prev, assessmentId]
      );
    };
    const generateCertificate = () => {
        if (enrollment?.completionStatus === CompleationStatus.Completed) {
            setShowCertificate(true);
        }
    };
    const sortedAssessments = [...(assessmentResults || [])]
      .filter(assessment => assessment)
      .sort((a, b) => (a.lessonId || '').localeCompare(b.lessonId || ''));
  
    const totalPages = Math.ceil(sortedAssessments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssessments = sortedAssessments.slice(indexOfFirstItem, indexOfLastItem);
  
    const overallProgress = enrollment?.progress?.overallCompletionPercentage || 0;
    const totalCourseScore = enrollment?.progress?.overallCompletionPercentage ?? 0;
    const completedLessonsCount = enrollment?.progress?.completedLessons?.length || 0;
    const completedAssessmentsCount = enrollment?.progress?.completedAssessments?.length || 0;
  
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
          <p className="text-red-500 dark:text-red-400 text-lg font-medium">
            Error: {error}
          </p>
        </div>
      );
    }
  
    if (!enrollment || sortedAssessments.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            No assessment results available for this enrollment.
          </p>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-10">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Course Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-800 dark:to-indigo-900 rounded-xl shadow-lg p-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-6">
              <img
                src={enrollment.course?.thumbnail || 'https://via.placeholder.com/150'}
                alt={enrollment.course?.title}
                className="w-24 h-24 rounded-lg object-cover shadow-md"
              />
              <div>
                <h1 className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-200">
                  {enrollment.course?.title || 'Unnamed Course'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Instructor: {enrollment.instructor?.userName || 'N/A'} ({enrollment.instructor?.email})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Level: {enrollment.course?.level || 'N/A'} | Language: {enrollment.course?.language || 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                enrollment.completionStatus === CompleationStatus.Completed
                  ? 'bg-green-200 text-green-800'
                  : enrollment.completionStatus === CompleationStatus.inProgress
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-blue-200 text-blue-800'
              }`}>
                {enrollment.completionStatus || 'Enrolled'}
              </span>
            </div>
          </motion.div>
  
          {/* Course Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-4">
              <div className="flex items-center justify-between w-full">
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                    Progress Overview
                  </h2>
                  {enrollment?.completionStatus === CompleationStatus.Completed && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateCertificate}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Download className="w-5 h-5" />
                      <span>Get Certificate</span>
                    </motion.button>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-72 bg-gray-300/50 dark:bg-gray-700/50 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    {overallProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>Total Score: <span className="font-bold">{totalCourseScore.toFixed(2)}</span></div>
                  <div>Lessons: <span className="font-bold">{completedLessonsCount}/{enrollment.course?.lessons?.length || 0}</span></div>
                  <div>Assessments: <span className="font-bold">{completedAssessmentsCount}</span></div>
                  <div>Enrolled: <span className="font-bold">{enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'}</span></div>
                </div>
              </div>
              <Trophy className="w-16 h-16 text-yellow-500 dark:text-yellow-400 animate-pulse" />
            </div>
          </motion.div>
  
          {/* Assessments List */}
          <div className="space-y-6">
            <AnimatePresence>
              {currentAssessments.map((assessment, index) => {
                const assessmentId = assessment._id || `assessment-${index}`;
                const isExpanded = expandedAssessments.includes(assessmentId);
                const lesson = enrollment.course?.lessons?.find(l => l.lessonNumber === assessment.lessonId);
  
                return (
                  <motion.div
                    key={assessmentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`rounded-xl overflow-hidden shadow-md border-2 transition-all duration-300 ${
                      assessment.status === 'passed'
                        ? 'border-green-300/50 bg-green-50 dark:bg-green-900/20'
                        : assessment.status === 'failed'
                        ? 'border-red-300/50 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-opacity-90 bg-gradient-to-r from-white/80 to-transparent dark:from-gray-800/80"
                      onClick={() => toggleAssessmentExpansion(assessmentId)}
                    >
                      <div className="flex items-center space-x-4">
                        {assessment.status === 'passed' ? (
                          <CheckCircle2 className="text-green-600 dark:text-green-400 w-7 h-7" />
                        ) : assessment.status === 'failed' ? (
                          <XCircle className="text-red-600 dark:text-red-400 w-7 h-7" />
                        ) : (
                          <BookOpen className="text-gray-500 dark:text-gray-400 w-7 h-7" />
                        )}
                        <div>
                          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Lesson {assessment.lessonId}: {lesson?.title || 'Unnamed Lesson'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Status: {assessment.status || 'Pending'} | Duration: {lesson?.duration || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                            {assessment.earnedPoints || 0} / {assessment.totalPoints || 0}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Best: {(assessment.bestScore || 0).toFixed(2)}%
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                    </div>
  
                    <AnimatePresence>
                      {isExpanded && assessment.attempts && assessment.attempts.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-5 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                        >
                          {assessment.attempts.map((attempt, attemptIndex) => (
                            <div
                              key={attemptIndex}
                              className={`mb-4 p-4 rounded-lg border shadow-sm ${
                                attempt.passed
                                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                                  : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                  Attempt {attemptIndex + 1}
                                </div>
                                <div className={`font-bold text-lg ${
                                  attempt.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                }`}>
                                  {(attempt.score || 0).toFixed(2)} Points
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p>Completed: {attempt.completedAt 
                                  ? new Date(attempt.completedAt).toLocaleString() 
                                  : 'N/A'}</p>
                                <p>Answers: {attempt.answers.map((a,i) => 
                                  `${i+1}: ${a.selectedAnswer} (${a.isCorrect ? 'Correct' : 'Incorrect'})`
                                ).join(', ')}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {showCertificate && (
  <EnhancedCertificate
    enrollment={enrollment}
    user={user}
    enrollmentId={enrollmentId}
    totalCourseScore={totalCourseScore}
    onClose={() => setShowCertificate(false)}
  />
)}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-6 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightPagination className="w-6 h-6" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default AssessmentResultsTracking;