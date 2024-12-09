import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Category } from "../../../types/ICategory";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Category, "id"> & { imageFile: File | null }) => void;
  initialValues: Omit<Category, "id">;
  isEditing?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEditing = false,
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(initialValues.imageUrl?initialValues.imageUrl:null);
  const [status, setStatus] = useState<string>(initialValues.status||"active");
  if (!isOpen) return null;

  const categoryValidationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    description: Yup.string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {isEditing ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={{ ...initialValues, imageFile: null }}
          validationSchema={categoryValidationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Image File
                </label>
                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] || null;
                    setFieldValue("imageFile", file);
                    setFilePreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                />
                {filePreview && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="mt-2 w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-2">
                {isEditing&&(
                  <button
                  onClick={()=>{
                    const updatedStatus = status === "active" ? "blocked" : "active";
                    setStatus(updatedStatus);
                    onSubmit({ ...initialValues, status: updatedStatus,imageFile:null });
                    onClose();
                  }} 
                  className={`px-4 py-2 ${initialValues.status==="active"? "bg-red-500 text-white rounded-md hover:bg-red-600":" bg-green-500 text-white rounded-md hover:bg-green-600"}`}>
                  {initialValues?.status==="active"?"Block":"Activate"}
                </button>)}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isEditing ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CategoryModal;
