
import { BarChart2, Users, BookOpen, DollarSign } from 'lucide-react';

const InstructorDashboardStats = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Courses',
      value: '12',
      change: '+3',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Earnings',
      value: '$8,459',
      change: '+23%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Course Completion',
      value: '87%',
      change: '+5%',
      icon: BarChart2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
                  {stat.value}
                </h3>
                <span className="text-sm text-green-500">
                  {stat.change} this month
                </span>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <Icon className={`${stat.color} h-6 w-6`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InstructorDashboardStats;