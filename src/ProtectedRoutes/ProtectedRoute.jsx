import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-900 shadow-lg"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
