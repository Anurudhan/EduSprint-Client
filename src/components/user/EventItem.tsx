import { Calendar } from "lucide-react";

interface EventItemProps {
    type: string;// type for the icon component
    title: string;
    date: string | number; // value can be a string or number
    time: string | number; // trend is a string, but you can adjust the type if needed
  }
const EventItem = ({ date, title, time, type }: EventItemProps) => {
    return (
      <div className="flex items-center gap-4">
        <div className="text-center">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
          <p className="text-sm font-medium text-gray-800 dark:text-white mt-1">{date}</p>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 dark:text-white">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          type === 'assessment' 
            ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : type === 'study'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        }`}>
          {type}
        </span>
      </div>
    );
  };

  
export default EventItem;
