export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'mphw' | 'admin';
  locationIds?: string[];
  password?: string; // Add optional password field for user creation/updates
  specialization?: string; // Add doctor specialization
  geminiApiKey?: string; // Gemini API key for AI features
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  uhid: string;
  mobile?: string;
  locationId: string;
  doctorId?: string;
  visitTag?: 'consultation' | 'review' | 'lab-result' | 'follow-up' | 'emergency';
  vitals: {
    hr: number; // Heart Rate
    bp: string; // Blood Pressure
    rr: number; // Respiratory Rate
    tp: number; // Temperature in Fahrenheit
    spo2: number; // Oxygen Saturation
    weight?: number; // Weight in kg
    height?: number; // Height in cm
  };
  history: string;
  complaints: string;
  doctorNotes?: string; // Added doctorNotes field
  status: 'waiting' | 'in-progress' | 'completed';
  documents?: PatientDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagnosis {
  name: string;
  probability: number;
  workup: string[];
  summary: string; // Added summary field
  icdCode?: string; 
  description?: string;
  additionalNotes?: string;
}

export interface WorkupParameter {
  id: string;
  type: "lab" | "clinical" | "imaging" | "other";
  name: string;
  value: string;
  diagnosisId: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  locationId: string;
  diagnoses: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  advice: string[];
  followUp: string;
  workupNotes?: {[key: string]: string};
  workupParameters?: WorkupParameter[];
  clinicalAssessment?: string;
  createdAt: Date;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
  documentType: 'lab-result' | 'prescription' | 'report' | 'image' | 'other';
  notes?: string;
}

export interface AIResponse {
  diagnoses: Diagnosis[];
  prescription: {
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[];
    advice: string[];
    followUp: string;
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
  resourceType: 'patient' | 'prescription' | 'user' | 'location' | 'system';
  resourceId: string;
  details: string;
  ipAddress?: string;
  createdAt: Date;
}
