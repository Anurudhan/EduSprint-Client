import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/common/user/Navbar";
import AuthNavbar from "./components/common/auth/AuthNavbar";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./hooks/hooks";
import {  useEffect, useState } from "react";
import { RootState } from "./redux";
import OtpPage from "./pages/auth/Otp";
import { getUserData, logoutAction } from "./redux/store/actions/auth";
import Home from "./pages/auth/Home";
import RegistrationForm from "./pages/auth/Registrationform";
import ForgotPassword from "./pages/auth/forgotPassword";
import { RoleBasedRedirect } from "./routes";
import AuthCheck from "./routes/AuthCheck";
import PublicRoutes from "./routes/PublicRoutes";
import UserAuthCheck from "./routes/UserAuthCheck";
import StudentRoutes from "./routes/StudentRoutes ";
import InstructorRoutes from "./routes/InstructorRoutes ";
import AdminAuthCheck from "./routes/AdminAuthCheck";
import AdminRoutes from "./routes/AdminRoutes";
import LoadingSpinner from "./components/common/loadingSpinner";
import { MessageType } from "./types/IMessageType";
import MessageToast from "./components/common/MessageToast";
import UserCourse from "./pages/auth/UserCourse";
import { PaymentSuccess } from "./components/payment/PaymentSuccess";
import { PaymentFailed } from "./components/payment/PaymentFailed";

function App() {
  const location = useLocation();
  const isAuthenticated = [
    "/login",
    "/signup",
    "/student-form",
    "/instructor-form",
    "/forgot-password",
  ].some((path) => location.pathname.includes(path));
  const isUser =["/home","/course"].some((path) => location.pathname.includes(path));
  const [loading,setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("error");

  const { data } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const handleMessage = async (Message: string): Promise<void> => {
    setMessage(Message);
  };

  useEffect(() => {
    
    if (!data) {
      setLoading(true)
      dispatch(getUserData());
      setLoading(false)
    } else if (data.isBlocked) {
        dispatch(logoutAction());
        setMessage("Edusprint team blocked your account! Please contact us")
        setType("warning")
    } 
  }, [dispatch, data]);
  // const userRole = data?.role;
  // const isOtpVerified = data?.isOtpVerified;
  // console.log(userRole, isOtpVerified,"Otp is verified ----------------->");

  return (
    <div className="App dark:from-black dark:to-gray-800 bg-gradient-to-r h-full w-screen">
      {!data?.isVerified ? isAuthenticated ? <AuthNavbar /> : <Navbar /> :isUser?<Navbar />: null}
      {loading ? (
      <LoadingSpinner />
    ) : (
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
        <Route path="/home" element={<Home />} />
        <Route path="/instructor-form" element={<RegistrationForm />} />
        <Route path="/*" element={<AuthCheck userData={data}><PublicRoutes/></AuthCheck>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-form" element={<RegistrationForm />} />
        <Route path="/payment-success" element={<PaymentSuccess/>} />
        <Route path="/payment-failed" element={<PaymentFailed/>} />
        <Route path="/courses" element={<UserCourse/>} />
        <Route path="/otp-page" element={data?.isOtpVerified ? <Navigate to="/home" replace /> : <OtpPage />} />
        <Route path="/student/*" element={<UserAuthCheck userData={data}><StudentRoutes/></UserAuthCheck>} />
        <Route path="/instructor/*" element={<UserAuthCheck userData={data}><InstructorRoutes/></UserAuthCheck>} />
        <Route path="/admin/*" element={<AdminAuthCheck userData={data}><AdminRoutes/></AdminAuthCheck>} />
      </Routes>
    )}
    {message && (
      <MessageToast
        message={message}
        type={type}
        onMessage={(Message) => handleMessage(Message)}
      />
    )}
    </div>
  );
}

export default App;
