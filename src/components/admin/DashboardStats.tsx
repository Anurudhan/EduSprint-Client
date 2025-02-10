import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import React from 'react';

import { SignupFormData } from '../../types';
import { CourseEntity } from '../../types/ICourse';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../redux';

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
  title: string;
  value: string | number; // value can be a string or number
  change: number; // trend is a string, but you can adjust the type if needed
}
interface DashboardProps{
  students:SignupFormData[],
  instructors:SignupFormData[],
  courses:CourseEntity[]
}

const StatsCard = ({ icon: Icon, title, value, change }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
        {/* Use width and height instead of size */}
        <Icon className="text-blue-600 dark:text-blue-400" width={24} height={24} />
      </div>
    </div>
    <div className={`mt-4 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
    </div>
  </div>
);
const calculatePercentageChange = (
  data: { date: string | Date }[], // Array of objects with a date field
  currentDate: Date
): number => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthCount = data.filter(item => {
    const date = new Date(item.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const previousMonthCount = data.filter(item => {
    const date = new Date(item.date);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  }).length;

  if (previousMonthCount === 0) {
    return currentMonthCount > 0 ? 100 : 0; // Assume 100% increase if no previous data
  }

  return Math.floor(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100);
};


const DashboardStats:React.FC<DashboardProps> = ({students,instructors,courses}) => {
  const {data} = useAppSelector((state:RootState) => state.user);
  if(!data||!data?.profit) return null
  const profit =parseInt(data?.profit)
  const currentDate = new Date();
  
  const studentChange = calculatePercentageChange(
    students.map(s => ({ date: s.lastLoginDate || new Date() })), // Extract relevant date
    currentDate
  );
  
  const instructorChange = calculatePercentageChange(
    instructors.map(i => ({ date: i.lastLoginDate || new Date() })), // Extract relevant date
    currentDate
  );
  
  const courseChange = calculatePercentageChange(
    courses.map(c => ({ date: c.createdAt || new Date() })), // Replace with the correct date field for courses
    currentDate
  );
  const stats = [
    { icon: Users, title: 'Total Students', value:students.length, change: studentChange },
    { icon: GraduationCap, title: 'Total Instructors', value: instructors.length, change: instructorChange },
    { icon: BookOpen, title: 'Active Courses', value: courses.length, change: courseChange },
    { icon: DollarSign, title: 'Revenue', value:profit , change: 0 },
  ];
 
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
