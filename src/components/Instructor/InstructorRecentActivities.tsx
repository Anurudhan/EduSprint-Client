
import { Clock, User, BookOpen, Video } from 'lucide-react';

const InstructorRecentActivities = () => {
  const activities = [
    {
      type: 'student-enrollment',
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      content: 'New student enrolled in "Advanced React Patterns"',
      time: '2 minutes ago',
    },
    {
      type: 'course-update',
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      content: 'Updated content in "Node.js Masterclass" course',
      time: '1 hour ago',
    },
    {
      type: 'live-session',
      icon: Video,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      content: 'Completed live session on "Database Design"',
      time: '3 hours ago',
    },
    {
      type: 'course-review',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      content: 'Received 5-star review on "Python for Beginners"',
      time: '5 hours ago',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Recent Activities
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className={`${activity.bgColor} p-2 rounded-full`}>
                <Icon className={`${activity.color} h-5 w-5`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {activity.content}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorRecentActivities;