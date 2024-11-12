import { FileText, Clock, CheckCircle } from 'lucide-react';

const AdminAssessments = () => {
  const assessments = [
    {
      id: 1,
      title: 'Web Development Final Project',
      course: 'Complete Web Development Bootcamp',
      dueDate: '2024-03-25',
      submissions: 45,
      totalStudents: 60,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Machine Learning Quiz',
      course: 'Machine Learning A-Z',
      dueDate: '2024-03-28',
      submissions: 28,
      totalStudents: 35,
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Assessments</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Create Assessment
        </button>
      </div>

      <div className="grid gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">{assessment.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{assessment.course}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${assessment.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                {assessment.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className="font-medium dark:text-white">{assessment.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submissions</p>
                  <p className="font-medium dark:text-white">
                    {assessment.submissions}/{assessment.totalStudents}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <p className="font-medium dark:text-white">
                    {Math.round((assessment.submissions / assessment.totalStudents) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg">
                View Details
              </button>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg">
                Grade Submissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAssessments;