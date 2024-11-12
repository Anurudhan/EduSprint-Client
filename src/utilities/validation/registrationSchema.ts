import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const registrationValidationSchema = Yup.object({
  userName: Yup.string()
    .trim() // Removes leading and trailing spaces
    .min(3, 'Username must be at least 3 characters') // Min length check for username
    .max(20, 'Username must not exceed 20 characters') // Max length check for username
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores') // Only alphanumeric and underscores
    .required('Username is required'),

  email: Yup.string()
    .email('Invalid email format') // Strict email format check
    .required('Email is required')
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email address format'), // Ensure standard email format

  firstName: Yup.string()
    .trim() // Remove leading/trailing spaces
    .matches(/.*\S.*/, 'First name cannot be only spaces') // No spaces-only allowed
    .required('First name is required'),

  lastName: Yup.string()
    .trim()
    .matches(/.*\S.*/, 'Last name cannot be only spaces')
    .required('Last name is required'),

  profile: Yup.object().shape({
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future') // Ensure the date is not in the future
      .required('Date of birth is required')
      .test('age', 'You must be at least 15 years old', value => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age >= 15; // Ensure user is at least 15 years old
      }),

    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['male', 'female', 'other'], 'Gender must be male, female, or other'), // Gender must be one of the three options
  }),

  contact: Yup.object().shape({
    phone: Yup.string()
    .test('is-valid-phone', 'Phone number is invalid', value => {
      // Check if the value is undefined or an empty string before validating
      if (value === undefined || value === '') {
        return false; // Consider it invalid if undefined or empty
      }
      return isValidPhoneNumber(value); // Validate phone number format based on country
    })
    .required('Phone number is required'),

    address: Yup.string()
      .trim()
      .matches(/.*\S.*/, 'Address cannot be only spaces')
      .required('Address is required'),
  }),


  profession: Yup.string()
    .trim()
    .required('Profession is required')
    .oneOf(['working', 'student'], 'Profession must be either "working" or "student"'), // Only "working" or "student" are valid professions

  qualification: Yup.string()
    .trim()
    .required('Qualification is required')
    .oneOf(
      [
        'BCom', 'BCA', 'MCom', 'MCA', 'BA', 'BSc', 'BTech', 'MTech', 'MBA', 'BBA', 
        'PhD', 'Diploma', 'BSc IT', 'BBA IT', 'BMS', 'MSc', 'BEd', 'LLB','10th','+2'
      ],
      'Qualification must be one of the predefined options'
    ), // List of valid qualifications
});
