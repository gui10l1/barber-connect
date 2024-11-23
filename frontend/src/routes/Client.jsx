import { Navigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import { Unauthorized } from "../components/Unauthorized";

export const ClientRoutes = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />

  if (user.access !== 1) {
    return <Unauthorized message="Este recurso está destinado à clientes!" />;
  }

  return children;
}