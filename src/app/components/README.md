# Components Documentation

This directory contains all the React components used in the Meal Mentor application. Each component is designed to handle a specific part of the user interface and user experience.

## Component Overview

### InputSelectionScreen

**Purpose**: Allows users to select their input method and provide meal/recipe data.

**Props**:
- `onInputSubmit`: Function to handle input submission
- `setAppState`: Function to update the application state

**Features**:
- Four input methods: Meal Photo, Recipe Photo, Describe Meal, Write Recipe
- Image upload functionality with preview
- Text input for meal/recipe descriptions
- Navigation to history view

**Usage Example**:
```jsx
<InputSelectionScreen 
  onInputSubmit={(method, data) => handleData(method, data)} 
  setAppState={(state) => setCurrentState(state)} 
/>
```

### FeedbackSelectionScreen

**Purpose**: Allows users to select the types of feedback they want to receive.

**Props**:
- `onFeedbackSubmit`: Function to handle feedback type submission

**Features**:
- Selection of up to two feedback types
- Visual indication of selected options
- Submit button to proceed with analysis

**Available Feedback Types**:
- Increase Protein
- Increase Fiber
- Make Whole30 Compliant
- Reduce Calories
- Support Fat Loss
- Support Strength Gains

**Usage Example**:
```jsx
<FeedbackSelectionScreen 
  onFeedbackSubmit={(feedbackTypes) => handleFeedback(feedbackTypes)} 
/>
```

### LoadingIndicator

**Purpose**: Displays a loading animation while waiting for AI analysis.

**Props**:
- `message`: Optional custom loading message

**Features**:
- Animated loading spinner
- Customizable loading message

**Usage Example**:
```jsx
<LoadingIndicator message="Analyzing your meal..." />
```

### ResultsView

**Purpose**: Displays the AI-generated feedback to the user.

**Props**:
- `response`: The AI-generated feedback text
- `onBack`: Function to handle navigation back to the input screen

**Features**:
- Formatted display of AI feedback
- Back button to start over

**Usage Example**:
```jsx
<ResultsView 
  response="Your meal analysis..." 
  onBack={() => handleReset()} 
/>
```

### HistoryView

**Purpose**: Displays the history of previous meal analyses.

**Features**:
- List of past analyses with dates
- Expandable entries to view full feedback
- Delete functionality for individual entries
- Clear all history option

**Usage Example**:
```jsx
<HistoryView />
```

### ErrorMessage

**Purpose**: Displays error messages to the user.

**Props**:
- `message`: The error message to display
- `onRetry`: Function to handle retry action
- `onDismiss`: Function to handle dismissing the error

**Features**:
- Clear error message display
- Retry button
- Dismiss button

**Usage Example**:
```jsx
<ErrorMessage 
  message="Failed to analyze meal" 
  onRetry={() => handleRetry()} 
  onDismiss={() => setError(null)} 
/>
```

### Login

**Purpose**: Handles user authentication.

**Features**:
- Email/password login
- Google authentication
- User registration
- Password reset

**Usage Example**:
```jsx
<Login />
```

## Component Relationships

The components are organized in a hierarchical structure:

1. **Home** (in `src/app/page.tsx`) is the main component that manages the application state and renders the appropriate screen based on the current state.

2. **InputSelectionScreen** is rendered when the app state is 'input'. It allows users to select their input method and provide meal/recipe data.

3. **FeedbackSelectionScreen** is rendered when the app state is 'feedback'. It allows users to select the types of feedback they want to receive.

4. **LoadingIndicator** is rendered when the app state is 'loading'. It displays a loading animation while waiting for AI analysis.

5. **ResultsView** is rendered when the app state is 'results'. It displays the AI-generated feedback to the user.

6. **HistoryView** is rendered when the app state is 'history'. It displays the history of previous meal analyses.

7. **ErrorMessage** is rendered when there is an error. It displays error messages to the user.

8. **Login** is used for user authentication.

## Styling

All components use Tailwind CSS for styling. The color scheme is based on green tones (#2E8B57) for the primary color, with appropriate contrast for text and backgrounds.

## Best Practices

When working with these components, follow these best practices:

1. **Props**: Keep props simple and focused on the component's purpose.

2. **State Management**: Use local state for UI-specific state, and context for shared state.

3. **Error Handling**: Always handle potential errors and provide user feedback.

4. **Accessibility**: Ensure all components are accessible with proper ARIA attributes and keyboard navigation.

5. **Responsive Design**: All components should work well on mobile, tablet, and desktop devices.

6. **Performance**: Avoid unnecessary re-renders by using React.memo, useMemo, and useCallback where appropriate. 