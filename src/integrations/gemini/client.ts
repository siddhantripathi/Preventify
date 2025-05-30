import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API key from environment variables
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini client
export const getGeminiClient = (userApiKey?: string) => {
  // Use user's API key if provided, otherwise use default from .env
  const apiKey = userApiKey || DEFAULT_API_KEY;
  
  if (!apiKey) {
    console.error('No Gemini API key available');
    throw new Error('No Gemini API key available');
  }
  
  const client = new GoogleGenerativeAI(apiKey);
  return client;
};

// Get the Gemini Pro model
export const getGeminiProModel = (userApiKey?: string) => {
  const client = getGeminiClient(userApiKey);
  return client.getGenerativeModel({ model: 'gemini-1.5-pro' });
}; 