import DashboardStats from "../../components/admin/DashboardStats";
// import TopCourses from "../../components/admin/TopCourses";
// import TopInstructors from "../../components/admin/TopInstructors";


const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard </h1>
      <h2 className="text-2xl  dark:text-white">Overview</h2>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <TopCourses /> */}
        {/* <TopInstructors /> */}
      </div>
    </div>
  );
};

export default AdminDashboard;