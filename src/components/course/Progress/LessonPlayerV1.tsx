import { useState, useEffect, useRef } from "react";
import { URL } from "../../../common/api";
import { Lesson } from "../../../types/ICourse";
import { LessonProgressService } from "../../user/LessonProgressService";
import { EnrollmentEntity } from "../../../types";

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
  courseId: string;
  enrollment: EnrollmentEntity;
}

export function LessonPlayer({
  lesson,
  courseId,
  onComplete,
  isCompleted,
  enrollment,
}: LessonPlayerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [buffering, setBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const progressBarRef = useRef<HTMLDivElement>(null);

  const authToken = localStorage.getItem("authToken") || "";
  const debouncedProgressUpdate = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSavedProgress = () => {
      const lessonProgress = enrollment.lessonProgresses?.find(
        (lp) => lp.lessonId === lesson.lessonNumber
      );
      if (lessonProgress?.videoProgress?.watchedDuration && videoRef.current) {
        const savedTime = lessonProgress.videoProgress.watchedDuration;
        setCurrentTime(savedTime);
        videoRef.current.currentTime = savedTime; // Set the video to the last watched time
        setProgress(
          (savedTime / (lessonProgress.videoProgress.totalDuration || 1)) * 100
        );
      }
    };

    if (videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = async () => {
        if (video.duration) {
          const percentage = (video.currentTime / video.duration) * 100;
          setProgress(percentage);
          setCurrentTime(video.currentTime);

          if (debouncedProgressUpdate.current) {
            clearTimeout(debouncedProgressUpdate.current);
          }
          debouncedProgressUpdate.current = setTimeout(async () => {
            try {
                  if (percentage < 99.5 && percentage >=0){
              await LessonProgressService.updateLessonProgress({
                ...enrollment,
                lessonProgresses: [
                  {
                    lessonId: lesson.lessonNumber || "",
                    videoProgress: {
                      watchedDuration: video.currentTime,
                      totalDuration: video.duration,
                      lastWatchedTimestamp: new Date(),
                      watchedPercentage: percentage,
                    },
                    status: percentage >= 99.5 ? "completed" : "in-progress",
                  },
                ],
              });
            }
            } catch (err) {
              console.error("Failed to update lesson progress", err);
            }
          }, 10000);

          if (percentage >= 99.5 && !isCompleted) {
            onComplete();
          }
        }
      };

      const handleLoadedData = () => {
        setLoading(false);
        setDuration(video.duration);
        loadSavedProgress(); // Move this here to ensure video is ready
      };

      const handleError = (e: Event) => {
        console.error("Video error:", e);
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      };

      const handleWaiting = () => setBuffering(true);
      const handleCanPlay = () => setBuffering(false);

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [isCompleted, onComplete, enrollment, lesson]);

  useEffect(() => {
    const setupVideoWithAuth = async () => {
      if (!lesson?.lessonNumber || !authToken) return;

      try {
        const videoUrl = `${URL}/course/video/stream/${courseId}/${lesson.lessonNumber}`;
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
        }
      } catch (err) {
        console.error("Error setting up video with auth:", err);
        setError("Authentication error. Please try logging in again.");
      }
    };

    setupVideoWithAuth();
  }, [courseId, lesson?.lessonNumber, authToken]);

  const secureVideoUrl = lesson?.lessonNumber
    ? `${URL}/course/video/stream/${courseId}/${lesson.lessonNumber}`
    : "";

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  // const togglePlayPause = () => {
  //   if (videoRef.current) {
  //     if (isPlaying) {
  //       videoRef.current.pause();
  //       setIsPlaying(false);
  //     } else {
  //       videoRef.current.play();
  //       setIsPlaying(true);
  //     }
  //   }
  // };

  // const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (videoRef.current && progressBarRef.current) {
  //     const rect = progressBarRef.current.getBoundingClientRect();
  //     const clickPosition = e.clientX - rect.left;
  //     const newTime = (clickPosition / rect.width) * duration;
  //     videoRef.current.currentTime = newTime;
  //   }
  // };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      {/* Header Section */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {lesson?.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {lesson?.description}
        </p>
      </div>

      {/* Video Container */}
      <div className="relative bg-white dark:bg-gray-800 group">
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-black/75">
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
              <p className="mb-4 text-gray-800 dark:text-white">{error}</p>
              <button
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Buffering Overlay */}
        {buffering && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          controls
          poster={lesson?.thumbnail || ""}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
          crossOrigin="anonymous"
        >
          {secureVideoUrl && <source src={secureVideoUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Controls and Information */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {/* Progress Bar */}
        <div className="flex items-center mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ml-4 text-sm text-gray-600 dark:text-gray-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Status and Duration */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mr-2">
              Duration: {lesson?.duration || formatTime(duration)}
            </p>
            {isPlaying ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                Playing
              </span>
            ) : progress > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                Paused
              </span>
            ) : null}
          </div>

          {/* Completion Status */}
          {isCompleted ? (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
              Completed
            </span>
          ) : progress > 0 ? (
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded">
              In Progress ({progress.toFixed(0)}%)
            </span>
          ) : (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded">
              Not Started
            </span>
          )}
        </div>

        {/* Playback Details */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <details className="rounded">
            <summary className="cursor-pointer font-medium py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Playback Information
            </summary>
            <div className="mt-2 pl-4 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <p>Progress: {progress.toFixed(1)}%</p>
              <p>Video quality: Auto</p>
              <p>Playback status: {isPlaying ? "Playing" : "Paused"}</p>
              <p>Buffer status: {buffering ? "Buffering..." : "Ready"}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

// Add this to your CSS or Tailwind
