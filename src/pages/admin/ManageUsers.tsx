import { Routes, Route, NavLink, useLocation, Navigate } from "react-router-dom";
import { Users, GraduationCap } from "lucide-react";
import { lazy, Suspense, memo } from "react";
import LoadingSpinner from "../../components/common/loadingSpinner";

// Lazy load the components to improve performance
const AdminStudents = lazy(() => import("../../components/admin/AdminStudents"));
const AdminInstructors = lazy(() => import("../../components/admin/AdminInstructors"));

const ManageUsers = () => {
    const location = useLocation();
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Manage Users</h1>
            </div>
            <div className="flex space-x-4 mb-6">
                <NavLink
                    to="/admin/users/students"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg ${
                            isActive || location.pathname === "/admin/users/"
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`
                    }
                >
                    <Users className="mr-2" size={20} />
                    Students
                </NavLink>
                <NavLink
                    to="/admin/users/instructors"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg ${
                            isActive
                                ? "bg-blue-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`
                    }
                >
                    <GraduationCap className="mr-2" size={20} />
                    Instructors
                </NavLink>
            </div>
            
            <Suspense fallback={<div className="flex justify-center"><LoadingSpinner /></div>}>
                <Routes>
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="instructors" element={<AdminInstructors />} />
                    <Route path="/" element={<Navigate to="students" replace />} />
                </Routes>
            </Suspense>
        </div>
    );
};

export default memo(ManageUsers);