import { useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';
import { User } from '@/types';
import { useActivityLogger } from './useActivityLogger';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { registerActivity } = useActivityLogger();

  // Handle Firebase user data conversion
  const formatUser = useCallback(async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      // Get additional user data from Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const appUser: User = {
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: userData.role || 'mphw',
          specialization: userData.specialization || undefined,
          locationIds: userData.locationIds || []
        };
        return appUser;
      } else {
        // User document doesn't exist, create it with default data
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: 'mphw' // Default role
        };
        
        // Save user to Firestore
        await setDoc(userRef, {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        
        return newUser;
      }
    } catch (error) {
      console.error('Error formatting user:', error);
      return null;
    }
  }, []);

  // Initialize auth state listener
  const initAuth = useCallback(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const formattedUser = await formatUser(firebaseUser);
          setUser(formattedUser);
          
          if (formattedUser) {
            try {
              await registerActivity(
                formattedUser.id,
                'login',
                'system',
                'auth',
                `User ${formattedUser.name} logged in`
              );
            } catch (activityError) {
              console.error('Failed to log login activity:', activityError);
            }
          }
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err: any) {
        setError(err);
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });
    
    return unsubscribe;
  }, [formatUser, registerActivity]);

  // Email/password login
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const formattedUser = await formatUser(result.user);
      return { user: formattedUser, session: null };
    } catch (err: any) {
      setError(err);
      console.error('Sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formatUser]);

  // Sign out
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        try {
          await registerActivity(
            user.id,
            'logout',
            'system',
            'auth',
            `User ${user.name} logged out`
          );
        } catch (activityError) {
          console.error('Failed to log logout activity:', activityError);
        }
      }
      
      await signOut(auth);
      setUser(null);
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Sign-out error:', err);
      return true;
    } finally {
      setLoading(false);
    }
  }, [user, registerActivity]);

  // Update user settings
  const updateUserSettings = useCallback(async (settings: { geminiApiKey?: string }) => {
    if (!user) return false;
    
    try {
      const userRef = doc(db, 'users', user.id);
      const updates: Record<string, any> = { updated_at: serverTimestamp() };
      
      if (settings.geminiApiKey !== undefined) {
        updates.gemini_api_key = settings.geminiApiKey;
        
        // Update local user state
        setUser(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            geminiApiKey: settings.geminiApiKey
          };
        });
        
        // Log activity
        try {
          const action = settings.geminiApiKey ? 'update' : 'delete';
          await registerActivity(
            user.id,
            action,
            'system',
            'settings',
            `User ${user.name} ${settings.geminiApiKey ? 'updated' : 'removed'} Gemini API key`
          );
        } catch (error) {
          console.error('Failed to log API key update activity:', error);
        }
      }
      
      await updateDoc(userRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
  }, [user, registerActivity]);

  // Log user activity
  const logActivity = useCallback(async (
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view', 
    resourceType: 'patient' | 'prescription' | 'user' | 'location' | 'system', 
    resourceId: string, 
    details?: string
  ) => {
    if (!user) return;
    
    await registerActivity(
      user.id,
      action,
      resourceType,
      resourceId,
      details
    );
  }, [user, registerActivity]);

  return {
    user,
    loading,
    error,
    initAuth,
    login,
    logout,
    updateUserSettings,
    logActivity
  };
}; 