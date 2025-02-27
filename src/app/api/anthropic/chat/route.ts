import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("The ANTHROPIC_API_KEY environment variable is not set.");
    return NextResponse.json(
      { 
        error: "Anthropic chat service is not configured. Please set the ANTHROPIC_API_KEY environment variable." 
      },
      { status: 503 } // Service Unavailable
    );
  }

  try {
    const { messages } = await req.json();
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      messages: convertToCoreMessages(messages),
      system: "You are a helpful AI assistant",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error from Anthropic API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
