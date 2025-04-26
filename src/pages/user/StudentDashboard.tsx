import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  BookMarked,
  Star,
  Calendar,
  CheckCircle,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';
import LoadingSpinner from '../../components/common/loadingSpinner';
import { ToastService } from '../../components/common/Toast/ToastifyV1';
import { getEnrollmentByUserIdAction } from '../../redux/store/actions/enrollment';
import { EnrollmentEntity, CompleationStatus } from '../../types';

// StatCard Component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  bgColor = "bg-white dark:bg-gray-800" 
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg flex items-center space-x-4 transition-all hover:shadow-xl hover:scale-105`}>
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{trend}</p>
        )}
      </div>
    </div>
  );
};

// Activity Item Component
interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  time: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, title, time, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all">
      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
      </div>
    </div>
  );
};

// Types for dashboard data
interface RecentActivity {
  icon: typeof BookMarked | typeof Trophy | typeof Clock;
  title: string;
  time: string;
  description: string;
}

const StudentDashboard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [completedCourses, setCompletedCourses] = useState<number>(0);
  const [inProgressCourses, setInProgressCourses] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topPerformingCourse, setTopPerformingCourse] = useState<string>("");
  const [totalCompletedLessons, setTotalCompletedLessons] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useAppSelector((state: RootState) => state.user.data);
  const dispatch = useAppDispatch();

  const calculateAverageScore = (enrollments: EnrollmentEntity[]): number => {
    const coursesWithScores = enrollments.filter(enrollment => 
      enrollment.progress?.totalScore !== undefined && 
      enrollment.completionStatus === CompleationStatus.Completed
    );
    
    if (coursesWithScores.length === 0) return 0;
    
    const totalScore = coursesWithScores.reduce(
      (sum, enrollment) => sum + (enrollment.progress?.totalScore || 0), 
      0
    );
    
    return Math.round(totalScore / coursesWithScores.length);
  };

  const findTopPerformingCourse = (enrollments: EnrollmentEntity[]): string => {
    let highestScore = 0;
    let courseName = "";
    
    enrollments.forEach(enrollment => {
      if (enrollment.progress?.totalScore && enrollment.progress.totalScore > highestScore) {
        highestScore = enrollment.progress.totalScore;
        courseName = enrollment.course?.title || "Untitled Course";
      }
    });
    
    return courseName || "No courses completed yet";
  };

  const countTotalCompletedLessons = (enrollments: EnrollmentEntity[]): number => {
    return enrollments.reduce((total, enrollment) => 
      total + (enrollment.progress?.completedLessons?.length || 0), 0);
  };

  const generateRecentActivities = (enrollments: EnrollmentEntity[]): RecentActivity[] => {
    const activities: RecentActivity[] = [];
    
    const sortedEnrollments = [...enrollments].sort((a, b) => {
      const dateA = new Date(a.enrolledAt || '').getTime();
      const dateB = new Date(b.enrolledAt || '').getTime();
      return dateB - dateA;
    }).slice(0, 4);
    
    sortedEnrollments.forEach(enrollment => {
      if (enrollment.completionStatus === CompleationStatus.Completed) {
        activities.push({
          icon: Trophy,
          title: `Completed ${enrollment.course?.title || 'Course'}`,
          time: new Date(enrollment.enrolledAt || '04/22/2025').toLocaleDateString(),
          description: `Achieved ${enrollment.progress?.totalScore || 100}% score`
        });
      } else if (enrollment.completionStatus === CompleationStatus.inProgress) {
        activities.push({
          icon: Clock,
          title: `Progress in ${enrollment.course?.title || 'Course'}`,
          time: new Date(enrollment.enrolledAt || '').toLocaleDateString(),
          description: `Completed ${enrollment.progress?.completedLessons?.length || 0} lessons`
        });
      } else {
        activities.push({
          icon: BookMarked,
          title: `Started ${enrollment.course?.title || 'Course'}`,
          time: new Date(enrollment.enrolledAt || '04/26/2025').toLocaleDateString(),
          description: `Instructor: ${enrollment.instructor?.userName || 'Unknown'} ${enrollment.instructor?.lastName || ''}`
        });
      }
    });
    
    return activities;
  };

  const fetchEnrollments = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    
    try {
      const response = await dispatch(getEnrollmentByUserIdAction({
        userId: user._id,
        page: 1,
        limit: 1000,
        search: ""
      }));

      if (response.payload.success) {
        const enrollmentsData = response.payload.data;
        setTotalCourses(enrollmentsData.length);
        
        const completed = enrollmentsData.filter(
          (e: EnrollmentEntity) => e.completionStatus === CompleationStatus.Completed
        ).length;
        setCompletedCourses(completed);
        
        const inProgress = enrollmentsData.filter(
          (e: EnrollmentEntity) => e.completionStatus === CompleationStatus.inProgress
        ).length;
        setInProgressCourses(inProgress);
        
        const avgScore = calculateAverageScore(enrollmentsData);
        setAverageScore(avgScore);
        
        const topCourse = findTopPerformingCourse(enrollmentsData);
        setTopPerformingCourse(topCourse);
        
        const totalLessons = countTotalCompletedLessons(enrollmentsData);
        setTotalCompletedLessons(totalLessons);
        
        const activities = generateRecentActivities(enrollmentsData);
        setRecentActivities(activities);
      } else {
        ToastService.error(response.payload.message || "Failed to fetch enrollments");
      }
    } catch (error) {
      ToastService.error("An error occurred while fetching enrollments");
      console.error("An error occurred while fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, user]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Learning Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Track your achievements and activity
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="w-5 h-5 mr-2" />
            <span>Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={totalCourses}
          trend={`${inProgressCourses} active`}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800"
        />
        <StatCard
          icon={GraduationCap}
          label="Completed Courses"
          value={completedCourses}
          trend={`${totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}% rate`}
          bgColor="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
        />
        <StatCard
          icon={Trophy}
          label="Lessons Completed"
          value={totalCompletedLessons}
          trend="Great progress!"
          bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800"
        />
        <StatCard
          icon={Star}
          label="Average Score"
          value={`${averageScore}%`}
          trend={averageScore > 80 ? "Outstanding!" : "Keep pushing!"}
          bgColor="bg-gradient-to-br from-purple- Performance Stats50 to-purple-100 dark:from-purple-900 dark:to-purple-800"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Sidebar - Activity & Stats */}
        <div className="lg:col-span-3 space-y-8">
          {/* Recent Activity */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <Clock className="w-6 h-6 mr-3 text-blue-600" /> 
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    icon={activity.icon}
                    title={activity.title}
                    time={activity.time}
                    description={activity.description}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No recent activity</p>
                </div>
              )}
            </div>
          </section>

          {/* Stats Card */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" /> 
              Performance Stats
            </h2>
            
            <div className="space-y-4">
              {topPerformingCourse && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-4" />
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">Top Course</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white max-w-xs truncate">
                    {topPerformingCourse}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Completion Rate</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Learning Achievements */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <GraduationCap className="w-6 h-6 mr-3 text-blue-600" /> 
            Achievements
          </h2>
          <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline transition-all">
            View All <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {totalCourses > 0 ? (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 p-6 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all">
                <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-full inline-flex justify-center items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">First Course</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Started your journey</p>
              </div>
              
              {completedCourses > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 p-6 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all">
                  <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full inline-flex justify-center items-center mb-4">
                    <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Master</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">First completion</p>
                </div>
              )}
              
              {totalCompletedLessons >= 10 && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 p-6 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all">
                  <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-full inline-flex justify-center items-center mb-4">
                    <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lesson Pro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">10+ lessons done</p>
                </div>
              )}
              
              {averageScore >= 80 && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50 p-6 rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all">
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-full inline-flex justify-center items-center mb-4">
                    <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Scholar</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">80%+ average</p>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <GraduationCap className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-xl font-medium">Unlock achievements by completing courses</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
                Begin Learning
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;