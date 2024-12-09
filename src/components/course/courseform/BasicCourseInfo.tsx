import React, { useEffect, useState } from "react";
import { CourseEntity, Level } from "../../../types/ICourse";
import { Category } from "../../../types/ICategory";
import { getAllCategory } from "../../../redux/store/actions/admin";
import { useAppDispatch } from "../../../hooks/hooks";

const BasicCourseInfo: React.FC<{
  course: Partial<CourseEntity>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<CourseEntity>>>;
}> = ({ course, setCourse }) => {

  const [categories, setCategories] = useState<Category[]>([]);
const [loadingCategories, setLoadingCategories] = useState(false);
const dispatch = useAppDispatch();

useEffect(() => {
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await dispatch(getAllCategory({page: 1, limit: 1000} ))
      console.log(response.payload.categories)
      if(response.payload.success){
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-200 border-2   shadow-md focus:border-blue-500 focus:ring-blue-500"
          value={course.title}
          onChange={(e) =>
            setCourse((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-200 border-2   shadow-md focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={course.description}
          onChange={(e) =>
            setCourse((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-200 border-2 shadow-md focus:border-blue-500 focus:ring-blue-500"
            value={course.level}
            onChange={(e) =>
              setCourse((prev) => ({ ...prev, level: e.target.value as Level }))
            }
          >
            {Object.values(Level).map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BasicCourseInfo;
