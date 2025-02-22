### **Context Prompt for Cursor AI – Feedback Application**

You are an expert in **TypeScript, Next.js App Router, React, and Tailwind**. Follow **@Next.js docs** for Data Fetching, Rendering, and Routing. Use **Vercel AI SDK** for handling AI interactions and processing user inputs efficiently.

Your job is to create a **Feedback Application** that allows users to upload or describe meals/recipes and receive tailored nutritional feedback.

---

## **Core Features and Implementation Details**

### **1. Multi-Input Selection – Initial User Interaction**

Users should be able to seamlessly select **one** of the following input methods on the first screen:

- **Upload an image of their meal**
- **Upload an image of a recipe**
- **Describe their meal via text**
- **Write out a recipe for feedback**

#### **Implementation Requirements:**

- Use a **toggle-based or tab-based UI** for switching between input methods.
- Ensure a **clean, intuitive layout** with a sleek and inviting aesthetic.
- No feedback should be provided at this stage—this screen is only for input collection.
- Optimize for both **desktop and mobile responsiveness**.

---

### **2. Smooth Transition to Feedback Selection Screen**

Once the user submits an input, the app should transition to a second screen where they can select **up to two types of feedback** from a predefined list.

#### **Feedback options include (but are not limited to):**

- **Increase Protein**
- **Increase Fiber**
- **Make Whole30 Compliant**
- **Reduce Calories**
- **Support Fat Loss**
- **Support Strength Gains**

#### **Implementation Requirements:**

- Create an **interactive checkbox or multi-select UI** for users to choose their desired feedback.
- Ensure an **elegant, animated transition** from the input screen to the feedback selection screen.
- Use **state management** to track the user's selection for later processing.

---

### **3. UI & UX Considerations**

The interface should be:

- **Sleek yet inviting**, balancing professionalism with approachability.
- **Minimalist and modern**, avoiding clutter while maintaining full functionality.
- **Accessible and responsive**, ensuring smooth interactions across devices.

**Design elements to prioritize:**

- **Hover effects, smooth animations, and well-spaced UI components.**
- **Dark mode/light mode support** for better user experience.
- **Mobile-friendly touch interactions** for input and selection.

---

## **Technical Considerations & Implementation Guidelines**

### **Frontend Tech Stack**

- **Next.js App Router** for efficient page rendering and routing.
- **React + TypeScript** for type safety and modular development.
- **Tailwind CSS** for styling, ensuring a clean and responsive UI.

### **Backend & AI Processing**

- **Vercel AI SDK** for handling AI-based feedback generation.
- **Server-side processing for images** (meal and recipe recognition).
- **Efficient text parsing algorithms** for analyzing user-submitted descriptions and recipes.

### **Performance & Error Handling**

- **Optimize image uploads** for speed and accuracy.
- **Implement informative error messages** (e.g., invalid input, unsupported formats).
- **Use loading indicators or skeleton loaders** for better user experience.

---

## **Components & Pages to Develop**

1. **InputSelectionScreen.tsx**
    
    - Handles input collection (image, text, recipe).
    - Provides a smooth toggle between options.
2. **FeedbackSelectionScreen.tsx**
    
    - Displays the list of feedback options.
    - Allows users to select up to two types of feedback.
3. **TransitionManager.ts**
    
    - Manages smooth animations and page transitions.
4. **ErrorHandler.tsx**
    
    - Displays informative error messages.
    - Ensures smooth fallback behavior.
5. **LoadingIndicator.tsx**
    
    - Shows loading states for image processing and feedback generation.

---

## **Goal**

A **polished, user-friendly application** that makes meal feedback accessible, actionable, and engaging through an intuitive interface and seamless interactions.