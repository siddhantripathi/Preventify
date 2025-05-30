
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users data from Supabase');
      
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        setError(error);
        return null;
      }
      
      if (data) {
        console.log('Users data fetched successfully:', data.length, 'users');
        // Map Supabase users to our User type
        const mappedUsers: User[] = data.map(user => ({
          id: user.id,
          name: user.name,
          email: '', // We'll need to fetch this separately if needed
          role: user.role as 'doctor' | 'mphw' | 'admin',
          specialization: user.specialization,
          locationIds: [], // Will be populated by fetchUserLocations
        }));
        
        return mappedUsers;
      } else {
        console.log('No users data returned from Supabase');
        return null;
      }
    } catch (error: any) {
      console.error('Error in fetchUsers:', error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLocations = async (fetchedUsers: User[]) => {
    try {
      if (!fetchedUsers || fetchedUsers.length === 0) return fetchedUsers;
      
      console.log('Fetching user locations');
      const { data, error } = await supabase
        .from('user_locations')
        .select('*');
      
      if (error) {
        console.error('Error fetching user locations:', error);
        return fetchedUsers;
      }
      
      if (data && data.length > 0) {
        console.log('User locations fetched successfully:', data.length, 'associations');
        // Create a map of user IDs to their location IDs
        const userLocationMap: Record<string, string[]> = {};
        
        data.forEach(record => {
          if (record.user_id) {
            if (!userLocationMap[record.user_id]) {
              userLocationMap[record.user_id] = [];
            }
            userLocationMap[record.user_id].push(record.location_id);
          }
        });
        
        // Update users with their location IDs
        return fetchedUsers.map(user => ({
          ...user,
          locationIds: userLocationMap[user.id] || [],
        }));
      }
      
      return fetchedUsers;
    } catch (error) {
      console.error('Error in fetchUserLocations:', error);
      return fetchedUsers;
    }
  };

  const refreshUserData = async () => {
    const fetchedUsers = await fetchUsers();
    if (fetchedUsers) {
      const usersWithLocations = await fetchUserLocations(fetchedUsers);
      setUsers(usersWithLocations);
    }
  };

  // Fetch data whenever auth state changes
  useEffect(() => {
    if (user) {
      refreshUserData();
    } else {
      setUsers([]);
    }
  }, [user]);

  return {
    users,
    loading,
    error,
    refreshUserData
  };
}
