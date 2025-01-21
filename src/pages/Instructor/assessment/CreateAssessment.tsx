import { useState } from "react";
import AssessmentForm from "./AssessmentForm";
import { Assessment } from "../../../types/IAssessment";
import {
  Lesson
} from "../../../types/ICourse";
import { useLocation } from "react-router-dom";

function CreateAssessment() {
  // Sample course data - replace with your actual data fetching
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const location = useLocation();
  const { course } = location.state || {}; // Ensure fallback for safety

  const handleSubmit = (assessment: Assessment) => {
    console.log("Assessment submitted:", assessment);
    setShowAssessmentForm(false);
    setSelectedLesson(null);
    // Here you would typically save the assessment to your backend
  };
  if (!course.lessons) return null;
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center gap-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-32 h-24 object-cover rounded-md"
            />
            <div>
              <p className="text-sm text-gray-500">
                Level: {course.level}
              </p>
              <p className="text-sm text-gray-500">
                Price:{" "}
                {course.pricing?.type === "free"
                  ? "Free"
                  : `$${course.pricing?.amount}`}
              </p>
            </div>
          </div>
        </div>

        {!showAssessmentForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Course Lessons
            </h2>
            <div className="space-y-4">
              {course.lessons.map((lesson:Lesson) => (
                <div
                  key={lesson.lessonNumber}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Lesson {lesson.lessonNumber}: {lesson.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{lesson.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Duration: {lesson.duration}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setShowAssessmentForm(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Add Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setShowAssessmentForm(false);
                setSelectedLesson(null);
              }}
              className="mb-4 text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
            >
              ← Back to Lessons
            </button>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Assessment for Lesson: {selectedLesson?.title}
              </h2>
              <AssessmentForm
                courseId={course._id as string}
                lessonId={selectedLesson?.lessonNumber as string}
                onSubmit={handleSubmit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateAssessment;
