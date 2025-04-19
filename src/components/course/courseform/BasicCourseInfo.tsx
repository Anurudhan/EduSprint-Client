import React, { useEffect, useState } from "react";
import { CourseEntity, Level } from "../../../types/ICourse";
import { Category } from "../../../types/ICategory";
import { getAllCategory } from "../../../redux/store/actions/admin";
import { useAppDispatch } from "../../../hooks/hooks";

const BasicCourseInfo: React.FC<{
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
  errors: Record<string, string>;
}> = ({ course, setCourse, errors }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await dispatch(getAllCategory({ page: 1, limit: 1000 }));
        if (response.payload.success) {
          setCategories(response.payload.data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? "border-red-500" : "border-gray-200"
          } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          value={course.title || ""}
          onChange={(e) =>
            setCourse((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter a descriptive title"
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`mt-1 block w-full rounded-md border ${
            errors.description ? "border-red-500" : "border-gray-200"
          } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
          rows={4}
          value={course.description || ""}
          onChange={(e) =>
            setCourse((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe what students will learn in this course"
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.categoryRef ? "border-red-500" : "border-gray-200"
            } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            value={course.categoryRef || ""}
            onChange={(e) =>
              setCourse((prev) => ({ ...prev, categoryRef: e.target.value }))
            }
            required
          >
            <option value="" disabled>
              {loadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryRef && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryRef}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.level ? "border-red-500" : "border-gray-200"
            } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            value={course.level || ""}
            onChange={(e) =>
              setCourse((prev) => ({ ...prev, level: e.target.value as Level }))
            }
            required
          >
            <option value="" disabled>
              Select difficulty level
            </option>
            {Object.values(Level).map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicCourseInfo;