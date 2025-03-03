import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Return a user-friendly error if the API key is not set
  // This prevents deployment failures when environment variables are missing
  if (!process.env.OPENAI_API_KEY) {
    console.warn("The OPENAI_API_KEY environment variable is not set.");
    return NextResponse.json(
      { 
        error: "OpenAI chat service is not configured. Please set the OPENAI_API_KEY environment variable." 
      },
      { status: 503 } // Service Unavailable
    );
  }

  try {
    const { messages } = await req.json();
    
    // Create a response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant' },
        ...messages
      ],
    });

    // Use a type assertion to make the OpenAI response compatible with the Vercel AI SDK
    // This is necessary due to type incompatibilities between the OpenAI SDK and Vercel AI SDK
    const stream = OpenAIStream(response as any);
    
    // Return a StreamingTextResponse, which is a ReadableStream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
} 