import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import facebook from "../../assets/facebook.png";
import { Role, SignupFormData } from "../../types/IForm";
import { loginValidationSchema } from "../../utilities/validation/loginSchema";
import { loginAction } from "../../redux/store/actions/auth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleAuthAction } from "../../redux/store/actions/auth/googleAuthAction";
import { useAppDispatch } from "../../hooks/hooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPasswordModal from "../../components/user/ForgotPasswordModal";
import { forgotPasswordMailAction } from "../../redux/store/actions/auth/forgotPasswordMailAction";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("role") || Role.Student;
  const [heading, setHeading] = useState("Student Login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  useEffect(() => {
    // Handle role-based logic
    if (userType === Role.Instructor) {
      setHeading("Instructor Login");
    } else if (userType === Role.Admin) {
      
      setHeading("Admin Login");
    } else if (userType === Role.Student) {
      setHeading("Student Login");
    } else {
      // Redirect to home page if no valid role is provided
      navigate("/");
    }
  }, [userType, navigate]);

  

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const toggleForgotPasswordModal = () => {
    setIsForgotPasswordOpen(!isForgotPasswordOpen);
  };

    const handleForgotPasswordSubmit = async (email: string) => {
      try {
        const result = await dispatch(forgotPasswordMailAction(email));
        if(result) toast.success("Password reset link sent to your email.");
        else toast.error("Password reset link not generate.");
      } catch (error) {
          console.log(error);
          
        toast.error("Failed to send password reset link. Try again.");
      }
    };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const data = { ...values, role: userType as Role };
        const loginResult = await dispatch(loginAction(data));

        if (!loginResult.payload?.success) {
          // Display error message from the server
          toast.error(
            loginResult.payload?.message ?? "Login failed. Please try again."
          );
        } else {
          // Check if user is verified
          if (loginResult.payload.data.isVerified) {
            // Navigate to the appropriate route based on user type
            navigate(`/${loginResult.payload.data?.role}`,{replace:true});
          } else {
            const allData: SignupFormData = {
              ...data,
              isGAuth: false,
            };
            navigate(`/${loginResult.payload.data?.role}-form`, { state: allData ,replace:true});
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    },
  });
  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await dispatch(googleAuthAction({ credentials: credentialResponse, userType }));
      if (response.payload.success ) {
        if(!response.payload.data?.isRequested){
          navigate(`/${response.payload.data?.role}-form`,{replace:true});
        }
        navigate(`/${response.payload.data?.role}`,{replace:true});
      } else {
        toast.error(response.payload.message ?? "Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google login failed");
    console.error("Google login error");
  };

  return (
    <div
  className={`pt-16 flex h-screen justify-center items-center dark:bg-gradient-to-br dark:from-black dark:to-gray-800 bg-gradient-to-r from-white to-gray-200`}
>
  <div className="hidden lg:flex flex-1 justify-center items-center pr-8">
    <Player
      src="https://lottie.host/28460a5e-8051-4ccb-8ec9-d433a8232415/7IdKspHYqv.json"
      background="transparent"
      speed={1}
      loop
      autoplay
      className="w-3/4 h-auto object-cover rounded-xl"
    />
  </div>
  <div className="flex flex-col justify-center items-center w-full lg:w-1/3 md:w-1/2 p-8 lg:pl-4 lg:mr-10 ">
    <div
      className={`bg-white dark:bg-gradient-to-bl dark:from-black dark:to-gray-800 shadow-lg rounded-lg p-5 w-full transition duration-300 dark:shadow-[0px_5px_15px_#1a1a1a] shadow-gray-400`}
    >
      <h3 className="text-2xl font-semibold text-center mb-4 text-green-600 dark:text-gray-200">
        {heading}
      </h3>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            className={`w-full p-3 pl-10 border  ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...formik.getFieldProps("password")}
            className={`w-full p-3 pl-10 border ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-sm">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        <div className="text-right">
          <a
            href="#"
            onClick={toggleForgotPasswordModal}
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {/* Social Login */}
      <div className="flex justify-center mt-4 mb-4">
        <span className="text-gray-500 dark:text-gray-300">
          or sign in with
        </span>
      </div>

      <div className="flex justify-around mb-4 space-x-2">
        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />

        {/* Facebook Login Button */}
        <div
          onClick={() => {
            toast.info("Facebook login coming soon!");
          }}
          className="flex items-center justify-center  cursor-pointer border border-gray-300 ps-8 pe-8  transition duration-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <img src={facebook} alt="Facebook" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Facebook
          </span>
        </div>
      </div>

      {/* Sign Up Link */}
      {userType!=="admin"&&
      <div className="text-center">
        <span className="text-gray-500 dark:text-gray-300">
          Don't have an account?{" "}
        </span>
        <Link
          to={`/signup/?role=${userType}`}
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Sign Up
        </Link>
      </div>}
    </div>
  </div>
  <ForgotPasswordModal
    isOpen={isForgotPasswordOpen}
    onClose={toggleForgotPasswordModal}
    onSubmit={handleForgotPasswordSubmit}
  />
  <ToastContainer />
</div>
  );
};

export default Login;
