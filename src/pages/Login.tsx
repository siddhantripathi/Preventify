import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import { Stethoscope, Users, ShieldCheck } from "lucide-react";
import { useDevice } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState("doctor");
  const { isMobile } = useDevice();
  const { toast } = useToast();
  
  // Get the path the user was trying to access
  const from = location.state?.from || '/';

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to:", user.role);
      
      // First check if user was trying to access a specific page
      if (from && from !== '/') {
        console.log("Redirecting to previously attempted page:", from);
        navigate(from, { replace: true });
        return;
      }
      
      // Otherwise, redirect to the default dashboard based on role
      const redirectPath = 
        user.role === "doctor" ? "/doctor" : 
        user.role === "mphw" ? "/mphw" : 
        "/admin";
      
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by the useEffect that watches for user changes
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set current role based on the selected tab
  const handleRoleChange = (value: string) => {
    setCurrentRole(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1">
              Preventify.me
            </h1>
            <p className="text-gray-500 text-center text-sm sm:text-base">
              Login to access your dashboard
            </p>
          </div>

          <Tabs
            defaultValue="doctor"
            onValueChange={handleRoleChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6 sm:mb-8">
              <TabsTrigger value="doctor" className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm py-1.5 sm:py-2">
                <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span className={isMobile ? "hidden sm:inline" : ""}>Doctor</span>
              </TabsTrigger>
              <TabsTrigger value="mphw" className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm py-1.5 sm:py-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span className={isMobile ? "hidden sm:inline" : ""}>MPHW</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex gap-1 sm:gap-2 items-center text-xs sm:text-sm py-1.5 sm:py-2">
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span className={isMobile ? "hidden sm:inline" : ""}>Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctor">
              <LoginForm
                role="doctor"
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="mphw">
              <LoginForm
                role="mphw"
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="admin">
              <LoginForm
                role="admin"
                onSubmit={handleLogin}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>
              Please enter your credentials to log in.
              <br />
              Contact your administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
