import { Navigate } from 'react-router-dom';
import React  from 'react';
import { AuthCheckProps } from './AuthCheck';


const UserAuthCheck:  React.FC<AuthCheckProps> = ({userData, children }) => {
    console.log("User data is here",userData  )
  return userData && userData.isVerified && !userData.isBlocked?  <>{children}</> : <Navigate to="/home" />;
};

export default UserAuthCheck;