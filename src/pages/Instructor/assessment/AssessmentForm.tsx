
import { PlusCircle, Trash2, Save, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Assessment,
  Question,
  QuestionType,
  Choice,
} from "../../../types/IAssessment";
import * as Yup from "yup";
import { FormikErrors, useFormik } from "formik";
import { useState } from "react";

interface AssessmentFormProps {
  courseId: string;
  lessonId: string;
  initialData?: Assessment | null;
  isEdit: boolean;
  onSubmit: (data: Assessment, isEdit: boolean) => void;
  onBack?: () => void; // Make it optional with ?
}
const QUESTIONS_PER_PAGE = 1;
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  passingScore: Yup.number()
    .required("Passing score is required")
    .min(0, "Score must be between 0 and 100")
    .max(100, "Score must be between 0 and 100"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().required("Question text is required"),
        points: Yup.number()
          .required("Points are required")
          .min(1, "Minimum 1 point required"),
        choices: Yup.array().when("type", {
          is: QuestionType.MULTIPLE_CHOICE,
          then: (schema) =>
            schema
              .min(2, "At least 2 choices are required")
              .of(
                Yup.object().shape({
                  text: Yup.string().required("Choice text is required"),
                  isCorrect: Yup.boolean().required(
                    "Correct answer selection is required"
                  ),
                })
              )
              .test(
                "has-correct-answer",
                "At least one correct answer is required",
                (choices) =>
                  choices?.some((choice) => choice.isCorrect) ?? false
              ),
        }),
      })
    )
    .min(1, "At least one question is required"),
});

export default function AssessmentForm({
  courseId,
  lessonId,
  initialData,
  onSubmit,
  onBack,
  isEdit,
}: AssessmentFormProps) {
  const formik = useFormik({
    initialValues: initialData || {
      courseId,
      lessonId,
      title: "",
      description: "",
      passingScore: 70,
      questions: [],
      isPublished: false,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values, isEdit);
    },
  });


  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(formik.values.questions.length / QUESTIONS_PER_PAGE);

  // Get the questions for the current page
  const paginatedQuestions = formik.values.questions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: QuestionType.MULTIPLE_CHOICE,
      text: "",
      choices: [],
      points: 1,
    };
    formik.setFieldValue("questions", [
      newQuestion, 
      ...formik.values.questions
    ]);
    setCurrentPage(1);
  };

  const addChoice = (questionId: string) => {
    const newChoice: Choice = {
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    };
    const updatedQuestions = formik.values.questions.map((q) =>
      q.id === questionId
        ? { ...q, choices: [...(q.choices || []), newChoice] }
        : q
    );
    formik.setFieldValue("questions", updatedQuestions);
  };

  const removeChoice = (questionId: string, choiceId: string) => {
    const updatedQuestions = formik.values.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            choices: q.choices?.filter((c) => c.id !== choiceId) || [],
          }
        : q
    );
    formik.setFieldValue("questions", updatedQuestions);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const updatedQuestions = formik.values.questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    formik.setFieldValue("questions", updatedQuestions);
  };

  const removeQuestion = (questionId: string) => {
    const updatedQuestions = formik.values.questions.filter(
      (q) => q.id !== questionId
    );
    formik.setFieldValue("questions", updatedQuestions);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6 px-6">
          <motion.button
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back to Lesson</span>
          </motion.button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 space-y-8">
            <div className="border-b pb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Assessment Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    placeholder="Enter assessment title"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {formik.errors.title}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    rows={4}
                    placeholder="Enter assessment description"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {formik.errors.description}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    name="passingScore"
                    value={formik.values.passingScore}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-40 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    min="0"
                    max="100"
                  />
                  {formik.touched.passingScore &&
                    formik.errors.passingScore && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 text-sm text-red-600"
                      >
                        {formik.errors.passingScore}
                      </motion.p>
                    )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Questions</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <PlusCircle size={20} />
                  Add Question
                </motion.button>
              </div>

              {formik.touched.questions &&
                typeof formik.errors.questions === "string" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 text-sm text-red-600"
                  >
                    {formik.errors.questions}
                  </motion.p>
                )}

              <AnimatePresence>
                {paginatedQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 280 }} // Animate from the top
                    animate={{ opacity: 1, y: 0 }} // Settle into position
                    exit={{ opacity: 0, y: -20 }} // Animate out to the top
                    transition={{ duration: 0.3 }} // Smooth transition
                    className="mb-6 p-6 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors"
                  >
                    {/* Question UI */}
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        Question {currentPage} 
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>

                    {/* Question Fields (Type, Text, Choices, Points) */}
                    <div className="space-y-4">
                      {/* Question Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              type: e.target.value as QuestionType,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        >
                          {Object.values(QuestionType).map((type) => (
                            <option key={type} value={type}>
                              {type.replace("_", " ").toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              text: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                          rows={3}
                          placeholder="Enter your question"
                        />
                        {formik.touched.questions?.[index]?.text &&
                          (
                            formik.errors.questions?.[
                              index
                            ] as FormikErrors<Question>
                          )?.text && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {
                                (
                                  formik.errors.questions?.[
                                    index
                                  ] as FormikErrors<Question>
                                ).text
                              }
                            </motion.p>
                          )}
                      </div>

                      {/* Choices (for Multiple Choice Questions) */}
                      {question.type === QuestionType.MULTIPLE_CHOICE && (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Choices
                            </label>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => addChoice(question.id)}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                              Add Choice
                            </motion.button>
                          </div>

                          {/* Render Choices */}
                          <AnimatePresence>
                            {question.choices?.map((choice, choiceIndex) => (
                              <motion.div
                                key={choice.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 mb-3"
                              >
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={choice.isCorrect}
                                  onChange={() => {
                                    const updatedChoices =
                                      question.choices?.map((c) => ({
                                        ...c,
                                        isCorrect: c.id === choice.id,
                                      }));
                                    updateQuestion(question.id, {
                                      choices: updatedChoices,
                                    });
                                  }}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={choice.text}
                                  onChange={(e) => {
                                    const updatedChoices =
                                      question.choices?.map((c) =>
                                        c.id === choice.id
                                          ? { ...c, text: e.target.value }
                                          : c
                                      );
                                    updateQuestion(question.id, {
                                      choices: updatedChoices,
                                    });
                                  }}
                                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                  placeholder={`Choice ${choiceIndex + 1}`}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() =>
                                    removeChoice(question.id, choice.id)
                                  }
                                  className="text-red-500 hover:text-red-600 p-2"
                                >
                                  <Trash2 size={16} />
                                </motion.button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Points */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              points: Number(e.target.value),
                            })
                          }
                          className="w-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                          min="1"
                          placeholder="Points"
                        />
                        {formik.touched.questions?.[index]?.points &&
                          (
                            formik.errors.questions?.[
                              index
                            ] as FormikErrors<Question>
                          )?.points && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {
                                (
                                  formik.errors.questions?.[
                                    index
                                  ] as FormikErrors<Question>
                                ).points
                              }
                            </motion.p>
                          )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex justify-between items-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              </div>
            </div>

            <motion.div
              className="flex justify-end gap-4 pt-6 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>

              {formik.values.questions.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white shadow-md transition-all
                    ${
                      !formik.isValid
                        ? "bg-gray-400 cursor-not-allowed opacity-50"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  disabled={!formik.isValid}
                >
                  <Save size={20} />
                  Publish Assessment
                </motion.button>
              )}
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
