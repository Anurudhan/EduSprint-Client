import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiX } from 'react-icons/fi'; // Import close icon from react-icons

// Define the types for the props
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  initialValues: FormValues;
}

// Define the shape of the form values
export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    dateOfBirth: string;
  };
  userName: string;
  contact: {
    address: string;
    phone?: string;
  };
  password?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSubmit, initialValues }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    profile: Yup.object({
      dateOfBirth: Yup.date().required('Date of Birth is required'),
    }),
    userName: Yup.string().required('Username is required'),
    contact: Yup.object({
      address: Yup.string().required('Address is required'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be at least 10 digits')
        .notRequired(),
    }),
    password: Yup.string().min(6, 'Password must be at least 6 characters').notRequired(),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 transition">
          <FiX size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Edit Profile</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {() => (
            <Form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">First Name</label>
                  <Field name="firstName" type="text" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200">Last Name</label>
                  <Field name="lastName" type="text" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Email</label>
                <Field name="email" type="email" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200">Date of Birth</label>
                <Field name="profile.dateOfBirth" type="date" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                <ErrorMessage name="profile.dateOfBirth" component="div" className="text-red-500 text-sm" />
              </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Username</label>
                <Field name="userName" type="text" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Phone Number</label>
                <Field name="contact.phone" type="text" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                <ErrorMessage name="contact.phone" component="div" className="text-red-500 text-sm" />
              </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Address</label>
                <Field name="contact.address" type="text" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" />
                <ErrorMessage name="contact.address" component="div" className="text-red-500 text-sm" />
              </div>

              

              <div>
                <label className="block text-gray-700 dark:text-gray-200">Change Password</label>
                <Field name="password" type="password" className="input-field p-3 rounded-lg border dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full" placeholder="Enter new password" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-600 transition duration-200">Save Changes</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal;
