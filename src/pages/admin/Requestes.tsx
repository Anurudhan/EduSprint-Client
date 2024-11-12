import { CheckCircle, XCircle, Eye } from 'lucide-react';

const Requests = () => {
  const requests = [
    {
      id: 1,
      name: 'Dr. Michael Brown',
      email: 'michael.brown@example.com',
      specialization: 'Data Science',
      experience: '8 years',
      status: 'Pending',
      date: '2024-03-18',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      name: 'Prof. Emma Wilson',
      email: 'emma.wilson@example.com',
      specialization: 'Digital Marketing',
      experience: '6 years',
      status: 'Pending',
      date: '2024-03-17',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Instructor Requests</h1>

      <div className="grid gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={request.avatar}
                  alt={request.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-white">{request.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{request.email}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {request.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
                <p className="font-medium dark:text-white">{request.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teaching Experience</p>
                <p className="font-medium dark:text-white">{request.experience}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve
              </button>
              <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <XCircle className="w-5 h-5 mr-2" />
                Decline
              </button>
              <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg">
                <Eye className="w-5 h-5 mr-2" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;