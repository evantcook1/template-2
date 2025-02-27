import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!process.env.DEEPGRAM_API_KEY) {
        console.warn("The DEEPGRAM_API_KEY environment variable is not set.");
        return NextResponse.json({
            error: "Deepgram service is not configured properly. Please set the DEEPGRAM_API_KEY environment variable.",
            key: ""
        }, { status: 503 });
    }
    
    return NextResponse.json({
      key: process.env.DEEPGRAM_API_KEY,
    });
}
