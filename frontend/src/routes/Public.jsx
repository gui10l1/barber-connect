import { Navigate } from "react-router-dom";
import useAuth from "../hooks/auth";

export const PublicRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    const { access } = user;

    if (access === 1) return <Navigate to="/auth/barbers" />;

    if (access === 2) return <Navigate to="/auth/schedule" />;
  }

  return children;
}