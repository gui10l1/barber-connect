import { Navigate } from "react-router-dom";
import useAuth from "../hooks/auth";

export const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user) return <Navigate to="/home" />

  return children;
}