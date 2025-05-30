import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Menu, Home, UserCircle, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDevice } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useDevice();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      console.log("Handling logout...");
      await logout();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Force navigation to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out, but you've been redirected to the login page.",
        variant: "destructive",
      });
      
      // Navigate to login page even on error
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user's home route based on role
  const getUserHomeRoute = () => {
    switch (user.role) {
      case 'admin': return '/admin';
      case 'doctor': return '/doctor';
      case 'mphw': return '/mphw';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center px-3 sm:px-6 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-base sm:text-lg text-medical-primary">
        <Link to={getUserHomeRoute()} className="flex items-center gap-1.5">
          {!isMobile && <span className="hidden sm:inline">Preventify.me</span>}
          <span className={isMobile ? "text-lg font-bold" : "sm:hidden"}>PM</span>
        </Link>
      </div>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {(isMobile || isTablet) ? (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] px-4 py-6">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3 mb-4 w-full pb-4 border-b">
                  <Avatar>
                    <AvatarFallback className="bg-medical-primary/10 text-medical-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
                
                <Link 
                  to={getUserHomeRoute()} 
                  className="flex items-center gap-2 text-sm w-full py-2 px-3 rounded-md hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" /> Home
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/settings" 
                    className="flex items-center gap-2 text-sm w-full py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="w-full justify-start gap-2 mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role}</span>
            </div>
            
            <Avatar>
              <AvatarFallback className="bg-medical-primary/10 text-medical-primary">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </AvatarFallback>
            </Avatar>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="text-gray-500 h-8 w-8 sm:h-9 sm:w-9"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
