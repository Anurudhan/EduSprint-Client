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
import SearchInput from "../../components/common/Search/searchInput";
import { PaginationV2 } from "../../components/common/Pagination/PaginationV2";

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();

  // Fetch categories with pagination and search
  const fetchCategories = useCallback(
    async (currentPage: number, search: string = "") => {
      try {
        setLoading(true);
        const response = await dispatch(
          getAllCategory({ 
            page: currentPage, 
            limit: 6,
            search: search || undefined 
          })
        );
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
    fetchCategories(page, searchTerm);
  }, [page, searchTerm, fetchCategories]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1); // Reset to first page when searching
  };

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
        await fetchCategories(page, searchTerm);
        setShowModal(false);
      }
    } catch (error: unknown) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (
    updatedCategory: Omit<Category, "id"> & { imageFile: File | null }
  ) => {
    if (!editingCategory) return;
    try {
      setLoading(true);
      let imageUrl = updatedCategory.imageUrl || "";
      if (updatedCategory.imageFile) {
        imageUrl = await uploadToCloudinary(updatedCategory.imageFile);
      }
      const response = await dispatch(
        editCategory({ 
          ...updatedCategory, 
          _id: editingCategory._id,
          imageUrl: imageUrl 
        })
      );
      if (response.payload.success) {
        await fetchCategories(page, searchTerm);
        setEditingCategory(null);
        setShowModal(false);
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // Here you would normally dispatch a delete action to your Redux store
    // For now, we'll just update the UI optimistically
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat._id !== categoryId)
    );
    
    // You may want to add a confirmation dialog before deletion
    // And properly handle the API call for deletion
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="font-bold font-serif text-3xl">Categories</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchInput
            placeholder="Search categories..."
            onSearch={handleSearch}
            debounceTime={500}
            initialValue={searchTerm}
            className="w-full md:w-64"
          />
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
          >
            Add Category
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Categories Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? `No results found for "${searchTerm}". Try a different search term.`
              : "No categories have been added yet. Click the 'Add Category' button to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-all hover:shadow-xl"
            >
              <div className="relative">
                <span
                  className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
                    category.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                  title={
                    category.status === "active"
                      ? "This category is active"
                      : "This category is inactive"
                  }
                >
                  {category.status
                    ? category.status.charAt(0).toUpperCase() +
                      category.status.slice(1)
                    : "Active"}
                </span>
                <img
                  src={String(category.imageUrl)}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
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
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id as string)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced pagination component */}
      {totalPages > 1 && !loading && (
        <PaginationV2
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxDisplayedPages={6}
        />
      )}

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