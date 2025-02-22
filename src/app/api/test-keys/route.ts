import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

export async function GET() {
  const results = {
    openai: { status: false, message: '' },
    google: { status: false, message: '' }
  };

  // Test OpenAI
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say "test" if you can read this.' }],
      max_tokens: 10,
    });

    if (response.choices[0]?.message?.content) {
      results.openai.status = true;
      results.openai.message = 'OpenAI API key is valid and working';
    } else {
      throw new Error('Unexpected response format from OpenAI');
    }
  } catch (error: any) {
    results.openai.message = error.message || 'Error testing OpenAI API key';
  }

  // Test Google
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Say "test" if you can read this.');
    const response = await result.response;
    const text = response.text();

    if (text) {
      results.google.status = true;
      results.google.message = 'Google API key is valid and working';
    } else {
      throw new Error('Unexpected response format from Google');
    }
  } catch (error: any) {
    results.google.message = error.message || 'Error testing Google API key';
  }

  return NextResponse.json(results);
} 