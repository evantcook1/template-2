export const runtime = 'edge';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { getValidatedApiKey } from '../../lib/utils/apiKeyValidation';
import { rateLimiter } from '../../lib/utils/rateLimiter';
import { AIProvider } from '../../lib/contexts/AIContext';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Defines the context for different feedback types
 * Each key represents a feedback type ID, and the value is the context provided to the AI
 */
const feedbackTypeContext: Record<string, string> = {
  'increase-protein': 'targeting optimal protein intake for muscle synthesis (1.6-2.2g per kg of body weight)',
  'increase-fiber': 'aiming for 25-35g of daily fiber intake for digestive health',
  'whole30': 'ensuring compliance with Whole30 guidelines (no grains, legumes, dairy, added sugars)',
  'reduce-calories': 'maintaining nutritional density while reducing overall caloric intake',
  'fat-loss': 'optimizing macronutrient ratios for fat loss while preserving muscle mass',
  'strength-gains': 'supporting muscle growth and recovery through optimal nutrition timing and composition'
};

/**
 * Tool declaration for structured meal analysis
 * This defines the structure for the AI to provide structured feedback
 */
const mealAnalysisTool = {
  functionDeclarations: [{
    name: "analyze_meal",
    description: "Analyzes meal nutritional content and provides structured feedback",
    parameters: {
      type: "object",
      properties: {
        overview: {
          type: "string",
          description: "General overview of the meal's nutritional value"
        },
        estimatedNutrition: {
          type: "object",
          properties: {
            calories: { type: "number" },
            protein: { type: "number" },
            carbs: { type: "number" },
            fats: { type: "number" }
          }
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
          description: "List of 3-5 specific recommendations"
        },
        contextualFeedback: {
          type: "array",
          items: { type: "string" },
          description: "Feedback specific to selected dietary goals"
        }
      },
      required: ["overview", "recommendations"]
    }
  }]
};

/**
 * Generates a response from the Gemini AI model with retry capability
 * 
 * @param {AIProvider} provider - The AI provider to use (currently only 'gemini' is supported)
 * @param {string} prompt - The text prompt to send to the AI
 * @param {string | null} image - Optional base64-encoded image data
 * @param {number} retries - Current retry count (used internally for recursion)
 * @returns {Promise<Response>} A streaming response from the AI or an error response
 */
async function generateWithRetry(provider: AIProvider, prompt: string, image: string | null = null, retries = 0) {
  try {
    if (!rateLimiter.canMakeRequest(provider)) {
      const waitTime = rateLimiter.getTimeUntilNextRequest(provider);
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    const apiKey = getValidatedApiKey('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please check your environment variables.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash'
    });

    const parts = [];
    
    // Add the text prompt
    parts.push({ text: prompt });
    
    // Add the image if provided
    if (image) {
      parts.push({
        inlineData: {
          data: image,
          mimeType: 'image/jpeg'
        }
      });
    }

    // Use streaming for better user experience
    const result = await model.generateContentStream({
      contents: [{
        role: 'user',
        parts
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    rateLimiter.addRequest(provider);

    // Return a properly formatted streaming response
    return new StreamingTextResponse(GoogleGenerativeAIStream(result));

  } catch (error: any) {
    console.error('Error in generateWithRetry:', error);
    if (retries < MAX_RETRIES && (
      error.status === 429 || // Rate limit
      error.status === 503 || // Service unavailable
      error.status === 502    // Bad gateway
    )) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return generateWithRetry(provider, prompt, image, retries + 1);
    }

    // Return a proper error response that won't trigger streaming issues
    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST handler for the feedback API endpoint
 * Processes meal/recipe input (text or image) and generates nutritional feedback
 * 
 * @param {Request} req - The incoming request object
 * @returns {Promise<Response>} A streaming response with AI-generated feedback or an error response
 */
export async function POST(req: Request) {
  try {
    const { text, image, feedbackTypes } = await req.json();
    const provider = 'gemini';

    if (!text && !image) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const selectedFeedbackTypes = Array.isArray(feedbackTypes) ? feedbackTypes : [];
    const feedbackContexts = selectedFeedbackTypes
      .map((type: keyof typeof feedbackTypeContext) => feedbackTypeContext[type])
      .filter(Boolean)
      .join(', ');

    const prompt = `As a friendly and knowledgeable nutritionist, analyze this meal${image ? ' and its image' : ''} and provide structured feedback. Consider the meal context and the following dietary goals: ${feedbackContexts}. 
    
    Meal Input: ${text}
    
    Provide specific, actionable recommendations that are practical and encouraging. Consider portion sizes, nutrient balance, and timing of the meal.`;

    return await generateWithRetry(provider, prompt, image);

  } catch (error: any) {
    console.error('Error in feedback generation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate feedback' },
      { status: error.status || 500 }
    );
  }
} 