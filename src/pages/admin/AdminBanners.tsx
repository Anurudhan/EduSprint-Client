import { useEffect, useState } from 'react';
import { Image, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerModal } from '../../components/admin/BannerModal';
import { BannerEntity, BannerStatus } from '../../types/IBanner';
import { commonRequest, URL } from '../../common/api';
import { config } from '../../common/config';
import { ConfirmModal2 } from '../../../confirmationModal2';
import { toastUtils } from '../../components/common/Toast/ToastUtilities';

const ITEMS_PER_PAGE = 3;

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = [];
  const maxVisiblePages = ITEMS_PER_PAGE;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg text-sm font-medium
            ${currentPage === page 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

const AdminBanners = () => {
  const [banners, setBanners] = useState<BannerEntity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBanners = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await commonRequest<{
        data: BannerEntity[], 
        totalItems: number
      }>('GET', `${URL}/user/banner?page=${page}&limit=${ITEMS_PER_PAGE}`, undefined, config);
      
      setBanners(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(Math.ceil(response.data.totalItems / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners. Please try again later.');
      toastUtils.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBanners(page);
  };

  const handleCreateBanner = async (data: BannerEntity) => {
    try {
      const response = await commonRequest<BannerEntity>('POST', `${URL}/user/banner`, data, config);
      fetchBanners(currentPage);
      if(response.success) toastUtils.success('Banner created successfully!');
      else toastUtils.error('Banner creation failed!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating banner:', err);
      toastUtils.error('Failed to create banner');
    }
  };

  const handleEditBanner = async (data: BannerEntity) => {
    if (selectedBanner?._id) {
      try {
        const value = { ...data, _id: selectedBanner._id };
        const response = await commonRequest<BannerEntity>('PUT', `${URL}/user/banner`, value, config);
        setBanners(banners.map(b => b._id === selectedBanner._id ? response.data : b));
        if(response.success) toastUtils.success('Banner updated successfully!');
        else toastUtils.error('Banner update failed!');
        setIsModalOpen(false);
        setSelectedBanner(null);
      } catch (err) {
        console.error('Error updating banner:', err);
        toastUtils.error('Failed to update banner');
      }
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;
    
    try {
      await commonRequest<boolean>('DELETE', `${URL}/user/banner/${bannerToDelete}`, undefined, config);
      if (banners.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else {
        fetchBanners(currentPage);
      }
      toastUtils.success('Banner deleted successfully!');
    } catch (err) {
      console.error('Error deleting banner:', err);
      toastUtils.error('Failed to delete banner');
    }
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: BannerEntity) => {
    setIsEdit(true);
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleBannerSubmit = (data: BannerEntity) => {
    if (isEdit) handleEditBanner(data);
    else handleCreateBanner(data);
  };

  const openDeleteModal = (bannerId: string) => {
    setBannerToDelete(bannerId);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchBanners(currentPage);
  }, [currentPage]);

  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Banners</h1>
        <button 
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Image className="w-5 h-5 mr-2" />
          Add New Banner
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
          <button onClick={() => fetchBanners(currentPage)} className="ml-4 underline">Try again</button>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No banners found</p>
          <button 
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create your first banner
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-40 md:h-32">
                    <img src={banner.imageUrl || undefined} alt={banner.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-lg font-semibold dark:text-white">{banner.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(banner.startDate as string).toLocaleDateString()} -{' '}
                          {new Date(banner.endDate as string).toLocaleDateString()}
                        </p>
                      </div>
                      <span 
                        className={`mt-2 md:mt-0 px-2 py-1 rounded-full text-xs font-semibold w-fit
                          ${banner.status === BannerStatus.Active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : banner.status === BannerStatus.Scheduled
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {banner.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => openEditModal(banner)}
                        className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(banner._id || '')}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          {totalPages > 0 && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startItem}-{endItem} of {totalItems} items
              </p>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <BannerModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBanner(null); }}
        onSubmit={handleBannerSubmit}
        banner={selectedBanner}
        isEdit={isEdit}
      />
      <ConfirmModal2
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setBannerToDelete(null); }}
        onConfirm={handleDeleteBanner}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default AdminBanners;