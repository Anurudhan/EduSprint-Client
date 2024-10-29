import * as Yup from 'yup';

export const registrationValidationSchema = Yup.object({
  userName: Yup.string()
    .trim() // Removes leading and trailing spaces
    .required('Username is required'), // Username is still required, but no spaces-only input allowed

  email: Yup.string()
    .email('Invalid email format') // Strict email format check
    .required('Email is required'),

  firstName: Yup.string()
    .trim() // Remove leading/trailing spaces
    .matches(/.*\S.*/, 'First name cannot be only spaces') // No spaces-only allowed
    .required('First name is required'),

  lastName: Yup.string()
    .trim()
    .matches(/.*\S.*/, 'Last name cannot be only spaces')
    .required('Last name is required'),

  profile: Yup.object().shape({
    dateOfBirth: Yup.string().required('Date of birth is required'),
    gender: Yup.string().required('Gender is required'),
  }),

  contact: Yup.object().shape({
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits') // 10-digit phone number validation
      .required('Phone number is required'),

    address: Yup.string()
      .trim()
      .matches(/.*\S.*/, 'Address cannot be only spaces')
      .required('Address is required'),
  }),

  profession: Yup.string()
    .trim()
    .required('Profession is required'),

  qualification: Yup.string()
    .trim()
    .required('Qualification is required'),
});
