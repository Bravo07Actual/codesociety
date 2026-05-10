import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const GuestRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
