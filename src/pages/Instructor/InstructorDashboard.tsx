import InstructorDashboardStats from "../../components/Instructor/InstructorDashboardStats";
import InstructorRecentActivities from "../../components/Instructor/InstructorRecentActivities";




const InstructorDashboard = () => {
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Instructor Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <InstructorDashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InstructorRecentActivities />
            
            {/* Additional components can be added here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;