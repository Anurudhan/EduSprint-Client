import React from 'react';
// import { CheckCircle, Lock, MessageSquare, PlayCircle } from 'lucide-react';
// import { useVideoProgress } from '../../hooks/useVideoProgress';
// import { Lesson } from '../../types/ICourse';

// interface EnhancedVideoPlayerProps {
//   courseId: string;
//   lessonId: string;
//   userId: string;
//   lesson: Lesson;
//   isLocked?: boolean;
//   isCompleted?: boolean;
//   onProgress?: (percentage: number) => void;
//   onCompletion?: () => void;
//   onMessage?: () => void;
// }
// const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps>

const EnhancedVideoPlayer: React.FC= (
  // courseId,
  // lessonId,
  // userId,
  // lesson,
  // isLocked = false,
  // isCompleted: initialIsCompleted = false,
  // onProgress,
  // onCompletion,
  // onMessage
) => {
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  // // const [videoEnded, setVideoEnded] = useState(false);
  
  // // Use the custom hook to manage video progress
  // const { progress, saveProgress } = useVideoProgress({
  //   courseId,
  //   lessonId,
  //   userId
  // });

  // // Update video position when progress loads
  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (video && progress.currentTime > 0) {
  //     video.currentTime = progress.currentTime;
      
  //     // If the video was already completed according to progress data
  //     if (progress.isCompleted && !isCompleted) {
  //       setIsCompleted(true);
  //     }
  //   }
  // }, [progress.currentTime, progress.isCompleted, isCompleted]);

  // // Save progress periodically
  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   // Update progress every 5 seconds
  //   const interval = setInterval(() => {
  //     if (video.paused) return;
      
  //     saveProgress(video.currentTime, video.duration);
      
  //     // Call onProgress prop with percentage
  //     if (onProgress && video.duration > 0) {
  //       const percentage = (video.currentTime / video.duration) * 100;
  //       onProgress(percentage);
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [saveProgress, onProgress]);

  // // Handle video completion
  // const handleVideoEnd = () => {
  //   setVideoEnded(true);
  //   setIsCompleted(true);
    
  //   if (videoRef.current) {
  //     saveProgress(videoRef.current.duration, videoRef.current.duration);
  //   }
    
  //   if (onCompletion) {
  //     onCompletion();
  //   }
  // };

  // // Handle when user leaves page (save last position)
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (videoRef.current) {
  //       saveProgress(videoRef.current.currentTime, videoRef.current.duration);
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     // Save progress when component unmounts
  //     if (videoRef.current) {
  //       saveProgress(videoRef.current.currentTime, videoRef.current.duration);
  //     }
  //   };
  // }, [saveProgress]);

  // // Locked content view
  // if (isLocked) {
  //   return (
  //     <div className="bg-gray-100 rounded-lg p-8 text-center">
  //       <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
  //       <p className="text-gray-600">Complete the previous lesson to unlock this content</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-4">
      <h1>Hliksolkjolkhjalk hkasd</h1>
      {/* <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {lesson.video ? (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            onEnded={handleVideoEnd}
            src={lesson.video}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <PlayCircle className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          {lesson.title}
        </h3>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Learning Objectives:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {lesson.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
        
        {onMessage && (
          <div className="mt-4">
            <button
              onClick={onMessage}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">Message Instructor</span>
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default EnhancedVideoPlayer;