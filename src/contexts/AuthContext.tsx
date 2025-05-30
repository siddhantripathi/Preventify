import React, { createContext, useContext, useEffect } from 'react';
import { User } from '@/types';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

// Update the login function type to match what useFirebaseAuth returns
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{
    user: any;
    session: null;
  } | undefined>;
  loginWithGoogle: () => Promise<{
    user: any;
    session: null;
  } | undefined>;
  logout: () => Promise<boolean>;
  registerActivity: (action: string, resourceType: string, resourceId: string, details?: string) => Promise<void>;
  updateUserSettings: (settings: { geminiApiKey?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => undefined,
  loginWithGoogle: async () => undefined,
  logout: async () => true,
  registerActivity: async () => {},
  updateUserSettings: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    logActivity,
    updateUserSettings,
    initAuth
  } = useFirebaseAuth();

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    // Set up auth state listener
    const unsubscribe = initAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initAuth]);

  const registerActivity = async (
    action: string, 
    resourceType: string, 
    resourceId: string, 
    details?: string
  ) => {
    await logActivity(
      action as 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view', 
      resourceType as 'patient' | 'prescription' | 'user' | 'location' | 'system', 
      resourceId, 
      details
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      loginWithGoogle,
      logout, 
      registerActivity, 
      updateUserSettings 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
