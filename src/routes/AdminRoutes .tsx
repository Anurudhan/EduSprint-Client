import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => (
  <>
    <Routes>
      <Route path="" element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="instructors"  />
      <Route path="students"/>
    </Routes>
  </>
);

export default AdminRoutes;
