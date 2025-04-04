import { useEffect, useState } from "react";
import { Modal } from "../common/Modal";
import { BannerEntity, BannerStatus } from "../../types/IBanner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadToCloudinary } from "../../utilities/axios/claudinary";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerEntity) => void;
  banner?: BannerEntity | null;
  isEdit: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .notOneOf([""], "Title cannot be just spaces")
    .matches(
      /^[^!@#$%^&*()_+=\-[\]{};:'",.<>?/`~]/,
      "Title cannot start with a symbol"
    )
    .matches(/[a-zA-Z0-9]/, "Title cannot contain only symbols"),
  imageUrl: Yup.string().required("Image is required"),
  startDate: Yup.date()
    .min(
      new Date().toISOString().split("T")[0],
      "Start date must be today or in the future"
    )
    .required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after the start date"),
});

export const BannerModal = ({
  isOpen,
  onClose,
  onSubmit,
  banner,
  isEdit,
}: BannerModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to format date to YYYY-MM-DD
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return new Date().toISOString().split("T")[0];
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      imageUrl: "",
      status: BannerStatus.Scheduled,
      startDate: formatDateForInput(new Date()),
      endDate: formatDateForInput(new Date()),
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (imageFile) {
          const imageUrl = await uploadToCloudinary(imageFile);
          values.imageUrl = imageUrl;
        }
        onSubmit(values);
        if (!isEdit) {
          formik.resetForm();
          setImageFile(null);
          setImagePreview("");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("imageUrl", "pending-upload");
    } else {
      setImagePreview("");
      formik.setFieldValue("imageUrl", "");
    }
  };

  useEffect(() => {
    if (banner && isEdit) {
      formik.setValues({
        title: banner.title || "",
        imageUrl: banner.imageUrl || "",
        status: banner.status || BannerStatus.Scheduled,
        startDate: formatDateForInput(banner.startDate),
        endDate: formatDateForInput(banner.endDate),
      });
      if (banner.imageUrl) {
        setImagePreview(banner.imageUrl);
      }
    } else {
      formik.resetForm({
        values: {
          title: "",
          imageUrl: "",
          status: BannerStatus.Scheduled,
          startDate: formatDateForInput(new Date()),
          endDate: formatDateForInput(new Date()),
        },
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [banner, isEdit, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Banner" : "Create New Banner"}
      isEdit={isEdit}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Banner Image
            </label>
            <div className="relative group flex-1">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Banner Preview"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 shadow-md">
                  No Image Selected
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
            />
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">
                {formik.errors.imageUrl}
              </p>
            )}
          </div>

          {/* Form Fields and Buttons Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  required
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formik.values.startDate}
                    onChange={(e) => {
                      formik.setFieldValue("startDate", e.target.value);
                      // Ensure end date stays valid
                      if (e.target.value > formik.values.endDate) {
                        formik.setFieldValue("endDate", e.target.value);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    min={formatDateForInput(new Date())}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
                    required
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">
                      {formik.errors.startDate}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={formik.values.startDate}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
                    required
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <p className="text-red-500 text-xs mt-1.5 animate-fadeIn">
                      {formik.errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 sm:pt-16 sm:pe-5">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Processing..." : isEdit ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};