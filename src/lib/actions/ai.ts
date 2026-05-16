'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { incrementAiUsage } from './notes';

export async function processWithAI(action: 'summarize' | 'action-items' | 'suggest-title', content: string) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API Key is not configured correctly. Please add a valid key to .env.local');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // List of models to try in order of preference
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro',
    'gemini-pro'
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      // We know 2.5 works on v1beta by default in the SDK, but we set v1 previously. 
      // The SDK defaults to v1beta unless specified. We will remove the explicit { apiVersion: 'v1' } 
      // because 2.5 might only exist in v1beta right now.
      const model = genAI.getGenerativeModel({ model: modelName });
      
      let prompt = '';
      if (action === 'summarize') {
        prompt = `Summarize the following note concisely in a single paragraph, highlighting the core ideas.\n\nNote:\n${content}`;
      } else if (action === 'action-items') {
        prompt = `Extract all actionable items from the following note. Return them as a markdown bulleted list. If there are no obvious action items, suggest a few logical next steps based on the context.\n\nNote:\n${content}`;
      } else if (action === 'suggest-title') {
        prompt = `Based on the following note content, suggest a concise, creative, and relevant title (maximum 6 words). Return ONLY the title text.\n\nNote:\n${content}`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Track usage
      await incrementAiUsage();
      
      return text;
    } catch (error: any) {
      console.warn(`Gemini model ${modelName} (v1) failed:`, error.message);
      lastError = error;
      
      if (error.status === 401 || error.status === 403) {
        break; 
      }
      continue;
    }
  }

  // If we reach here, all models failed
  console.error('All Gemini models failed. Last error:', lastError);
  const errorMessage = lastError?.message || 'Unknown error';
  throw new Error(`AI Processing failed for all available models. Last error: ${errorMessage}. Please check your API key and quota.`);
}
