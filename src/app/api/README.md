# API Documentation

This directory contains all the API routes for the Meal Mentor application. These endpoints handle various functionalities including meal analysis, authentication, and integration with different AI providers.

## Available Endpoints

### Feedback API

**Endpoint:** `/api/feedback`

Analyzes meals and recipes using Google's Gemini AI and provides nutritional feedback based on user-selected dietary goals.

#### POST Request

```json
{
  "text": "string | null",       // Text description of the meal (optional if image is provided)
  "image": "string | null",      // Base64-encoded image data (optional if text is provided)
  "feedbackTypes": "string[]"    // Array of feedback type IDs
}
```

#### Response

A streaming response with AI-generated feedback based on the meal and selected feedback types.

#### Feedback Types

The following feedback types are supported:

- `increase-protein`: Targeting optimal protein intake for muscle synthesis (1.6-2.2g per kg of body weight)
- `increase-fiber`: Aiming for 25-35g of daily fiber intake for digestive health
- `whole30`: Ensuring compliance with Whole30 guidelines (no grains, legumes, dairy, added sugars)
- `reduce-calories`: Maintaining nutritional density while reducing overall caloric intake
- `fat-loss`: Optimizing macronutrient ratios for fat loss while preserving muscle mass
- `strength-gains`: Supporting muscle growth and recovery through optimal nutrition timing and composition

#### Example

```javascript
// Client-side code
const response = await fetch('/api/feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: "Grilled chicken breast with quinoa and steamed broccoli",
    image: null,
    feedbackTypes: ["increase-protein", "strength-gains"]
  }),
});

// For streaming response
const reader = response.body.getReader();
// Process the stream...
```

### OpenAI API

**Endpoint:** `/api/openai/chat`

Provides access to OpenAI's chat models for text generation.

#### POST Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "string"
    }
  ],
  "model": "string",  // Optional, defaults to "gpt-3.5-turbo"
  "temperature": 0.7  // Optional
}
```

#### Response

A streaming response with AI-generated text from OpenAI.

### Anthropic API

**Endpoint:** `/api/anthropic/chat`

Provides access to Anthropic's Claude models for text generation.

#### POST Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "string"
    }
  ],
  "model": "string",  // Optional, defaults to "claude-3-sonnet-20240229"
  "temperature": 0.7  // Optional
}
```

#### Response

A streaming response with AI-generated text from Anthropic's Claude.

### Replicate API

**Endpoint:** `/api/replicate/generate-image`

Generates images using Stable Diffusion models hosted on Replicate.

#### POST Request

```json
{
  "prompt": "string",  // Description of the image to generate
  "negative_prompt": "string",  // Optional, things to avoid in the image
  "width": 512,  // Optional, image width
  "height": 512  // Optional, image height
}
```

#### Response

```json
{
  "imageUrl": "string"  // URL of the generated image
}
```

### Deepgram API

**Endpoint:** `/api/deepgram/transcribe-audio`

Provides the Deepgram API key for client-side audio transcription.

#### GET Request

No parameters required.

#### Response

```json
{
  "apiKey": "string"  // Deepgram API key
}
```

## Error Handling

All API endpoints follow a consistent error handling pattern:

- **400 Bad Request**: When required parameters are missing or invalid
- **401 Unauthorized**: When authentication is required but not provided
- **403 Forbidden**: When the user doesn't have permission to access the resource
- **429 Too Many Requests**: When rate limits are exceeded
- **500 Internal Server Error**: When an unexpected error occurs

Errors are returned in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

The application implements rate limiting to prevent abuse of the AI APIs. The rate limits are as follows:

- Gemini API: 10 requests per minute
- OpenAI API: 10 requests per minute
- Anthropic API: 10 requests per minute
- Replicate API: 10 requests per minute

When a rate limit is exceeded, the API will return a 429 status code with information about when the next request can be made.

## Authentication

Some API endpoints may require authentication. To authenticate, include a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Environment Variables

The following environment variables are required for the APIs to function:

- `GEMINI_API_KEY`: Google Gemini API key
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `REPLICATE_API_KEY`: Replicate API key
- `DEEPGRAM_API_KEY`: Deepgram API key 