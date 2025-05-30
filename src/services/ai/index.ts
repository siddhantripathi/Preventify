// Main entry point for AI services
import { generateDiagnosisAndPrescription as geminiFn } from './geminiDiagnosisService';
import { AIResponse, Patient } from '@/types';

// Export the main function
export const generateDiagnosisAndPrescription = async (
  patient: Patient,
  userApiKey?: string
): Promise<AIResponse> => {
  return geminiFn(patient, userApiKey);
};
