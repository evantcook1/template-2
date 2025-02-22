import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream } from 'ai';
import { NextResponse } from 'next/server';
import { getValidatedApiKey } from '../../lib/utils/apiKeyValidation';
import { rateLimiter } from '../../lib/utils/rateLimiter';
import { AIProvider } from '../../lib/contexts/AIContext';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Define feedback type contexts
const feedbackTypeContext: Record<string, string> = {
  'increase-protein': 'targeting optimal protein intake for muscle synthesis (1.6-2.2g per kg of body weight)',
  'increase-fiber': 'aiming for 25-35g of daily fiber intake for digestive health',
  'whole30': 'ensuring compliance with Whole30 guidelines (no grains, legumes, dairy, added sugars)',
  'reduce-calories': 'maintaining nutritional density while reducing overall caloric intake',
  'fat-loss': 'optimizing macronutrient ratios for fat loss while preserving muscle mass',
  'strength-gains': 'supporting muscle growth and recovery through optimal nutrition timing and composition'
};

const formatInstructions = `
Please provide feedback in the following format:

Overview:
- Start with a friendly acknowledgment of the meal
- Comment on its overall nutritional approach

Recommendations (3-5 specific suggestions):
- Direct modifications (e.g., "Add 1/2 cup of quinoa")
- Complementary additions that make sense for the meal context
- Include specific portions/measurements where applicable
- Keep suggestions meal-time appropriate
`;

function constructPrompt(text: string | null, image: string | null, feedbackContexts: string): string {
  if (image) {
    return `Analyze this meal/recipe image and provide concise feedback.

Focus Areas: ${feedbackContexts}

${formatInstructions}`;
  }

  return `Analyze this meal and provide concise feedback.

Input: ${text}

Focus Areas: ${feedbackContexts}

${formatInstructions}`;
}

async function generateWithRetry(provider: AIProvider, prompt: string, retries = 0) {
  try {
    if (!rateLimiter.canMakeRequest(provider)) {
      const waitTime = rateLimiter.getTimeUntilNextRequest(provider);
      throw new Error(`Rate limit exceeded. Please try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({
          apiKey: getValidatedApiKey('openai'),
        });

        const stream = await openai.chat.completions.create({
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
        // @ts-ignore - Type mismatch is expected but works correctly
        return new StreamingTextResponse(OpenAIStream(stream));
      }

      case 'anthropic': {
        // For now, fallback to OpenAI if Anthropic is selected
        const openai = new OpenAI({
          apiKey: getValidatedApiKey('openai'),
        });

        const stream = await openai.chat.completions.create({
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
        // @ts-ignore - Type mismatch is expected but works correctly
        return new StreamingTextResponse(OpenAIStream(stream));
      }

      case 'gemini': {
        const genAI = new GoogleGenerativeAI(getValidatedApiKey('gemini'));
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const response = await model.generateContentStream(
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
    const { text, image, feedbackTypes } = await req.json();
    const provider = 'gemini'; // Hardcoded to Gemini as per previous changes

    if (!text && !image) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const selectedFeedbackTypes = Array.isArray(feedbackTypes) ? feedbackTypes : [];
    const feedbackContexts = selectedFeedbackTypes
      .map((type: keyof typeof feedbackTypeContext) => feedbackTypeContext[type])
      .filter(Boolean)
      .join(', ');

    const prompt = constructPrompt(text, image, feedbackContexts);
    return await generateWithRetry(provider, prompt);

  } catch (error: any) {
    console.error('Error in feedback generation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate feedback' },
      { status: error.status || 500 }
    );
  }
} 