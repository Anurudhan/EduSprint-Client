// import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Edit2, Trash2, Plus } from "lucide-react";
import AssessmentForm from "./AssessmentForm";
import { Assessment } from "../../../types/IAssessment";
import { Lesson } from "../../../types/ICourse";
import { useLocation } from "react-router-dom";
import { commonRequest, URL } from "../../../common/api";
import { config } from "../../../common/config";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import { useCallback, useEffect, useState } from "react";

function CreateAssessment() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [assessments, setAssessments] = useState<{
    [key: string]: Assessment | null;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const { course } = location.state || {};

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await commonRequest<Assessment[]>(
        "GET",
        `${URL}/course/assessment?courseId=${course?._id}`,
        null,
        config
      );
      const assessmentsData: Assessment[] = response.data;
      const assessmentMap: { [key: string]: Assessment | null } = {};
      course.lessons.forEach((lesson: Lesson) => {
        const foundAssessment = assessmentsData.find(
          (a) => a.lessonId === lesson.lessonNumber
        );
        assessmentMap[lesson?.lessonNumber as string] = foundAssessment || null;
      });
      setAssessments(assessmentMap);
    } catch (error) {
      console.log("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  }, [course]);

  useEffect(() => {
    if (course?._id) {
      fetchAssessments();
    }
  }, [course, fetchAssessments]);

  const handleSubmit = async (assessment: Assessment, isEdit: boolean) => {
    try {
      setShowAssessmentForm(false);
      setSelectedLesson(null);
      setLoading(true);
      let response;
      console.log(assessment, "this is the data for editing");
      if (isEdit)
        response = await commonRequest<Assessment>(
          "PUT",
          `${URL}/course/assessment`,
          assessment,
          config
        );
      else response = await commonRequest<Assessment>(
        "POST",
        `${URL}/course/assessment`,
        assessment,
        config
      );
      if (response.success) await fetchAssessments();
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleDelete = async (lessonId: string) => {
    try {
      await commonRequest(
        "DELETE",
        `${URL}/course/assessment/${lessonId}`,
        null,
        config
      );
      setAssessments((prev) => ({ ...prev, [lessonId]: null }));
    } catch (error) {
      console.log("Error deleting assessment:", error);
    }
  };

  if (!course?.lessons) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-40 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white p-2 rounded-lg shadow-lg">
                <Book size={20} />
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  Level: {course.level}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  Price:{" "}
                  {course.pricing?.type === "free"
                    ? "Free"
                    : `$${course.pricing?.amount}`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showAssessmentForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Lessons
              </h2>
              <div className="space-y-4">
                {course.lessons.map((lesson: Lesson, index: number) => (
                  <motion.div
                    key={lesson.lessonNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-indigo-600">
                            {lesson.lessonNumber}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {lesson.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Duration: {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {assessments[lesson.lessonNumber as string] ? (
                          <motion.div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setShowAssessmentForm(true);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <Edit2 size={18} />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleDelete(lesson.lessonNumber as string)
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <Trash2 size={18} />
                              Delete
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowAssessmentForm(true);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <Plus size={18} />
                            Create Assessment
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {assessments[selectedLesson?.lessonNumber || ""]
                    ? "Edit"
                    : "Create"}{" "}
                  Assessment for Lesson: {selectedLesson?.title}
                </h2>
                <AssessmentForm
                  courseId={course._id as string}
                  lessonId={selectedLesson?.lessonNumber as string}
                  onSubmit={handleSubmit}
                  onBack={() => {
                    setShowAssessmentForm(false);
                    setSelectedLesson(null);
                  }}
                  isEdit={
                    assessments[selectedLesson?.lessonNumber || ""]
                      ? true
                      : false
                  }
                  initialData={
                    assessments[(selectedLesson?.lessonNumber as string) || ""]
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreateAssessment;
