import { Navigate, Outlet } from 'react-router-dom';
import { useWebStore } from "@/store/authStore";

export const ProtectedRoute = () => {
    const {user} = useWebStore();
    return user ? <Outlet /> : <Navigate to="/login" replace />;
  };
  
export const PublicOnlyRoute = () => {
    const {user} = useWebStore();
    return !user ? <Outlet /> : <Navigate to="/" replace />;
};