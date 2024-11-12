
import { Image, Edit2, Trash2 } from 'lucide-react';

const AdminBanners = () => {
  const banners = [
    {
      id: 1,
      title: 'Summer Learning Festival',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2024-06-30'
    },
    {
      id: 2,
      title: 'New Course Launch',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      status: 'Scheduled',
      startDate: '2024-04-01',
      endDate: '2024-04-30'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Banners</h1>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Image className="w-5 h-5 mr-2" />
          Add New Banner
        </button>
      </div>

      <div className="grid gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="flex">
              <div className="w-48 h-32">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{banner.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {banner.startDate} - {banner.endDate}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${banner.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                    {banner.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;