import { Navigate } from 'react-router-dom';
import React  from 'react';
import { AuthCheckProps } from './AuthCheck';


const AdminAuthCheck:  React.FC<AuthCheckProps> = ({ children,userData }) => {
  return userData ?  <>{children}</> : <Navigate to="/login?role=admin" />;
};

export default AdminAuthCheck;