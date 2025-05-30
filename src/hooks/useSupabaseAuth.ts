
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from './useActivityLogger';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';
import { useSupabaseUser } from './useSupabaseUser';
import { useSupabaseSession } from './useSupabaseSession';
import { useUserProfileUpdate } from './useUserProfileUpdate';

export const useSupabaseAuth = () => {
  const { user, setUser } = useSupabaseUser();
  const { session, setSession } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { registerActivity } = useActivityLogger();

  // Initialize auth state
  const initAuth = useCallback(async () => {
    try {
      setLoading(true);
      // Check if there's a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;
        if (userData) {
          const appUser: User = {
            id: userData.id,
            name: userData.name,
            email: session.user.email || '',
            role: userData.role as 'doctor' | 'mphw' | 'admin',
            specialization: userData.specialization || undefined,
            openaiApiKey: userData.openai_api_key || undefined
          };
          setUser(appUser);

          if (appUser.openaiApiKey) {
            localStorage.setItem('openai_api_key', appUser.openaiApiKey);
          }
          await registerActivity(
            appUser.id,
            'login',
            'system',
            'auth',
            `User ${appUser.name} logged in`
          );
        }
      }
      setInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [registerActivity, setUser]);

  // Update user profile (imported logic)
  const updateUserProfile = useUserProfileUpdate(user, setUser);

  // Fetch user data by ID and email
  const fetchUserData = useCallback(async (userId: string, email: string | undefined) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        const appUser: User = {
          id: data.id,
          name: data.name,
          email: email || '',
          role: data.role as 'doctor' | 'mphw' | 'admin',
          specialization: data.specialization || undefined,
          openaiApiKey: data.openai_api_key || undefined
        };
        setUser(appUser);

        if (appUser.openaiApiKey) {
          localStorage.setItem('openai_api_key', appUser.openaiApiKey);
        }
        return appUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, [setUser]);

  // Sign in function
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (error) {
        throw error;
      }
      return data;
    } catch (err: any) {
      setError(err);
      console.error('Sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out function
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
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Supabase sign-out error:', signOutError);
      }
      setUser(null);
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Sign-out error:', err);
      return true;
    } finally {
      setLoading(false);
    }
  }, [user, registerActivity, setUser]);

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

  // Update user settings
  const updateUserSettings = useCallback(async (settings: { openaiApiKey?: string }) => {
    if (!user) return false;
    if (settings.openaiApiKey !== undefined) {
      try {
        const action = settings.openaiApiKey ? 'update' : 'delete';
        await logActivity(
          action as any,
          'system',
          'settings',
          `User ${user.name} ${settings.openaiApiKey ? 'updated' : 'removed'} OpenAI API key`
        );
      } catch (error) {
        console.error('Failed to log API key update activity:', error);
      }
    }
    return await updateUserProfile({
      openaiApiKey: settings.openaiApiKey
    });
  }, [user, updateUserProfile, logActivity]);

  // Set session function
  return {
    user,
    loading,
    error,
    initialized,
    initAuth,
    signIn: login,
    signOut: logout,
    updateUserProfile,
    fetchUserData,
    registerActivity,
    setLoading,
    login,
    logout,
    setUser,
    setSession,
    logActivity,
    updateUserSettings
  };
};
