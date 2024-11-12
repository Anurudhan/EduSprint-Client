interface ProgressItemProps {
    title: string;
    progress: string | number; // value can be a string or number
    chapters: string|number; // trend is a string, but you can adjust the type if needed
  }
const ProgressItem = ({ title, progress, chapters }: ProgressItemProps) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-800 dark:text-white">{title}</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">{chapters}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  
export default ProgressItem;
