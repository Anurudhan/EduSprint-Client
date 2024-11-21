
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import TeachUs from "../pages/auth/TeachUs";
import Signup from "../pages/auth/Signup";


const PublicRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teach-us" element={<TeachUs />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default PublicRoutes;
