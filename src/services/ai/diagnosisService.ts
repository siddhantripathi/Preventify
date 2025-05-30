import { AIResponse, Patient } from '@/types';
import { generateDiagnosisAndPrescription as generateGeminiDiagnosis } from './geminiDiagnosisService';
import { generatePromptFromPatient } from './promptGenerator';
import { parseOpenAIResponse } from './responseParser';
import { generateMockDiagnosisAndPrescription } from './mockDiagnosisService';
import { toast } from "@/hooks/use-toast";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const generateDiagnosisAndPrescription = async (
  patient: Patient
): Promise<AIResponse> => {
  // Use the Gemini-based diagnosis service
  return generateGeminiDiagnosis(patient);
};
