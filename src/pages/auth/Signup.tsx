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
import frame from "../../assets/e-learning-graphic-with-student.png";
import { Role, Response, SignupFormData } from "../../types/IForm";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { signupValidationSchema } from "../../utilities/validation/signuSchema";
import { useAppDispatch } from "../../hooks/hooks";
import { signupAction } from "../../redux/store/actions/auth/signupAction";
import { GoogleLogin,CredentialResponse } from "@react-oauth/google";
import { googleAuthAction } from "../../redux/store/actions/auth/googleAuthAction";
import { storeUserData } from "../../redux/store/slices/user";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
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
        const data = values;
        const signupResult = await dispatch(signupAction({ ...data, "role": userType }));
        const payload = signupResult.payload as Response;
        
        if (!payload?.success) {
          if (payload?.message === "email") {
            formik.setErrors({ email: "Email is already taken" });
            toast.error("Email is already taken");
          } else if (payload?.message === "Username") {
            formik.setErrors({ userName: "Username is already taken" });
            toast.error("Username is already taken");
          }
        } else {
          navigate("/otp-page");
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
      const response = await dispatch(googleAuthAction(credentialResponse));
      if (response.payload.existingUser && response.payload.data.isGAuth) {
        dispatch(storeUserData(response.payload.data));
        navigate("/");
        return;
      } else if(!response.payload.success) {
        toast.error(response.payload.message);
      }
      else{
        const allData: SignupFormData = {
          role: userType,
          email: response.payload.data.email,
          password: response.payload.data.password,
          userName: ""+ response.payload.data.email.split("@")[0].toLowerCase(),
          isGAuth: true,
        };
  
        navigate(`/${userType.toLowerCase()}/form`,{state:allData});
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

  return (
    <div className="pt-16 flex h-screen justify-center items-center dark:bg-gradient-to-br dark:from-black dark:to-gray-800 bg-gradient-to-r from-white to-gray-200">
      <div className="hidden lg:flex flex-1 justify-center items-center pr-8">
        <img
          src={frame}
          alt="Illustration"
          className="w-2/3 h-auto object-cover rounded-l-lg"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:h-1/2 lg:w-5/11 md:w-1/2 p-8 pl-4">
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
                className={`w-full p-3 pl-10 border ${
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
                className={`w-full p-3 pl-10 border ${
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
                className={`w-full p-3 pl-10 border ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
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
          <div className="flex justify-around mb-4">
          <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
            />
            <button>
              <div className="flex justify-center">
                <img src={facebook} alt="Facebook" className="w-10 h-9" />
                <span className="pt-2 text-blue-800 text-sm dark:text-blue-400">
                  Facebook
                </span>
              </div>
            </button>
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
  );
};

export default Signup;


