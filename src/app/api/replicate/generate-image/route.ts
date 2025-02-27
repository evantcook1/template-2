import { NextResponse } from "next/server";
import Replicate from "replicate";

// MODIFIED: Only initialize Replicate if API token is available, otherwise leave as null
// This prevents initialization errors during build/deployment when env vars are not set
const replicate = process.env.REPLICATE_API_TOKEN 
  ? new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  : null;

export async function POST(request: Request) {
  // MODIFIED: Return a more user-friendly error response instead of throwing an error
  // This prevents deployment failures when environment variables are missing
  if (!process.env.REPLICATE_API_TOKEN) {
    console.warn("The REPLICATE_API_TOKEN environment variable is not set.");
    return NextResponse.json(
      { 
        error: "Image generation service is not configured. Please set the REPLICATE_API_TOKEN environment variable." 
      },
      { status: 503 } // Service Unavailable
    );
  }

  const { prompt } = await request.json();

  try {
    // MODIFIED: Added null check for replicate
    if (!replicate) {
      throw new Error("Replicate client is not initialized");
    }
    
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          image_dimensions: "512x512",
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
