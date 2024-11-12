interface ActivityItemProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
    title: string;
    time: string | number; // value can be a string or number
    description: string; // trend is a string, but you can adjust the type if needed
  }
const ActivityItem = ({ icon: Icon, title, time, description }: ActivityItemProps) => {
    return (
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800 dark:text-white">{title}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    );
  };
  
export default ActivityItem;
