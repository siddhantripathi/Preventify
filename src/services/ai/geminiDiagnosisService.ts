import { AIResponse, Patient } from '@/types';
import { generatePromptFromPatient } from './promptGenerator';
import { parseAIResponse } from './responseParser';
import { generateMockDiagnosisAndPrescription } from './mockDiagnosisService';
import { toast } from "@/hooks/use-toast";
import { getGeminiProModel } from '@/integrations/gemini/client';

export const generateDiagnosisAndPrescription = async (
  patient: Patient,
  userApiKey?: string
): Promise<AIResponse> => {
  console.log('Generating diagnosis for patient:', patient);
  
  try {
    const prompt = generatePromptFromPatient(patient);
    
    // Get the Gemini model with user's API key or fallback to .env
    const geminiProModel = getGeminiProModel(userApiKey);
    
    // Generate content with Gemini
    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    const aiContent = response.text();
    
    try {
      // Parse the response
      const parsedResponse = parseAIResponse(aiContent);
      
      // Ensure we have exactly 5 diagnoses, adding placeholders if needed
      if (parsedResponse.diagnoses.length < 5) {
        const placeholdersNeeded = 5 - parsedResponse.diagnoses.length;
        for (let i = 0; i < placeholdersNeeded; i++) {
          parsedResponse.diagnoses.push({
            name: `Other possible diagnosis ${i+1}`,
            probability: 0.1,
            icdCode: '',
            workup: [],
            summary: 'Low probability differential diagnosis'
          });
        }
      }
      
      // Limit to exactly 5 diagnoses
      parsedResponse.diagnoses = parsedResponse.diagnoses.slice(0, 5);
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    toast({
      title: "AI Diagnosis Error",
      description: "Could not connect to Gemini. Using mock data instead.",
      variant: "destructive"
    });
    return generateMockDiagnosisAndPrescription(patient);
  }
}; 