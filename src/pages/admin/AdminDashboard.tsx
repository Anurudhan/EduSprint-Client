import { useEffect, useMemo, useState } from "react";
import DashboardStats from "../../components/admin/DashboardStats";
import { ChartCard } from "../../components/common/ChartCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Users } from "lucide-react";
import LoadingSpinner from "../../components/common/loadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { SignupFormData } from "../../types";
import { CourseEntity } from "../../types/ICourse";
import axios from "axios";
import { config } from "../../common/config";
import { BASE_URL } from "../../utilities/axios/instance";
import { Category } from "../../types/ICategory";
import { PaymentEntity } from "../../types/IPayment";

function calculateRecentActivity(lastLoginDate:Date) {
  const lastLogin = new Date(lastLoginDate); 
  const now = new Date();
  const diffInMs = now.getTime() - lastLogin.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  return diffInHours >= 0 ? diffInHours : 0;
}



const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const processStudentData = (students: SignupFormData[], range: 'day' | 'month' | 'year') => {
  // Get current date
  const studentsByDate = new Map();

  // Process each student's registration date
  students.forEach(student => {
    // Handle potential undefined createdAt by providing a default date
    const regDate = new Date(student?.createdAt || new Date());

    let key = '';
    if (range === 'day') {
      // For daily view, use hours
      const hours = regDate.getHours();
      key = `${hours}:00`;
    } else if (range === 'month') {
      // For monthly view, use days
      const day = regDate.getDate();
      key = `Day ${day}`;
    } else {
      // For yearly view, use months
      const month = regDate.getMonth();
      key = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
    }

    studentsByDate.set(key, (studentsByDate.get(key) || 0) + 1);
  });

  // Create data array based on the range
  let data = [];
  if (range === 'day') {
    // 24 hours
    data = Array.from({ length: 24 }, (_, i) => ({
      label: `${i}:00`,
      students: studentsByDate.get(`${i}:00`) || 0
    }));
  } else if (range === 'month') {
    // 30 days
    data = Array.from({ length: 30 }, (_, i) => ({
      label: `Day ${i + 1}`,
      students: studentsByDate.get(`Day ${i + 1}`) || 0
    }));
  } else {
    // 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    data = months.map(month => ({
      label: month,
      students: studentsByDate.get(month) || 0
    }));
  }

  // Calculate cumulative totals
  let cumulative = 0;
  return data.map(item => ({
    ...item,
    students: (cumulative += item.students)
  }));
};
const processPaymentData = (payments:PaymentEntity[], range: 'day' | 'month' | 'year') => {
  const now = new Date();
  const paymentsByDate = new Map();
  
  // Filter payments based on time range
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.createdAt || new Date());
    const timeDiff = now.getTime() - paymentDate.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (range === 'day') {
      return daysDiff <= 1; // Last 24 hours
    } else if (range === 'month') {
      return daysDiff <= 30; // Last 30 days
    } else {
      return daysDiff <= 365; // Last year
    }
  });

  // Group payments by time period
  filteredPayments.forEach(payment => {
    const paymentDate = new Date(payment.createdAt || new Date());
    let key = '';

    if (range === 'day') {
      const hours = paymentDate.getHours();
      key = `${hours}:00`;
    } else if (range === 'month') {
      const day = paymentDate.getDate();
      key = `Day ${day}`;
    } else {
      const month = paymentDate.getMonth();
      key = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
    }

    const currentAmount = paymentsByDate.get(key) || 0;
    paymentsByDate.set(key, currentAmount + (payment.amount || 0));
  });

  // Create data array based on the range
  let data = [];
  if (range === 'day') {
    data = Array.from({ length: 24 }, (_, i) => ({
      label: `${i}:00`,
      revenue: paymentsByDate.get(`${i}:00`) || 0
    }));
  } else if (range === 'month') {
    data = Array.from({ length: 30 }, (_, i) => ({
      label: `Day ${i + 1}`,
      revenue: paymentsByDate.get(`Day ${i + 1}`) || 0
    }));
  } else {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    data = months.map(month => ({
      label: month,
      revenue: paymentsByDate.get(month) || 0
    }));
  }

  // Calculate cumulative totals if needed
  let cumulative = 0;
  return data.map(item => ({
    ...item,
    revenue: (cumulative += item.revenue)
  }));
};

const AdminDashboard = () => {
  const [students, setStudents] = useState<SignupFormData[]>([]);
  const [instructors, setInstructors] = useState<SignupFormData[]>([]);
  const [courses, setCourses] = useState<CourseEntity[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [payments,setPayments]  = useState<PaymentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentRange, setStudentRange] = useState<'day' | 'month' | 'year'>('month');
  const [revenueRange, setRevenueRange] = useState<'day' | 'month' | 'year'>('month');
  
  const studentData = useMemo(() => 
    processStudentData(students, studentRange),
    [students, studentRange]
  );
  const revenueData = useMemo(() => 
    processPaymentData(payments, revenueRange),
    [payments, revenueRange]
  );
 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [studentsResponse, instructorsResponse, coursesResponse,categoryResponse,paymentResponse]= await Promise.all([
          axios.get(`${BASE_URL}/user/get-all-students`,config),
          axios.get(`${BASE_URL}/user/get-all-instructors`,config),
          axios.get(`${BASE_URL}/course/allcourse`,config),
          axios.get(`${BASE_URL}/course/getallcategory`,config),
          axios.get(`${BASE_URL}/payment`,config)
        ]);
        if (instructorsResponse.data.data.length > 0) {
          const verifiedInstructors = instructorsResponse.data.data.filter(
              (data: SignupFormData) => data.isVerified
          );
          setInstructors(verifiedInstructors);
        }
        if (studentsResponse.data.data.length > 0) {
          const verifiedStudents = studentsResponse.data.data.filter(
              (data: SignupFormData) => data.isVerified
          );
          setStudents(verifiedStudents);
        }
        if (coursesResponse.data.data.courses.length > 0) {
          const verifiedCourses= coursesResponse.data.data.courses.filter(
              (data: CourseEntity) => !data.isBlocked
          );
          setCourses(verifiedCourses);
        }
        setCategory(categoryResponse.data.data.categories);
        setPayments(paymentResponse.data.data)
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only depend on dispatch

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} type='error' />;

  console.log(category,"this is our category")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
      <h2 className="text-2xl dark:text-white">Overview</h2>
      <DashboardStats students={students} instructors={instructors} courses={courses} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Student Growth"
          subtitle="Track student enrollment over time"
          range={studentRange}
          setRange={setStudentRange}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentData}>
                <defs>
                  <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#4F46E5"
                  fill="url(#studentGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard
          title="Revenue Overview"
          subtitle="Financial performance metrics"
          range={revenueRange}
          setRange={setRevenueRange}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Course Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={category}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                >
                  {category.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {instructors.map((instructor, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Instructor Registration</p>
                  <p className="text-sm text-gray-500">{instructor.firstName} {instructor.lastName} as an instructor</p>
                </div>
                <span className="text-sm text-gray-500">
  {instructor.lastLoginDate
    ? `${calculateRecentActivity(instructor.lastLoginDate)} hrs ago`
    : '1 hrs ago'}
</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;