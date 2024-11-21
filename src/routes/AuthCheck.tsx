import { Navigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import { SignupFormData } from '../types';

export interface AuthCheckProps {
    children: ReactNode;
    userData:SignupFormData|null; 
  }
const AuthCheck:  React.FC<AuthCheckProps> = ({ children,userData }) => {

    const role =`/${userData?.role}`
  return userData ?  <Navigate to={role} />:<>{children}</> ;
};

export default AuthCheck;