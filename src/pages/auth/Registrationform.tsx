import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldProps,
  FormikValues,
} from "formik";
import { Role, SignupFormData } from "../../types";
import { useNavigate } from "react-router-dom";
import { registrationValidationSchema } from "../../utilities/validation/registrationSchema";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { registerAction } from "../../redux/store/actions/auth";
import { uploadToCloudinary } from "../../utilities/axios/claudinary";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { RootState } from "../../redux";
import LoadingSpinner from "../../components/common/loadingSpinner";

// Gender Enum
enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
const qualifications = [
  "BCom",
  "BCA",
  "MCom",
  "MCA",
  "BA",
  "BSc",
  "MBA",
  "BBA",
  "BTech",
  "MTech",
  "PhD",
  "Diploma",
  "MSc",
  "Engineering",
  "Medicine",
  "10th",
  "+2",
];

const RegistrationForm = () => {
  const userData = {
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
    password: localStorage.getItem("userPassword"),
    role: localStorage.getItem("userRole"),
    isGAuth: localStorage.getItem("isGAuth")==="true",
  };
  const fetchdata = useAppSelector((state: RootState) => state.user.data);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const initialValues: SignupFormData = {
    userName: userData.userName ||fetchdata?.userName || "",
    email: userData.email||fetchdata?.email || "",
    firstName: "",
    lastName: "",
    profile: {
      avatar: undefined,
      dateOfBirth: "",
      gender: undefined,
    },
    contact: {
      phone: "",
      social: "",
      address: "",
    },
    profession: undefined,
    qualification: "",
    profit: "",
    cv: undefined,
  };

  const handleSubmit = async (values: SignupFormData) => {
    try {
      setIsLoading(true)
      const avatar = await uploadToCloudinary(values?.profile?.avatar);
      const dateOfBirth = values?.profile?.dateOfBirth;
      const gender = values?.profile?.gender;
      const cv = await uploadToCloudinary(values?.cv);
      values = {
        ...values,
        profile: { avatar: avatar, dateOfBirth: dateOfBirth, gender: gender },
        cv: cv,
      };
      const data = {
        ...values,
        isGAuth: (userData.isGAuth||fetchdata?.isGAuth )? true : false,
        role: userData.role as Role||fetchdata?.role as Role | undefined,
        password: fetchdata?.password ?? undefined,
      };
      const response = await dispatch(registerAction(data));
      if (response.payload.success) {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPassword");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isGAuth");
        setIsLoading(false)
        navigate(`/${userData.role}`);
      }
      setIsLoading(false)
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className=" registration-form  p-8 rounded-md shadow-lg  max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 dark:text-white text-center">
        {userData?.role === "student"||fetchdata?.role==="student"
          ? "Student Registration Form"
          : "Instructor Registration Form"}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={registrationValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-4 md:col-span-1">
              <div className="relative mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                  />
                ) : (
                  <img
                    src="https://www.pngkey.com/png/detail/72-729716_user-avatar-png-graphic-free-download-icon.png"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                  />
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 px-2 py-1 text-sm bg-gray-500 text-white rounded-full"
                  onClick={() => document.getElementById("avatar")?.click()}
                >
                  {avatarPreview ? "Edit" : "Add"}
                </button>
              </div>
              <input
                type="file"
                id="avatar"
                name="profile.avatar"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files
                    ? event.target.files[0]
                    : undefined;
                  setFieldValue("profile.avatar", file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () =>
                      setAvatarPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* Username and Email */}
            <div>
              <label
                htmlFor="userName"
                className="block text-gray-700 dark:text-gray-300"
              >
                Username:
              </label>
              <Field
                type="text"
                id="userName"
                name="userName"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="userName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300"
              >
                Email:
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* First Name and Last Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 dark:text-gray-300"
              >
                First Name:
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 dark:text-gray-300"
              >
                Last Name:
              </label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Date of Birth and Phone */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-gray-700 dark:text-gray-300"
              >
                Date of Birth:
              </label>
              <Field
                type="date"
                id="dateOfBirth"
                name="profile.dateOfBirth"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="profile.dateOfBirth"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 dark:text-gray-300"
              >
                Phone:
              </label>
              <Field
                name="contact.phone"
                render={({ field, form }: FieldProps<string, FormikValues>) => (
                  <PhoneInput
                    id="phone"
                    {...field}
                    defaultCountry="US"
                    international
                    onChange={(value: string | undefined) =>
                      form.setFieldValue("contact.phone", value)
                    }
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                )}
              />
              <ErrorMessage
                name="contact.phone"
                component="div"
                className="text-red-500"
              />
            </div>
            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-gray-700 dark:text-gray-300"
              >
                Gender:
              </label>
              <Field
                as="select"
                id="gender"
                name="profile.gender"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Gender</option>
                <option value={Gender.Male}>{Gender.Male}</option>
                <option value={Gender.Female}>{Gender.Female}</option>
                <option value={Gender.Other}>{Gender.Other}</option>
              </Field>
              <ErrorMessage
                name="profile.gender"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-3">
              <label
                htmlFor="address"
                className="block text-gray-700 dark:text-gray-300"
              >
                Address:
              </label>
              <Field
                type="text"
                id="address"
                name="contact.address"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="contact.address"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* Profession and Qualification */}
            <div>
              <label
                htmlFor="profession"
                className="block text-gray-700 dark:text-gray-300"
              >
                Profession:
              </label>
              <Field
                as="select"
                id="profession"
                name="profession"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Profession</option>
                <option value="working">Working</option>
                <option value="student">Student</option>
              </Field>
              <ErrorMessage
                name="profession"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <label
                htmlFor="qualification"
                className="block text-gray-700 dark:text-gray-300"
              >
                Qualification:
              </label>
              <Field
                as="select"
                id="qualification"
                name="qualification"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select Qualification</option>
                {qualifications.map((qualification, index) => (
                  <option key={index} value={qualification}>
                    {qualification}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="qualification"
                component="div"
                className="text-red-500"
              />
            </div>

            {/* CV Upload (conditional for instructors) */}
            {userData.role === "instructor"||fetchdata?.role==="instructor" && (
              <div>
                <label
                  htmlFor="cv"
                  className="block text-gray-700 dark:text-gray-300"
                >
                  Upload CV:
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(event) => {
                    const file = event.currentTarget.files
                      ? event.currentTarget.files[0]
                      : undefined;
                    setFieldValue("cv", file);
                  }}
                />
                <ErrorMessage
                  name="cv"
                  component="div"
                  className="text-red-500"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Register
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default RegistrationForm;
