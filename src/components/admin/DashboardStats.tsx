import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { getAllInstructors } from '../../redux/store/actions/user';
import { SignupFormData } from '../../types';

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // type for the icon component
  title: string;
  value: string | number; // value can be a string or number
  change: number; // trend is a string, but you can adjust the type if needed
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

const DashboardStats = () => {
  const dispatch = useAppDispatch();
  const [instructors,setInstructors] = useState([])
 const fetchInstructors = useCallback(async () => {
 
         try {
             const resultAction = await dispatch(getAllInstructors({}));
             console.log(resultAction.payload.data);
 
             if (getAllInstructors.fulfilled.match(resultAction)) {
                 const studentsData = resultAction.payload.data;
                     const verifiedStudents = studentsData.filter(
                         (data: SignupFormData) => data.isVerified
                     );
                     setInstructors(verifiedStudents);
             } else {
                 throw new Error("Failed to fetch students");
             }
         } catch (err) {
             console.error("Error fetching students:", err);
         } 
     }, [dispatch]);
     useEffect(() => {
             fetchInstructors();
         }, [fetchInstructors]);
  const stats = [
    { icon: Users, title: 'Total Students', value: '', change: 0 },
    { icon: GraduationCap, title: 'Total Instructors', value: instructors.length, change: 0 },
    { icon: BookOpen, title: 'Active Courses', value: '', change: 0 },
    { icon: DollarSign, title: 'Revenue', value: '', change: 0 },
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
