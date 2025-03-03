# Meal Mentor

Meal Mentor is an AI-powered nutrition assistant that provides personalized feedback on your meals and recipes. Whether you want to optimize your diet for specific goals like increasing protein, supporting fat loss, or making your meals Whole30 compliant, Meal Mentor can help.

## Features

- **Multiple Input Methods**: Upload photos of your meals, share recipe images, or describe your meals and recipes in text
- **Personalized Feedback**: Choose from various dietary goals to receive tailored recommendations
- **AI-Powered Analysis**: Utilizes Google's Gemini AI to analyze meals and provide nutritional insights
- **History Tracking**: Save and review your past meal analyses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React with Next.js 14 App Router
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Database**: Firebase Firestore
- **AI**: Google Gemini API via Vercel AI SDK
- **Additional AI Options**: OpenAI, Anthropic, and Replicate (pre-configured)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/meal-mentor.git
   cd meal-mentor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key

   # Optional: Other AI providers
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   REPLICATE_API_KEY=your_replicate_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Input Selection**: Choose how you want to provide information about your meal:
   - Upload a photo of your meal
   - Upload a recipe image
   - Describe your meal in text
   - Write out a recipe

2. **Goal Selection**: Select up to two dietary goals for feedback:
   - Increase Protein
   - Increase Fiber
   - Make Whole30 Compliant
   - Reduce Calories
   - Support Fat Loss
   - Support Strength Gains

3. **View Feedback**: Receive personalized AI-generated feedback based on your meal and selected goals

4. **History**: Access your past meal analyses from the history view

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── feedback/     # Meal feedback API
│   │   ├── anthropic/    # Anthropic API integration
│   │   ├── deepgram/     # Deepgram API integration
│   │   ├── openai/       # OpenAI API integration
│   │   └── replicate/    # Replicate API integration
│   ├── components/       # React components
│   │   ├── ErrorMessage.tsx
│   │   ├── FeedbackSelectionScreen.tsx
│   │   ├── HistoryView.tsx
│   │   ├── InputSelectionScreen.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── Login.tsx
│   │   └── ResultsView.tsx
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                  # Utility functions and hooks
│   ├── contexts/         # React contexts
│   │   ├── AIContext.tsx # AI state management
│   │   ├── AuthContext.tsx # Authentication
│   │   └── DeepgramContext.tsx # Deepgram integration
│   ├── firebase/         # Firebase configuration
│   └── hooks/            # Custom React hooks
└── components/           # Shared components
```

## API Documentation

### POST /api/feedback

Analyzes a meal based on text description or image and provides nutritional feedback.

#### Request Body

```json
{
  "text": "string | null",       // Text description of the meal (optional if image is provided)
  "image": "string | null",      // Base64-encoded image data (optional if text is provided)
  "feedbackTypes": "string[]"    // Array of feedback type IDs
}
```

#### Response

A streaming response with AI-generated feedback based on the meal and selected feedback types.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.