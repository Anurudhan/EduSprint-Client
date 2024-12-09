import { Minus, Video } from "lucide-react";
import { CourseEntity, Lesson } from "../../../types/ICourse";

const LessonInput: React.FC<{
  lesson: Lesson;
  index: number;
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
  removeLesson: (index: number) => void;
  onVideoUpload: (file: File, lessonIndex: number) => void;
  progress: number;
}> = ({
  lesson,
  index,
  course,
  setCourse,
  removeLesson,
  onVideoUpload,
  progress,
}) => {
  const durationRegex = /^(\d{1,2}):([0-5]\d):([0-5]\d)$/;
  const isValidDuration = (duration?: string) => {
    if (!duration) return false;
    const match = duration.match(durationRegex);
    if (!match) return false;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);

    return (
      hours >= 0 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60
    );
  };
  return (
    <div key={index} className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium">Lesson {lesson.lessonNumber}</h4>
        <button
          type="button"
          onClick={() => removeLesson(index)}
          className="text-red-600 hover:text-red-700"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Lesson Title"
          className="block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
          value={lesson.title}
          onChange={(e) => {
            const newLessons = [...(course.lessons || [])];
            newLessons[index] = { ...lesson, title: e.target.value };
            setCourse((prev) => ({ ...prev, lessons: newLessons }));
          }}
        />

        <textarea
          placeholder="Lesson Description"
          className="block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          value={lesson.description}
          onChange={(e) => {
            const newLessons = [...(course.lessons || [])];
            newLessons[index] = { ...lesson, description: e.target.value };
            setCourse((prev) => ({ ...prev, lessons: newLessons }));
          }}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("video/")) {
                onVideoUpload(file, index);
              }
            }}
          />
          {lesson.video && <p className="text-green-500">Video Uploaded</p>}
        </div>
        {progress > 0 && progress < 100 && (
          <div className="mt-4 p-4 border rounded-md shadow-md bg-gray-50">
            <div className="flex items-center space-x-4">
              <Video className="h-8 w-8 text-blue-500 animate-bounce" />
              <div className="w-full">
                <div className="relative w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2 text-gray-600">
                  Uploading... {progress}%
                </p>
              </div>
            </div>
          </div>
        )}

        {lesson.video && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Video Preview
            </label>
            <video
              src={lesson.video}
              controls
              className="mt-2 w-full max-h-64 rounded-lg shadow-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <input
          type="text"
          placeholder="Duration (e.g., 1:30:00)"
          className={`block w-full rounded-md border-2 shadow-md ${
            isValidDuration(lesson.duration)
              ? "border-gray-200 focus:border-blue-500"
              : "border-red-500 focus:border-red-500"
          }`}
          value={lesson.duration}
          onChange={(e) => {
            const newLessons = [...(course.lessons || [])];
            newLessons[index] = { ...lesson, duration: e.target.value };
            setCourse((prev) => ({ ...prev, lessons: newLessons }));
          }}
        />
      </div>
    </div>
  );
};
export default LessonInput;
