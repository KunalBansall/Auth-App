import React from 'react'
import { useAuth } from '../context/AuthContext'
import {Navigate} from 'react-router-dom'

const ProtectedRoute = ({element})=>{
  const {isAuthenticated} = useAuth();
  const token = localStorage.getItem('token');

  // check both localStorage and context to determine if user is authenticated 
  return isAuthenticated || token ? element : <Navigate to='/sign-in'/>
};

export default ProtectedRoute;