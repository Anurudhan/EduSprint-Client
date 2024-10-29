
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/common/user/Navbar";
import AuthNavbar from "./components/common/auth/AuthNavbar";

import { useSelector } from "react-redux";
import StudentRoutes from "./routes/StudentRoutes ";
import InstructorRoutes from "./routes/InstructorRoutes ";
import AdminRoutes from "./routes/AdminRoutes ";
import { useAppDispatch } from "./hooks/hooks";
import { useEffect } from "react";
import { RootState } from "./redux";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import OtpPage from "./pages/auth/Otp";
import { getUserData, logoutAction } from "./redux/store/actions/auth";
import { RoleBasedRedirect } from "./routes/RoleBasedRedirect";
import Home from "./pages/auth/Home";
import RegistrationForm from "./pages/auth/Registrationform";
import UserSidebar from "./components/common/user/UserSidebar";
import TeachUs from "./pages/auth/TeachUs";


function App() {
  const location = useLocation();
  const isAuthenticated = ['/login', '/signup', '/student/form', '/instructor/form'].some(path => location.pathname.includes(path));

  const {data} = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

	useEffect(() => {
		if (!data) {
      dispatch(getUserData())
		} else if (data.isBlocked) {
      dispatch(logoutAction())
		}
	}, [dispatch, data]);
  const userRole = data?.role; 
  const isOtpVerified = data?.isOtpVerified
  console.log(userRole,isOtpVerified);
  
  return (
    <div className="App dark:from-black dark:to-gray-800 bg-gradient-to-r h-full w-screen">
       {!data?.isVerified ? (
        isAuthenticated ? <AuthNavbar /> : <Navbar />
      ) : <UserSidebar  />}
      <Routes>
				{/* Role-based redirection */}
				<Route
					path="/"
					element={
						<RoleBasedRedirect
							roles={{
								admin: "/admin",
								student: "/student",
								instructor: "/instructor",
							}}
						/>
					}
				/>
        <Route path="/home" element=<Home /> />
        <Route path="/login" element={<Login />} />
        <Route path="/teach-us" element={<TeachUs/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-page" element ={<OtpPage/>}/>
        <Route path="/student/form" element={<RegistrationForm/>} />
        <Route path="/instructor/form" element={<RegistrationForm/>} />
        
        {userRole === "student" && isOtpVerified && (
          <Route path="/student/*" element={<StudentRoutes />} />
        )}
        {userRole === "instructor" && isOtpVerified && (
          <Route path="/instructor/*" element={<InstructorRoutes />} />
        )}
        {userRole === "admin" && isOtpVerified && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
