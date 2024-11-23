import useAuth from "../hooks/auth";
import { Unauthorized } from "../components/Unauthorized";

export const BarberRoutes = ({ children }) => {
  const { user } = useAuth();

  if (user.access !== 2) {
    return <Unauthorized message="Este recurso está destinado à barbeiros!" />;
  }

  return children;
}