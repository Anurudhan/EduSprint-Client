import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/hooks";
import { updatePassword } from "../../../redux/store/actions/user";
import { MessageType } from "../../../types/IMessageType";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword: () => void;
  onMessage: (Message: string, Type: MessageType) => void;
  email: string | undefined;
  role: string | undefined;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email?: string | undefined;
  role?: string | undefined;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onMessage,
  onForgotPassword,
  email,
  role,
}) => {
  const validationSchema = Yup.object({
    currentPassword: Yup.string()
    .required("currentPassword is required")
    .min(6, "currentPassword must be at least 6 characters")
    .max(40, "currentPassword cannot be longer than 40 characters")
    .matches(/[a-z]/, "currentPassword must contain at least one lowercase letter")
    .matches(/[A-Z]/, "currentPassword must contain at least one uppercase letter")
    .matches(/\d/, "currentPassword must contain at least one number")
    .matches(/[@$!%*?&#]/, "currentPassword must contain at least one special character"),
    newPassword: Yup.string()
    .required("newPassword is required")
    .min(6, "newPassword must be at least 6 characters")
    .max(40, "newPassword cannot be longer than 40 characters")
    .matches(/[a-z]/, "newPassword must contain at least one lowercase letter")
    .matches(/[A-Z]/, "newPassword must contain at least one uppercase letter")
    .matches(/\d/, "newPassword must contain at least one number")
    .matches(/[@$!%*?&#]/, "newPassword must contain at least one special character"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const dispatch = useAppDispatch();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Change Password
        </h2>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values: PasswordFormValues) => {
            try {
              const data = { ...values, email, role };
              const updateResult = await dispatch(updatePassword(data));
              if (!updateResult.payload.success) {
                onMessage(updateResult?.payload?.message||"Current password does not match the records. Please try again.", "error");
              } else {
                onMessage("Password Updated successfully.", "success");
            }
            onClose();
            } catch (error: unknown) {
              console.log(error);
            }
          }}
        >
          {() => (
            <Form className="space-y-5">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Current Password
                </label>
                <div className="relative">
              <Field
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowCurrentPassword((prev:boolean) => !prev)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-right">
                <button
                  onClick={onForgotPassword}
                  className="text-blue-600 dark:text-blue-400 font-semibold  hover:text-blue-800 dark:hover:text-blue-300 transition duration-200 ease-in-out"
                >
                  Forgot Password?
                </button>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  New Password
                </label>
                <div className="relative">
              <Field
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">
                  Confirm New Password
                </label>
                <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
