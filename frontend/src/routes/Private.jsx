import { Navigate } from 'react-router-dom';

import useAuth from "../hooks/auth";

export const PrivateRoutes = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return children;
}