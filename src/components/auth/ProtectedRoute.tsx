
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('doctor' | 'mphw' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // For debugging auth
    console.log("Protected route - User:", user?.role, "Loading:", loading, "Allowed roles:", allowedRoles);
    
    // If not logged in and not loading, show toast notification
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
    
    // If user doesn't have required role, show toast notification
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access denied",
        description: `You don't have permission to access this page. Your role: ${user.role}`,
        variant: "destructive",
      });
    }
  }, [user, loading, allowedRoles, toast]);

  // If still loading, show loading indicator
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified and user doesn't have the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    const redirectPath = user.role === 'doctor' 
      ? '/doctor' 
      : user.role === 'mphw' 
        ? '/mphw' 
        : '/admin';
    
    console.log("User doesn't have required role, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // If authorized, render the component
  return <>{children}</>;
};

export default ProtectedRoute;
