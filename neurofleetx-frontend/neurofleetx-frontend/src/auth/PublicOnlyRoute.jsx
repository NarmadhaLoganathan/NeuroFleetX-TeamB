import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = () => {
  const { auth } = useAuth();
  return auth?.token ? <Navigate to={`/${auth.role.toLowerCase()}`} replace /> : <Outlet />;
};

export default PublicOnlyRoute;
