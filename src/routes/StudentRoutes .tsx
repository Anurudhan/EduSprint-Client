import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/common/loadingSpinner';
import useDarkMode from '../hooks/userDarkMode';
import UserSidebar from "../components/user/UserSidebar";
import StudentCourses from "../pages/user/StudentCourses";
import StudentProfile from "../pages/user/StudentProfile";
import StudentAssessments from "../pages/user/StudentAssesments";
import UserCourse from "../pages/auth/UserCourse";
import EnrollmentPage from "../pages/user/EnrollementPage";
import { Invoice } from "../utilities/Invoice/Invoice";
import UserChat from "../components/chat/UserChat";


const StudentDashboard = lazy(() => import("../pages/user/StudentDashboard"));
const StudentSettings = lazy(() => import("../pages/user/StudentSettings"));


function StudentRoutes() {
  const { isDarkMode, toggleTheme } = useDarkMode();

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <UserSidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <Suspense fallback={<LoadingSpinner/>}>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="mycourses"  element={<StudentCourses />} />
              <Route path="allcourse"  element={<UserCourse />} />
              <Route path="enrollement"  element={<EnrollmentPage />} />
              <Route path="assessments" element={<StudentAssessments />} />
              <Route path="chat" element={<UserChat />}  />
              <Route path="invoice" element={<Invoice />}  />
              <Route path="profile" element={<StudentProfile />}  />
              <Route path="settings" element={<StudentSettings />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default StudentRoutes;
