import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";
import frame from "../../assets/e-learning-graphic-with-student.png";
import { Role, SignupFormData } from '../../types/IForm';
import { loginValidationSchema } from '../../utilities/validation/loginSchema';
import { loginAction } from '../../redux/store/actions/auth';
import { useAppDispatch } from '../../hooks/hooks';

const Login: React.FC = () => {
    const [searchParams] = useSearchParams();
    const userType = searchParams.get('role') || Role.Student;
    const [heading, setHeading] = useState('Student Login');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Handle role-based logic
        if (userType === Role.Instructor) {
            setHeading('Instructor Login');
        } else if (userType === Role.Admin) {
            setHeading('Admin Login');
        } else if (userType === Role.Student) {
            setHeading('Student Login');
        } else {
            // Redirect to home page if no valid role is provided
            navigate('/');
        }
    }, [userType, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            try {
                const data = { ...values, role: userType as Role };
                const loginResult = await dispatch(loginAction(data));
                
                if (!loginResult.payload?.success) {
                    // Display error message from the server
                    setErrorMessage(loginResult.payload?.message || 'Login failed. Please try again.');
                } else {
                    // Check if user is verified
                    if (loginResult.payload.data.isVerified) {
                        // Navigate to the appropriate route based on user type
                        navigate(`/${userType.toLowerCase()}`);
                    } else {
                        const allData: SignupFormData = {
                            ...data,
                            isGAuth: false,
                          };
                        navigate(`/${userType.toLowerCase()}/form`,{state:allData});
                    }
                }
            } catch (error) {
                console.error("Login error:", error);
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        },
    });

    return (
        <div className={`pt-16 flex h-screen justify-center items-center dark:bg-gradient-to-br dark:from-black dark:to-gray-800 bg-gradient-to-r from-white to-gray-200`}>
            <div className="hidden lg:flex flex-1 justify-center items-center pr-8">
                <img src={frame} alt="Illustration" className="w-2/3 h-auto object-cover rounded-l-lg" />
            </div>
            <div className="flex flex-col justify-center items-center w-full lg:h-1/2 lg:w-5/11 md:w-1/2 p-8 pl-4">
                <div className={`bg-white dark:bg-gradient-to-bl dark:from-black dark:to-gray-800 shadow-lg rounded-lg p-5 w-full transition duration-300 dark:shadow-[0px_5px_15px_#1a1a1a] shadow-gray-400`}>
                    <h3 className="text-2xl font-semibold text-center mb-4 text-green-600 dark:text-gray-200">{heading}</h3>
                    
                    {/* Error Message */}
                    {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="relative">
                            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                {...formik.getFieldProps('email')}
                                className={`w-full p-3 pl-10 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...formik.getFieldProps('password')}
                                className={`w-full p-3 pl-10 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`}
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

                        <div className="text-right">
                            <a href="#" className="text-blue-500 text-sm hover:underline">Forgot Password?</a>
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
                        <span className="text-gray-500 dark:text-gray-300">or sign in with</span>
                    </div>
                    <div className="flex justify-around mb-4">
                        <button className="transition ">
                            <img src={google} alt="Google" className='w-20 h-auto' />
                        </button>
                        <button>
                            <div className='flex justify-center'>
                                <img src={facebook} alt="Facebook" className='w-10 h-9'/>
                                <span className='pt-2 text-blue-800 text-sm dark:text-blue-400'>Facebook</span>
                            </div>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <span className="text-gray-500 dark:text-gray-300">Don't have an account? </span>
                        <a href={`/signup/?role=${userType}`} className="text-blue-500 dark:text-blue-400 hover:underline">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
