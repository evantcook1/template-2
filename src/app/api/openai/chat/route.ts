import { OpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

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
    const result = await streamText({
      model: OpenAI("gpt-3.5-turbo"),
      messages: convertToCoreMessages(messages),
      system: "You are a helpful AI assistant",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error from OpenAI API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 