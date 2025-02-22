import { OpenAIStream, AnthropicStream } from 'ai';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse, GoogleGenerativeAIStream } from 'ai';
import { NextResponse } from 'next/server';
import { getValidatedApiKey } from '../../lib/utils/apiKeyValidation';
import { rateLimiter } from '../../lib/utils/rateLimiter';
import { AIProvider } from '../../lib/contexts/AIContext';

// Define feedback type contexts
const feedbackTypeContext = {
  'increase-protein': 'targeting optimal protein intake for muscle synthesis (1.6-2.2g per kg of body weight)',
  'increase-fiber': 'aiming for 25-35g of daily fiber intake for digestive health',
  'whole30': 'ensuring compliance with Whole30 guidelines (no grains, legumes, dairy, added sugars)',
  'reduce-calories': 'maintaining nutritional density while reducing overall caloric intake',
  'fat-loss': 'optimizing macronutrient ratios for fat loss while preserving muscle mass',
  'strength-gains': 'supporting muscle growth and recovery through optimal nutrition timing and composition'
};

// Define response format instructions
const formatInstructions = `
Provide friendly and contextual feedback in the following format:

Overview:
• Start with a brief, friendly acknowledgment of the meal/recipe shared
• Comment on the overall nutritional approach and positive aspects

Recommendations:
• Provide 3-5 specific, actionable suggestions that fit the meal context
• Each recommendation should include:
  - Direct modifications or additions to the current meal
  - Complementary food suggestions that fit the meal type
  - Specific portions or measurements where helpful
• Focus on the requested feedback types while maintaining meal-time appropriateness

Keep the tone encouraging and context-aware. If analyzing a breakfast, provide breakfast-appropriate suggestions. If it's a dinner recipe, focus on dinner-suitable modifications.`;

export const runtime = 'edge';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function generateWithRetry(provider: AIProvider, prompt: string, retries = 0) {
  try {
    if (!rateLimiter.canMakeRequest(provider)) {
      const waitTime = rateLimiter.getTimeUntilNextRequest(provider);
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    let response;
    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({
          apiKey: getValidatedApiKey('openai'),
        });

        response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly and knowledgeable nutritionist providing contextual feedback. Consider the type of meal (breakfast, lunch, dinner, snack) when making suggestions. Keep responses encouraging and practical. Focus on both direct improvements and complementary additions that make sense for the specific meal context.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          stream: true,
        });
        rateLimiter.addRequest(provider);
        return new StreamingTextResponse(OpenAIStream(response));
      }

      case 'anthropic': {
        // For now, fallback to OpenAI if Anthropic is selected
        const openai = new OpenAI({
          apiKey: getValidatedApiKey('openai'),
        });

        response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly and knowledgeable nutritionist providing contextual feedback. Consider the type of meal (breakfast, lunch, dinner, snack) when making suggestions. Keep responses encouraging and practical. Focus on both direct improvements and complementary additions that make sense for the specific meal context.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          stream: true,
        });
        rateLimiter.addRequest(provider);
        return new StreamingTextResponse(OpenAIStream(response));
      }

      case 'gemini': {
        const genAI = new GoogleGenerativeAI(getValidatedApiKey('gemini'));
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        response = await model.generateContentStream(
          `You are a friendly and knowledgeable nutritionist providing contextual feedback. Consider the type of meal (breakfast, lunch, dinner, snack) when making suggestions. Keep responses encouraging and practical. Focus on both direct improvements and complementary additions that make sense for the specific meal context. ${prompt}`
        );
        rateLimiter.addRequest(provider);
        return new StreamingTextResponse(GoogleGenerativeAIStream(response));
      }

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error: any) {
    console.error('Error in generateWithRetry:', error);
    if (retries < MAX_RETRIES && (
      error.status === 429 || // Rate limit
      error.status === 503 || // Service unavailable
      error.status === 502    // Bad gateway
    )) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
      return generateWithRetry(provider, prompt, retries + 1);
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { provider, inputMethod, inputData, feedbackTypes } = await req.json();

    if (!provider) {
      return NextResponse.json(
        { error: 'AI provider not specified' },
        { status: 400 }
      );
    }

    if (!['openai', 'anthropic', 'gemini'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid AI provider specified' },
        { status: 400 }
      );
    }

    // Get context for selected feedback types
    const feedbackContext = feedbackTypes
      .map(type => feedbackTypeContext[type])
      .join('. ');

    let prompt = '';
    if (inputMethod.includes('image')) {
      prompt = `Analyze this meal/recipe image and provide concise feedback.

Focus Areas: ${feedbackTypes.join(', ')}

Context: ${feedbackContext}

${formatInstructions}`;
    } else {
      const mealOrRecipe = inputMethod === 'meal-text' ? 'meal' : 'recipe';
      prompt = `Analyze this ${mealOrRecipe} and provide concise feedback.

Input: ${inputData}

Focus Areas: ${feedbackTypes.join(', ')}

Context: ${feedbackContext}

${formatInstructions}`;
    }

    return await generateWithRetry(provider as AIProvider, prompt);
  } catch (error: any) {
    console.error('Error in feedback generation:', error);
    
    let statusCode = 500;
    let errorMessage = 'Error generating feedback';

    if (error.message.includes('Rate limit exceeded')) {
      statusCode = 429;
      errorMessage = error.message;
    } else if (error.message.includes('Invalid or missing API key')) {
      statusCode = 401;
      errorMessage = 'Invalid API key configuration';
    } else if (error.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 