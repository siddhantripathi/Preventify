
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useSupabaseData<T>(
  tableName: string,
  options?: {
    select?: string;
    filters?: { column: string; value: any; operator?: string }[];
    limit?: number;
    order?: { column: string; ascending?: boolean };
    relationTable?: string;
    relationSelect?: string;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, registerActivity } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use type assertion for the dynamic table name
      let query = supabase
        .from(tableName as any)
        .select(options?.select || '*');

      // Apply filters
      if (options?.filters) {
        for (const filter of options.filters) {
          const operator = filter.operator || 'eq';
          if (operator === 'eq') {
            query = query.eq(filter.column, filter.value);
          } else if (operator === 'neq') {
            query = query.neq(filter.column, filter.value);
          } else if (operator === 'gt') {
            query = query.gt(filter.column, filter.value);
          } else if (operator === 'lt') {
            query = query.lt(filter.column, filter.value);
          } else if (operator === 'gte') {
            query = query.gte(filter.column, filter.value);
          } else if (operator === 'lte') {
            query = query.lte(filter.column, filter.value);
          } else if (operator === 'in') {
            query = query.in(filter.column, filter.value);
          } else if (operator === 'like') {
            query = query.like(filter.column, `%${filter.value}%`);
          }
        }
      }

      // Apply order
      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setData(data as T[]);
      
      // Log view activity
      registerActivity('view', tableName as any, tableName, `Viewed ${tableName} data`);
    } catch (err: any) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tableName, options, user, registerActivity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = async (item: Partial<T>) => {
    if (!user) return null;

    try {
      // Convert camelCase to snake_case for Supabase
      const formattedItem = Object.entries(item).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return { ...acc, [snakeKey]: value };
      }, {});

      const { data, error } = await supabase
        .from(tableName as any)
        .insert(formattedItem as any)
        .select();

      if (error) {
        throw error;
      }

      // Convert back from snake_case to camelCase for the app
      const formattedData = convertToCamelCase(data[0]);
      
      setData(prevData => [...prevData, formattedData as T]);
      
      // Log create activity
      registerActivity('create', tableName as any, (formattedData as any)?.id || 'unknown', `Created new ${tableName} record`);
      
      return formattedData as T;
    } catch (err: any) {
      console.error(`Error creating ${tableName}:`, err);
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    if (!user) return null;

    try {
      // Convert camelCase to snake_case for Supabase
      const formattedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return { ...acc, [snakeKey]: value };
      }, {});

      const { data, error } = await supabase
        .from(tableName as any)
        .update(formattedUpdates as any)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Convert back from snake_case to camelCase for the app
      const formattedData = convertToCamelCase(data[0]);
      
      setData(prevData => prevData.map(item => 
        (item as any).id === id ? formattedData as T : item
      ));
      
      // Log update activity
      registerActivity('update', tableName as any, id, `Updated ${tableName} record`);
      
      return formattedData as T;
    } catch (err: any) {
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setData(prevData => prevData.filter(item => (item as any).id !== id));
      
      // Log delete activity
      registerActivity('delete', tableName as any, id, `Deleted ${tableName} record`);
      
      return true;
    } catch (err: any) {
      console.error(`Error deleting ${tableName}:`, err);
      throw err;
    }
  };

  // Helper function to convert snake_case to camelCase
  const convertToCamelCase = (obj: any) => {
    if (!obj) return obj;
    
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      return { ...acc, [camelKey]: value };
    }, {});
  };
  
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    createItem,
    updateItem,
    deleteItem
  };
}

// Hook for uploading files to Supabase Storage
export function useSupabaseStorage() {
  const { user, registerActivity } = useAuth();

  const uploadFile = async (
    bucket: string,
    filePath: string,
    file: File,
    metadata?: Record<string, string>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
          ...(metadata ? { metadata } : {})
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Log activity
      registerActivity(
        'create',
        'storage',
        data.path,
        `Uploaded file ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
      );

      return {
        path: data.path,
        publicUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const deleteFile = async (bucket: string, filePath: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      // Log activity
      registerActivity(
        'delete',
        'storage',
        filePath,
        `Deleted file ${filePath}`
      );

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  return { uploadFile, deleteFile };
}
