import { useState, useEffect, useCallback } from "react";
import CategoryModal from "../../components/admin/category/CategoryModal";
import { Category } from "../../types/ICategory";
import { uploadToCloudinary } from "../../utilities/axios/claudinary";
import { useAppDispatch } from "../../hooks/hooks";
import {
  createCategory,
  getAllCategory,
} from "../../redux/store/actions/admin";
import LoadingSpinner from "../../components/common/loadingSpinner";
import AnimatedText from "../../components/common/AnimatedText";
import { editCategory } from "../../redux/store/actions/admin/editCategory";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const dispatch = useAppDispatch();

  // Fetch categories with pagination
  const fetchCategories = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await dispatch(getAllCategory({ page, limit: 6 }));
        if (response.payload.success) {
          setCategories(response.payload.data.categories);
          setTotalPages(response.payload.data.meta.totalPages);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCategories(page);
  }, [page, fetchCategories]);

  const handleAddCategory = async (
    category: Omit<Category, "id"> & { imageFile: File | null }
  ) => {
    try {
      let imageUrl = category.imageUrl;
      setLoading(true);

      if (category.imageFile) {
        imageUrl = await uploadToCloudinary(category.imageFile);
      }

      const response = await dispatch(
        createCategory({ ...category, imageUrl })
      );
      if (response.payload.success) {
        await fetchCategories(page);
      }
    } catch (error: unknown) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory =async(updatedCategory: Omit<Category, "id"> & { imageFile: File | null }) => {
    if (!editingCategory) return;
    try {
      console.log(updatedCategory.status,"this is status")
      let imageUrl = updatedCategory.imageUrl || "";
      if(updatedCategory.imageFile){
        imageUrl = await uploadToCloudinary(updatedCategory.imageFile);
      }
      const response = await dispatch(editCategory({...updatedCategory,imageUrl:imageUrl}))
      if (response.payload.success) {
        await fetchCategories(page);
        setEditingCategory(null);
      }     
    }
    catch(error:unknown){
      console.log(error)
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat._id !== categoryId)
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold font-serif text-3xl">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            <span className={`  px-2 py-1 w-8 text-xs text-white ${category.status=="active"?"bg-green-600":"bg-red-500"}`}>
                  {category.status}
                </span>
            <img
              src={String(category.imageUrl)}
              alt={category.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 flex-grow">
              <h3 className="text-xl font-bold">{category.name}</h3>
              <div className="max-h-24 overflow-hidden">
                <AnimatedText text={category.description} />
              </div>
            </div>
            <div className="flex justify-between px-5 py-3 bg-gray-100 dark:bg-gray-700">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setShowModal(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(category._id as string)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className={`py-2 px-4 rounded-md ${
            page === 1
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className={`py-2 px-4 rounded-md ${
            page === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {showModal && (
        <CategoryModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
          initialValues={
            editingCategory || { name: "", description: "", imageUrl: "" }
          }
          isEditing={!!editingCategory}
        />
      )}
    </div>
  );
}
