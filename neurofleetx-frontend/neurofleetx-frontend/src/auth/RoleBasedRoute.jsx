import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default RoleBasedRoute;
