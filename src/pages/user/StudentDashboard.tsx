
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  BookMarked,
  Star
} from 'lucide-react';
import StatCard from '../../components/user/StatCard';
import ActivityItem from '../../components/user/ActivityItem';
import ProgressItem from '../../components/user/ProgressItem';
import EventItem from '../../components/user/EventItem';

const StudentDashboard = () => {
  const learningStreak = 15; // Days
  const totalCourses = 6;
  const completedCourses = 4;
  const upcomingAssessments = 3;
  const averageScore = 92;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Learning Streak</h2>
            <p className="text-3xl font-bold">{learningStreak} Days</p>
            <p className="text-sm opacity-90 mt-1">Keep going! You're doing great!</p>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-8 rounded-full ${
                  index < 5 ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={totalCourses}
          trend="+2 this month"
        />
        <StatCard
          icon={GraduationCap}
          label="Completed"
          value={completedCourses}
          trend="67% completion"
        />
        <StatCard
          icon={Trophy}
          label="Assessments Due"
          value={upcomingAssessments}
          trend="Next due in 2 days"
        />
        <StatCard
          icon={Star}
          label="Average Score"
          value={`${averageScore}%`}
          trend="Top 10% of students"
        />
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              icon={BookMarked}
              title="Completed JavaScript Basics"
              time="2 hours ago"
              description="Finished Module 3: Functions & Objects"
            />
            <ActivityItem
              icon={Trophy}
              title="Earned a Certificate"
              time="Yesterday"
              description="Web Development Fundamentals"
            />
            <ActivityItem
              icon={Clock}
              title="Study Session"
              time="2 days ago"
              description="Spent 2.5 hours on React Hooks"
            />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <EventItem
              date="Mar 25"
              title="JavaScript Assessment"
              time="10:00 AM"
              type="assessment"
            />
            <EventItem
              date="Mar 26"
              title="React Group Study"
              time="2:00 PM"
              type="study"
            />
            <EventItem
              date="Mar 28"
              title="Python Workshop"
              time="11:00 AM"
              type="workshop"
            />
          </div>
        </section>
      </div>

      {/* Progress Overview */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Course Progress</h2>
        <div className="space-y-4">
          <ProgressItem
            title="Advanced JavaScript"
            progress={75}
            chapters="18/24"
          />
          <ProgressItem
            title="React Fundamentals"
            progress={45}
            chapters="9/20"
          />
          <ProgressItem
            title="Python Basics"
            progress={90}
            chapters="27/30"
          />
        </div>
      </section>
    </div>
  );
};






export default StudentDashboard;