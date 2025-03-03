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
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant' },
        ...messages
      ],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
} 