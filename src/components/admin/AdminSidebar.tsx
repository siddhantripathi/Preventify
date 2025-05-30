
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  Brain, 
  PenTool, 
  Users2, 
  Settings, 
  BarChart3, 
  Clock, 
  AlignJustify,
  LogOut,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, path, isActive }: SidebarItemProps) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 mb-1", 
        isActive 
          ? "bg-primary/10 text-primary hover:bg-primary/20" 
          : "hover:bg-muted"
      )}
      onClick={() => navigate(path)}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();
  
  const sidebarItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Building2 size={20} />, label: "Locations", path: "/admin/locations" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <FileText size={20} />, label: "Patients", path: "/admin/patients" },
    { icon: <Pill size={20} />, label: "Formulary", path: "/admin/formulary" },
    // AI Monitoring and Prescriptions are hidden
    // { icon: <Brain size={20} />, label: "AI Monitoring", path: "/admin/ai-monitoring" },
    // { icon: <PenTool size={20} />, label: "Prescriptions", path: "/admin/prescriptions" },
    { icon: <Users2 size={20} />, label: "Queue", path: "/admin/queue" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/admin/analytics" },
    { icon: <Clock size={20} />, label: "Activity Logs", path: "/admin/logs" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been redirected to the login page.",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={cn(
      "h-screen bg-card border-r p-4 flex flex-col transition-all",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold">Admin Panel</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <AlignJustify size={20} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={collapsed ? "" : item.label}
            path={item.path}
            isActive={pathname === item.path}
          />
        ))}
      </div>
      
      <Button 
        variant="outline" 
        className="mt-auto w-full flex items-center gap-2 justify-center" 
        onClick={handleLogout}
      >
        <LogOut size={collapsed ? 20 : 16} />
        {!collapsed && <span>Logout</span>}
      </Button>
    </div>
  );
};
