import { useCallback } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

/**
 * Hook for logging user activity in the application
 */
export const useActivityLogger = () => {
  const registerActivity = useCallback(async (
    userId: string,
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view',
    resourceType: 'patient' | 'prescription' | 'user' | 'location' | 'system',
    resourceId: string,
    details?: string
  ) => {
    try {
      // Create activity log entry in Firestore
      await addDoc(collection(db, 'activity_logs'), {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || '',
        created_at: serverTimestamp()
      });
      
      console.log(`Activity logged: ${action} on ${resourceType} ${resourceId}`);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, []);

  return { registerActivity };
};
