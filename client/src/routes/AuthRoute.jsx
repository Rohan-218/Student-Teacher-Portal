// AuthRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure this import is correct

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  let userType;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userType = decodedToken.user_type; // Adjust based on your token's structure
      console.log('Decoded Token:', decodedToken); // Log the decoded token for debugging
    } catch (error) {
      console.error('Failed to decode token', error);
    }
  }

  // Check if userType is 0 or 3
  if (!token || (userType !== 0 && userType !== 3)) {
    alert('Access denied. Only admins are allowed to view this page.'); // Alert for unauthorized access
    return <Navigate to="/admin/admin-login" />;
  }

  return children;
};

export default AuthRoute;
