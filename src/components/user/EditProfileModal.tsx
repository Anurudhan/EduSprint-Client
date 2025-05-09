import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { SignupFormData } from "../../types";

// Define the types for the props
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: () => void;
  onSubmit: (values: SignupFormData) => void;
  initialValues: SignupFormData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onChangePassword,
  onSubmit,
  initialValues,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required("First Name is required")
      .test("not-empty", "First Name cannot be empty", (value) => value?.trim().length > 0),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required")
      .test("not-empty", "Last Name cannot be empty", (value) => value?.trim().length > 0),
    profile: Yup.object({
      dateOfBirth: Yup.date()
        .required("Date of Birth is required")
        .test("age", "Must be older than 15", (value) => {
          if (!value) return false;
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 > 15;
          }
          return age > 15;
        }),
    }),
    userName: Yup.string()
      .trim()
      .required("Username is required")
      .test("not-empty", "Username cannot be empty", (value) => value?.trim().length > 0),
    contact: Yup.object({
      address: Yup.string()
        .trim()
        .required("Address is required")
        .test("not-empty", "Address cannot be empty", (value) => value?.trim().length > 0),
      phone: Yup.string()
        .test("is-valid-phone", "Phone number is invalid", (value) => {
          if (value === undefined || value === "") {
            return false;
          }
          return isValidPhoneNumber(value);
        })
        .required("Phone number is required"),
    }),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Edit Profile
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values: SignupFormData) => {
            const formData: SignupFormData = {
              ...initialValues, // Include all initial values
              ...values, // Override with edited values
              roomId: values.roomId || initialValues.roomId || "", // Ensure roomId is preserved or set
              profile: {
                ...initialValues.profile,
                ...values.profile, // Merge profile fields
              },
              contact: {
                ...initialValues.contact,
                ...values.contact, // Merge contact fields
              },
            };
            onSubmit(formData);
            onClose();
          }}
        >
          {() => (
            <Form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    First Name
                  </label>
                  <Field
                    name="firstName"
                    type="text"
                    className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    Last Name
                  </label>
                  <Field
                    name="lastName"
                    type="text"
                    className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    Date of Birth
                  </label>
                  <Field
                    name="profile.dateOfBirth"
                    type="date"
                    className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
                  />
                  <ErrorMessage
                    name="profile.dateOfBirth"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    Username
                  </label>
                  <Field
                    name="userName"
                    type="text"
                    className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    Phone Number
                  </label>
                  <Field name="contact.phone">
                    {({ field, form }: FieldProps) => (
                      <PhoneInput
                        {...field}
                        value={form.values.contact.phone}
                        onChange={(value: string | undefined) =>
                          form.setFieldValue("contact.phone", value)
                        }
                        defaultCountry="US"
                        international
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="contact.phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">
                    Address
                  </label>
                  <Field
                    name="contact.address"
                    type="text"
                    className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full"
                  />
                  <ErrorMessage
                    name="contact.address"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <Field type="hidden" name="roomId" />

              <div className="text-center">
                <button
                  type="button"
                  onClick={onChangePassword}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition duration-200 ease-in-out"
                >
                  Change Password
                </button>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal;