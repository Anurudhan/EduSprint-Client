import { Routes, Route, NavLink} from 'react-router-dom';
import { Users, GraduationCap } from 'lucide-react';
import AdminStudents from '../../components/admin/AdminStudents';
import AdminInstructors from '../../components/admin/AdminInstructors';




const ManageUsers = () => {
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Manage Users</h1>
      </div>

      <div className="flex space-x-4 mb-6">
        <NavLink
          to="/admin/users/students"
          className={({ isActive }) => `
            flex items-center px-4 py-2 rounded-lg
            ${isActive 
              ? 'bg-blue-500 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
          `}
        >
          <Users className="mr-2" size={20} />
          Students
        </NavLink>
        <NavLink
          to="/admin/users/instructors"
          className={({ isActive }) => `
            flex items-center px-4 py-2 rounded-lg
            ${isActive 
              ? 'bg-blue-500 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}
          `}
        >
          <GraduationCap className="mr-2" size={20} />
          Instructors
        </NavLink>
      </div>
      <Routes>
        <Route path="/" element={<AdminStudents />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="instructors" element={<AdminInstructors/>} />
      </Routes>
    </div>
  );
};

export default ManageUsers;