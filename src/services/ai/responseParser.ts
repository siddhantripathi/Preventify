import { AIResponse } from '@/types';

export const parseAIResponse = (aiContent: string): AIResponse => {
  try {
    // Extract JSON from the response (in case there's additional text)
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response');
    }
    
    const jsonContent = jsonMatch[0];
    const parsedData = JSON.parse(jsonContent);
    
    // Validate the structure
    if (!parsedData.diagnoses || !Array.isArray(parsedData.diagnoses) || !parsedData.prescription) {
      throw new Error('Invalid response structure');
    }
    
    // Format the response to match our AIResponse type
    return {
      diagnoses: parsedData.diagnoses.map((d: any) => ({
        name: d.name,
        probability: d.probability,
        icdCode: d.icdCode || '',  // Add ICD code
        workup: Array.isArray(d.workup) ? d.workup : [],
        summary: d.summary || '',
      })).slice(0, 5), // Ensure we only take the top 5
      prescription: {
        medications: parsedData.prescription.medications || [],
        advice: parsedData.prescription.advice || [],
        followUp: parsedData.prescription.followUp || "2 weeks"
      }
    };
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error('Failed to parse AI response JSON');
  }
};

// Keep the old function name for backward compatibility
export const parseOpenAIResponse = parseAIResponse;
