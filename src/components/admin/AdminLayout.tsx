
import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the admin panel",
          variant: "destructive",
        });
        navigate('/login', { state: { from: location.pathname }, replace: true });
      } else if (user.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "You don't have administrator permissions",
          variant: "destructive",
        });
        
        const redirectPath = user.role === 'doctor' ? '/doctor' : '/mphw';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, loading, navigate, location.pathname, toast]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
