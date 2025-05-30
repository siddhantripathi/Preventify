import { doc, setDoc, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { PatientDocument } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const addDocumentToPatientInDb = async (
  patientId: string,
  document: Partial<PatientDocument>,
  userId: string,
  registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>
) => {
  try {
    const documentId = uuidv4();
    const now = new Date();

    // Create a new document in the patient_documents collection
    const documentRef = doc(collection(db, 'patient_documents'), documentId);
    
    // Firestore doesn't accept undefined values, replace with null or empty values
    await setDoc(documentRef, {
      patient_id: patientId,
      file_name: document.fileName || 'Unnamed Document',
      file_type: document.fileType || 'application/octet-stream',
      file_size: document.fileSize || 0,
      file_url: document.fileUrl || '',
      uploaded_by: userId,
      uploaded_at: serverTimestamp(),
      document_type: document.documentType || 'other',
      notes: document.notes || ''
    });

    await registerActivity('create', 'document', documentId, `Added document ${document.fileName} to patient record`);

    return {
      id: documentId,
      patientId,
      fileName: document.fileName || 'Unnamed Document',
      fileType: document.fileType || 'application/octet-stream',
      fileSize: document.fileSize || 0,
      fileUrl: document.fileUrl || '',
      uploadedBy: userId,
      uploadedAt: now,
      documentType: document.documentType || 'other',
      notes: document.notes || ''
    } as PatientDocument;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const deletePatientDocumentInDb = async (
  documentId: string,
  registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>
) => {
  try {
    // Delete the document from Firestore
    const documentRef = doc(db, 'patient_documents', documentId);
    await deleteDoc(documentRef);

    await registerActivity('delete', 'document', documentId, `Deleted document from patient record`);

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
