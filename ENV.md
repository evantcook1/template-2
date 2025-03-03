# Environment Variables

This document describes all the environment variables used in the Meal Mentor application. These variables are essential for configuring the application's behavior, connecting to external services, and securing sensitive information.

## Configuration

Create a `.env.local` file in the root directory of the project with the following variables:

## Required Variables

### Firebase Configuration

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

These variables are used to configure Firebase services including Authentication, Firestore, and Storage. You can obtain these values from the Firebase console after creating a project.

### Google Gemini API

```
GEMINI_API_KEY=your_gemini_api_key
```

This variable is required for the meal analysis functionality. You can obtain a Gemini API key from the [Google AI Studio](https://ai.google.dev/).

## Optional Variables

The following variables are optional and only required if you want to use the corresponding AI providers:

### OpenAI

```
OPENAI_API_KEY=your_openai_api_key
```

Required if you want to use OpenAI's models. You can obtain an API key from the [OpenAI platform](https://platform.openai.com/).

### Anthropic

```
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Required if you want to use Anthropic's Claude models. You can obtain an API key from the [Anthropic console](https://console.anthropic.com/).

### Replicate

```
REPLICATE_API_KEY=your_replicate_api_key
```

Required if you want to use Replicate's models for image generation. You can obtain an API key from the [Replicate website](https://replicate.com/).

### Deepgram

```
DEEPGRAM_API_KEY=your_deepgram_api_key
```

Required if you want to use Deepgram for audio transcription. You can obtain an API key from the [Deepgram console](https://console.deepgram.com/).

## Environment Variable Usage

### Client-Side vs. Server-Side Variables

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the client-side code and should only contain non-sensitive information.
- Variables without the `NEXT_PUBLIC_` prefix are only available in server-side code (API routes) and are not exposed to the client.

### Accessing Environment Variables

#### In Server-Side Code (API Routes)

```typescript
// Access server-side environment variables
const apiKey = process.env.GEMINI_API_KEY;
```

#### In Client-Side Code

```typescript
// Access client-side environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

## Security Considerations

- Never commit your `.env.local` file to version control
- Use different API keys for development and production environments
- Regularly rotate your API keys for better security
- Set appropriate permissions and rate limits on your API keys
- Monitor usage to detect any unauthorized access

## Deployment

When deploying the application, you need to set these environment variables in your hosting platform:

### Vercel

You can set environment variables in the Vercel dashboard under Project Settings > Environment Variables.

### Netlify

You can set environment variables in the Netlify dashboard under Site Settings > Build & Deploy > Environment.

### Other Platforms

Consult your hosting platform's documentation for instructions on setting environment variables. 