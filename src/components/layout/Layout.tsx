
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";
import { useDevice } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  requiredRole?: "doctor" | "mphw" | "admin";
}

const Layout = ({ children, requiredRole }: LayoutProps) => {
  const { user, loading } = useAuth();
  const { deviceType } = useDevice();
  const location = useLocation();

  useEffect(() => {
    // Debug log
    console.log("Layout role check - User:", user?.role, "Required role:", requiredRole);
  }, [user, requiredRole]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === "doctor" ? "/doctor" : 
                         user.role === "mphw" ? "/mphw" : 
                         "/admin";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto py-4 sm:py-6 px-2 sm:px-4 md:px-6 w-full max-w-full md:max-w-7xl">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
