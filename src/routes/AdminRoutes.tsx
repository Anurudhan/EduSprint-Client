import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import LoadingSpinner from '../components/common/loadingSpinner';
import useDarkMode from '../hooks/userDarkMode';
import { AdminCategories } from '../pages/admin/AdminCategories';

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
// const AdminCourses = lazy(() => import("../pages/admin/AdminCourses"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
// const AdminAssessments = lazy(() => import("../pages/admin/AdminAssessments"));
const AdminTransactions = lazy(() => import("../pages/admin/AdminTransaction"));
const AdminBanners = lazy(() => import("../pages/admin/AdminBanners"));
const Requests = lazy(() => import("../pages/admin/Requestes"));
// const AdminComplaints = lazy(() => import("../pages/admin/AdminComplaints"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));

function AdminRoutes() {
  const { isDarkMode, toggleTheme } = useDarkMode();

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <AdminSidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <Suspense fallback={<LoadingSpinner/>}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              {/* <Route path="courses" element={<AdminCourses />} /> */}
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users/*" element={<ManageUsers />} />
              {/* <Route path="assessments" element={<AdminAssessments />} /> */}
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="requests" element={<Requests />} />
              {/* <Route path="complaints" element={<AdminComplaints />} /> */}
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default AdminRoutes;
