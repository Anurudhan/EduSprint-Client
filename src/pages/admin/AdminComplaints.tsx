
import { AlertCircle, MessageCircle, Clock } from 'lucide-react';

const AdminComplaints = () => {
  const complaints = [
    {
      id: 1,
      user: 'John Smith',
      subject: 'Course Content Issue',
      course: 'Web Development Bootcamp',
      description: 'Some videos in Module 3 are not playing correctly.',
      status: 'Open',
      priority: 'High',
      date: '2024-03-19',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      user: 'Emma Davis',
      subject: 'Payment Problem',
      course: 'Machine Learning A-Z',
      description: 'Unable to access course after payment confirmation.',
      status: 'In Progress',
      priority: 'Medium',
      date: '2024-03-18',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Complaints</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={complaint.avatar}
                  alt={complaint.user}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold dark:text-white">{complaint.subject}</h3>
                  <p className="text-gray-500 dark:text-gray-400">by {complaint.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${complaint.priority === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                  {complaint.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${complaint.status === 'Open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                  {complaint.status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-300">{complaint.description}</p>
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {complaint.course}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {complaint.date}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <MessageCircle className="w-5 h-5 mr-2" />
                Respond
              </button>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComplaints;