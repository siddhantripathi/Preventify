import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Location, User, ActivityLog } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  locations: Location[];
  users: User[];
  activityLogs: ActivityLog[];
  currentLocation: Location | null;
  addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLocation: (id: string, locationData: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  assignUserToLocation: (userId: string, locationId: string) => void;
  removeUserFromLocation: (userId: string, locationId: string) => void;
  setCurrentLocation: (location: Location | null) => void;
  getUsersByLocation: (locationId: string) => User[];
  logActivity: (logData: Omit<ActivityLog, 'id' | 'createdAt'>) => void;
}

const AdminContext = createContext<AdminContextType>({
  locations: [],
  users: [],
  activityLogs: [],
  currentLocation: null,
  addLocation: () => {},
  updateLocation: () => {},
  deleteLocation: () => {},
  addUser: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
  assignUserToLocation: () => {},
  removeUserFromLocation: () => {},
  setCurrentLocation: () => {},
  getUsersByLocation: () => [],
  logActivity: () => {},
});

export const useAdmin = () => useContext(AdminContext);

// Mock locations for demo
const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Main Hospital',
    address: '123 Healthcare St',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactNumber: '+91-9876543210',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Rural Clinic',
    address: '456 Village Rd',
    city: 'Pune',
    state: 'Maharashtra',
    contactNumber: '+91-9876543211',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      console.log('Fetching users data from Supabase');
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
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
          locationIds: [], // Will be populated elsewhere if needed
        }));
        
        setUsers(mappedUsers);
      } else {
        console.log('No users data returned from Supabase');
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  // Fetch user locations and merge them with user data
  const fetchUserLocations = async () => {
    try {
      if (users.length === 0) return;
      
      console.log('Fetching user locations');
      const { data, error } = await supabase
        .from('user_locations')
        .select('*');
      
      if (error) {
        console.error('Error fetching user locations:', error);
        return;
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
        setUsers(prev => prev.map(user => ({
          ...user,
          locationIds: userLocationMap[user.id] || [],
        })));
      }
    } catch (error) {
      console.error('Error in fetchUserLocations:', error);
    }
  };

  // Effect to load initial data when auth state changes
  useEffect(() => {
    console.log('Auth state changed in AdminContext, user:', user?.id);
    
    // Only fetch data if user is authenticated
    if (user) {
      fetchUsers().then(() => {
        // Fetch user locations after users are loaded
        fetchUserLocations();
      });
      
      const storedLocations = localStorage.getItem('preventify_locations');
      const storedLogs = localStorage.getItem('preventify_activity_logs');
      
      if (storedLocations) {
        try {
          const parsedLocations = JSON.parse(storedLocations);
          // Convert string dates back to Date objects
          const locationsWithDates = parsedLocations.map((l: any) => ({
            ...l,
            createdAt: new Date(l.createdAt),
            updatedAt: new Date(l.updatedAt),
          }));
          setLocations(locationsWithDates);
        } catch (e) {
          console.error('Error parsing stored locations:', e);
          setLocations(MOCK_LOCATIONS);
        }
      } else {
        setLocations(MOCK_LOCATIONS);
      }
      
      if (storedLogs) {
        try {
          const parsedLogs = JSON.parse(storedLogs);
          const logsWithDates = parsedLogs.map((l: any) => ({
            ...l,
            createdAt: new Date(l.createdAt),
          }));
          setActivityLogs(logsWithDates);
        } catch (e) {
          console.error('Error parsing stored logs:', e);
          setActivityLogs([]);
        }
      }
    } else {
      // Clear data when user logs out
      setUsers([]);
    }
  }, [user]); // This will re-run when auth state changes

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem('preventify_locations', JSON.stringify(locations));
    }
  }, [locations]);

  useEffect(() => {
    if (activityLogs.length > 0) {
      localStorage.setItem('preventify_activity_logs', JSON.stringify(activityLogs));
    }
  }, [activityLogs]);

  const addLocation = (locationData: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newLocation: Location = {
      ...locationData,
      id: `location-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    setLocations(prev => [...prev, newLocation]);
    
    // Log the activity
    logActivity({
      userId: user?.id || 'system',
      action: 'create',
      resourceType: 'location',
      resourceId: newLocation.id,
      details: `Created new location: ${newLocation.name}`,
    });
    
    toast({
      title: "Location added",
      description: `${locationData.name} has been added successfully.`,
    });
  };

  const updateLocation = (id: string, locationData: Partial<Location>) => {
    setLocations(prev =>
      prev.map(loc =>
        loc.id === id
          ? { ...loc, ...locationData, updatedAt: new Date() }
          : loc
      )
    );
    
    logActivity({
      userId: user?.id || 'system',
      action: 'update',
      resourceType: 'location',
      resourceId: id,
      details: `Updated location information`,
    });
    
    toast({
      title: "Location updated",
      description: "The location has been updated successfully.",
    });
  };

  const deleteLocation = (id: string) => {
    const locationToDelete = locations.find(loc => loc.id === id);
    
    if (!locationToDelete) {
      toast({
        title: "Error",
        description: "Location not found.",
        variant: "destructive",
      });
      return;
    }
    
    setLocations(prev => prev.filter(loc => loc.id !== id));
    
    logActivity({
      userId: user?.id || 'system',
      action: 'delete',
      resourceType: 'location',
      resourceId: id,
      details: `Deleted location: ${locationToDelete.name}`,
    });
    
    toast({
      title: "Location deleted",
      description: `${locationToDelete.name} has been deleted.`,
    });
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      if (!userData.password) {
        toast({
          title: "Error",
          description: "Password is required for new users",
          variant: "destructive",
        });
        return;
      }

      // Instead of directly calling Supabase auth APIs, use the edge function
      // Get the user's auth token to authenticate the request
      const { data: authData } = await supabase.auth.getSession();

      // Call the edge function to create the user
      const response = await fetch(`https://zpqcjajxunfmvzlewmvh.supabase.co/functions/v1/admin-create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.session?.access_token}`
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
          specialization: userData.specialization,
          locationIds: userData.locationIds
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();

      // Refresh users list
      await fetchUsers();
      await fetchUserLocations();
      
      logActivity({
        userId: user?.id || 'system',
        action: 'create',
        resourceType: 'user',
        resourceId: newUser.id,
        details: `Created new user: ${userData.name} (${userData.role})`,
      });
      
      toast({
        title: "User added",
        description: `${userData.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error('Error in addUser:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      // Update user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          specialization: userData.specialization,
        })
        .eq('id', id);

      if (profileError) {
        console.error("Error updating user profile:", profileError);
        toast({
          title: "Error",
          description: profileError.message || "Failed to update user profile",
          variant: "destructive",
        });
        return;
      }

      // Update password if provided
      if (userData.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          id,
          { password: userData.password }
        );

        if (passwordError) {
          console.error("Error updating password:", passwordError);
          toast({
            title: "Error",
            description: passwordError.message || "Failed to update password",
            variant: "destructive",
          });
          return;
        }
      }

      // Update location assignments if provided
      if (userData.locationIds) {
        // First, remove all existing location assignments for this user
        await supabase
          .from('user_locations')
          .delete()
          .eq('user_id', id);

        // Then, add the new location assignments
        for (const locationId of userData.locationIds) {
          await supabase
            .from('user_locations')
            .insert({
              user_id: id,
              location_id: locationId,
            });
        }
      }

      // Refresh users list
      await fetchUsers();
      await fetchUserLocations();
      
      logActivity({
        userId: user?.id || 'system',
        action: 'update',
        resourceType: 'user',
        resourceId: id,
        details: `Updated user information`,
      });
      
      toast({
        title: "User updated",
        description: "The user has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error in updateUser:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const userToDelete = users.find(u => u.id === id);
      
      if (!userToDelete) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        });
        return;
      }

      // Delete the user from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
        return;
      }

      // Refresh users list
      await fetchUsers();
      await fetchUserLocations();
      
      logActivity({
        userId: user?.id || 'system',
        action: 'delete',
        resourceType: 'user',
        resourceId: id,
        details: `Deleted user: ${userToDelete.name}`,
      });
      
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const assignUserToLocation = (userId: string, locationId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const locationIds = u.locationIds || [];
          if (!locationIds.includes(locationId)) {
            return {
              ...u,
              locationIds: [...locationIds, locationId],
            };
          }
        }
        return u;
      })
    );
    
    logActivity({
      userId: user?.id || 'system',
      action: 'update',
      resourceType: 'user',
      resourceId: userId,
      details: `Assigned user to location: ${locationId}`,
    });
    
    toast({
      title: "User assigned",
      description: "The user has been assigned to the location.",
    });
  };

  const removeUserFromLocation = (userId: string, locationId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId && u.locationIds) {
          return {
            ...u,
            locationIds: u.locationIds.filter(id => id !== locationId),
          };
        }
        return u;
      })
    );
    
    logActivity({
      userId: user?.id || 'system',
      action: 'update',
      resourceType: 'user',
      resourceId: userId,
      details: `Removed user from location: ${locationId}`,
    });
    
    toast({
      title: "User removed",
      description: "The user has been removed from the location.",
    });
  };

  const getUsersByLocation = (locationId: string) => {
    return users.filter(u => 
      u.locationIds && u.locationIds.includes(locationId)
    );
  };

  const logActivity = (logData: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `log-${Date.now()}`,
      createdAt: new Date(),
    };

    setActivityLogs(prev => [...prev, newLog]);
  };

  return (
    <AdminContext.Provider
      value={{
        locations,
        users,
        activityLogs,
        currentLocation,
        addLocation,
        updateLocation,
        deleteLocation,
        addUser,
        updateUser,
        deleteUser,
        assignUserToLocation,
        removeUserFromLocation,
        setCurrentLocation,
        getUsersByLocation,
        logActivity,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
