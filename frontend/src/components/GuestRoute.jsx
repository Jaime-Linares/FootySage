import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/home" replace />;
};


export default GuestRoute;
