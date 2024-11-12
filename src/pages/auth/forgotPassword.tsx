import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { resetPasswordvalidationSchema } from "../../utilities/validation/resetPasswordScema";
import { useAppDispatch } from "../../hooks/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../redux/store/actions/auth/resetPassword";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ForgotPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const initialValues: ForgotPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    if (!token) {
      toast.error("Token is missing");
      return;
    }
    
    const response = await dispatch(
      resetPassword({ token, password: values.password })
    );

    if (response.payload.success) {
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      toast.error("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="pt-16 flex h-screen justify-center items-center bg-gradient-to-r from-white to-gray-200 dark:bg-gradient-to-br dark:from-black dark:to-gray-800">
      <ToastContainer />
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faLock} className="text-gray-800 dark:text-gray-200 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Reset Password
          </h2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordvalidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 p-2 w-full rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
