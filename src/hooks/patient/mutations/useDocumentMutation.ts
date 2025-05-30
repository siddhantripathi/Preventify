
import { useCallback } from 'react';
import { PatientDocument } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  addDocumentToPatientInDb,
  deletePatientDocumentInDb
} from '@/services/patients/patientDocumentService';

export const useDocumentMutation = (
  documents: PatientDocument[],
  setDocuments: React.Dispatch<React.SetStateAction<PatientDocument[]>>
) => {
  const { user, registerActivity } = useAuth();
  const { toast } = useToast();

  // Add document to patient
  const addDocumentToPatient = useCallback(async (patientId: string, document: Partial<PatientDocument>) => {
    if (!user) return null;

    try {
      const newDocument = await addDocumentToPatientInDb(patientId, document, user.id, registerActivity);
      
      // Update local state
      setDocuments(prev => [newDocument, ...prev]);

      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, registerActivity, toast, setDocuments]);

  // Delete patient document
  const deletePatientDocument = useCallback(async (documentId: string) => {
    if (!user) return;

    try {
      const documentToDelete = documents.find(d => d.id === documentId);
      if (!documentToDelete) return;

      await deletePatientDocumentInDb(documentId, registerActivity);

      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== documentId));

      toast({
        title: 'Document Deleted',
        description: 'The document has been removed.'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive'
      });
    }
  }, [user, documents, registerActivity, toast, setDocuments]);

  return { addDocumentToPatient, deletePatientDocument };
};
