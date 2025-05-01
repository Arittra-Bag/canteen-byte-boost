
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { UserRole } from "@/types";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  
  // If still loading auth state, don't render anything yet
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If role restriction is specified and user doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has the required role
  return <>{children}</>;
}
