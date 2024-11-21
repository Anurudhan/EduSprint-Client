import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faLock,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import facebook from "../../assets/facebook.png";
import { Role, Response} from "../../types/IForm";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { signupValidationSchema } from "../../utilities/validation/signuSchema";
import { useAppDispatch } from "../../hooks/hooks";
import { signupAction } from "../../redux/store/actions/auth/signupAction";
import { GoogleLogin,CredentialResponse } from "@react-oauth/google";
import { googleAuthAction } from "../../redux/store/actions/auth/googleAuthAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Player } from "@lottiefiles/react-lottie-player";
import LoadingSpinner from "../../components/common/loadingSpinner";



const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const userTypeParam = searchParams.get("role");
  const userType = (Object.values(Role) as string[]).includes(userTypeParam || '')
    ? (userTypeParam as Role)
    : Role.Student;
  const [heading, setHeading] = useState("Student Sign Up");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false); 
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    
    if (userType === Role.Instructor) {
      setHeading("Instructor Sign Up");
    } else if (userType === Role.Admin) {
      setHeading("Admin Sign Up");
    } else if (userType === Role.Student) {
      setHeading("Student Sign Up");
    } else {
      setShouldRedirect(true);
    }
  }, [userType]);

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true)
        const data = values;
        const signupResult = await dispatch(signupAction({ ...data, "role": userType }));
        const payload = signupResult.payload as Response;
        
        if (!payload?.success) {
          setIsLoading(false)
          if (payload?.message === "email") {
            formik.setErrors({ email: "Email is already taken" });
            toast.error("Email is already taken");
          } else if (payload?.message === "Username") {
            formik.setErrors({ userName: "Username is already taken" });
            toast.error("Username is already taken");
          }
        } else {
         
          if (payload?.data?.email && payload?.data?.role && payload?.data?.password &&
             payload?.data?.userName ) {
            localStorage.setItem("userEmail", payload.data.email);
            localStorage.setItem("userRole", payload.data.role);
            localStorage.setItem("userPassword",payload.data.password);
            localStorage.setItem("userName",payload.data.userName);
          }
          setIsLoading(false)
          localStorage.removeItem('otpStartTime');
          navigate("/otp-page",{replace:true});
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("Something went wrong, please try again");
      }
    },
  });

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("Google login successful, response: ", credentialResponse);
    try {
      const response = await dispatch(googleAuthAction({ credentials: credentialResponse, userType }));
      console.log(response , "this is our response")
      if (response.payload.success ) {
        if(!response.payload.data?.isRequested){
          navigate(`/${response.payload.data?.role}-form`,{replace:true});
        }
        navigate(`/${userType.toLowerCase()}`,{replace:true});
      } else if(!response.payload.success) {
        toast.error(response.payload.message);
      }
    } catch (error: unknown) {
      toast.error("Google login is failed")
      console.log("Login Failed", error);
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google login error");
    console.error("Google login error");
   };
  if (shouldRedirect) {
    return <Navigate to="/" />;
  }
  if(userType === "admin"){
    return <Navigate to="/" />;
  }

  return (
    <>
    {isLoading && <LoadingSpinner />}
    <div className="pt-16 flex h-screen justify-center items-center dark:bg-gradient-to-br dark:from-black dark:to-gray-800 bg-gradient-to-r from-white to-gray-200">
  <div className="hidden lg:flex flex-1 justify-center items-center pr-8">
    <Player
      src="https://lottie.host/17b100ce-9820-451a-9836-35639c1ebab2/aRVF3OAeMj.json"
      background="transparent"
      speed={1}
      loop
      autoplay
      className="w-3/4 h-auto object-cover rounded-xl" // Increased player size
    />
  </div>
  <div className="flex flex-col justify-center items-center w-full lg:w-5/12 md:w-7/12 p-8 lg:pl-4 lg:mr-10">
    <div className="bg-white dark:bg-gradient-to-bl dark:from-black dark:to-gray-800 shadow-lg rounded-lg p-5 w-full transition duration-300 dark:shadow-[0px_5px_15px_#1a1a1a] shadow-gray-400">
      <h3 className="text-2xl font-semibold text-center mb-4 text-green-600 dark:text-gray-200">
        {heading}
      </h3>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="text"
            placeholder="Name"
            {...formik.getFieldProps("userName")}
            className={`w-full p-2.5 pl-10 border ${
              formik.touched.userName && formik.errors.userName
                ? "border-red-500"
                : "border-gray-300"
            } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
          />
          {formik.touched.userName && formik.errors.userName ? (
            <div className="text-red-500 text-sm">{formik.errors.userName}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            className={`w-full p-2.5 pl-10 border ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Password */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...formik.getFieldProps("password")}
            className={`w-full p-2.5 pl-10 border ${
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
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
            className={`w-full p-2.5 pl-10 border ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
          />
          <FontAwesomeIcon
            icon={showConfirmPassword ? faEye : faEyeSlash}
            className="absolute right-3 top-3 cursor-pointer text-gray-400"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      {/* Social Login */}
      <div className="flex justify-center mt-4 mb-4">
        <span className="text-gray-500 dark:text-gray-300">
          or sign up with
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
          className="flex items-center justify-center cursor-pointer border border-gray-300 ps-8 pe-8 transition duration-200 hover:bg-gray-100"
        >
          <img src={facebook} alt="Facebook" className="w-5 h-5" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Facebook
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <span className="text-gray-500 dark:text-gray-300">
          Already have an account?
        </span>{" "}
        <Link
          to={"/login/?role=" + userType}
          className="text-blue-500 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
    
  </div>
  <ToastContainer />
</div>

</>

  );
};

export default Signup;



