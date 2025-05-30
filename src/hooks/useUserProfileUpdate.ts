
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export function useUserProfileUpdate(user: User | null, setUser: (u: User | null) => void) {
  // Logic to update user profile from the original file, now isolated for re-use
  return useCallback(
    async (updates: Partial<User>) => {
      if (!user) throw new Error('No user logged in');
      try {
        const supabaseUpdates: any = {};
        if (updates.name) supabaseUpdates.name = updates.name;
        if (updates.specialization !== undefined) supabaseUpdates.specialization = updates.specialization;
        if (updates.openaiApiKey !== undefined) supabaseUpdates.openai_api_key = updates.openaiApiKey;
        const { error } = await supabase
          .from('users')
          .update(supabaseUpdates)
          .eq('id', user.id);
        if (error) throw error;
        
        // Fix: Update the user object directly instead of using a function
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        // localStorage update if API key
        if (updates.openaiApiKey !== undefined) {
          if (updates.openaiApiKey) {
            localStorage.setItem('openai_api_key', updates.openaiApiKey);
          } else {
            localStorage.removeItem('openai_api_key');
          }
        }
        return true;
      } catch (error) {
        console.error('Failed to update user profile:', error);
        return false;
      }
    },
    [user, setUser]
  );
}
