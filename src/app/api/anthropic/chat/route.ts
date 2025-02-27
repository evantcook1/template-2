import { StreamingTextResponse, Message } from "ai";
import Anthropic from "@anthropic-ai/sdk";
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
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    const mappedMessages = messages.map((message: Message) => ({
      role: message.role === "user" ? "user" : "assistant",
      content: message.content,
    }));
    
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      messages: mappedMessages,
      system: "You are a helpful AI assistant",
      stream: true,
      max_tokens: 1024,
    });
    
    return new StreamingTextResponse(response.toReadableStream());
  } catch (error) {
    console.error("Error from Anthropic API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
