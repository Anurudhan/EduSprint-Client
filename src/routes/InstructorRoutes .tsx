import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "../components/common/loadingSpinner";
import StudentProfile from "../pages/user/StudentProfile";
import InstructorSidebar from "../components/Instructor/InstructorSidebar";
import useDarkMode from "../hooks/userDarkMode";
import InstructorDashboard from "../pages/Instructor/InstructorDashboard";
import { Courses } from "../pages/Instructor/course/Courses";
import CreateCourse from "../pages/Instructor/course/CreateCourse";
import EditCourse from "../pages/Instructor/course/EditCourse";
import CreateAssessment from "../pages/Instructor/assessment/CreateAssessment";

const InstructorRoutes = () => {
  const { isDarkMode, toggleTheme } = useDarkMode();
  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
    <InstructorSidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8">
        <Suspense fallback={<LoadingSpinner/>}>
          <Routes>
            <Route path="/" element={<InstructorDashboard />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="profile" element={<StudentProfile />}  />
            <Route path="mycourses"  element={<Courses />} />
            <Route path="mycourse-details" element = {<CreateAssessment />} />
            <Route path="assessment"  element={<Courses />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="edit-course" element={<EditCourse />} />
            {/* <Route path="mycourses"  element={<StudentCourses />} />
            <Route path="assessments" element={<StudentAssessments />} />
            <Route path="chat" element={<StudentChat />}  />
            
            <Route path="settings" element={<StudentSettings />} /> */}
          </Routes>
        </Suspense>
      </div>
    </main>
  </div>
  );
};
  
  export default InstructorRoutes;