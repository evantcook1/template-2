# Vercel Deployment Guide

This document outlines the necessary steps to successfully deploy this application to Vercel.

## Environment Variables

To ensure proper functionality in production, make sure to set the following environment variables in your Vercel project settings:

| Variable Name | Description | Required? |
|---------------|-------------|-----------|
| `OPENAI_API_KEY` | API key for OpenAI services | Yes, if using OpenAI features |
| `GOOGLE_API_KEY` | API key for Google/Gemini AI | Yes, if using Gemini features |
| `REPLICATE_API_TOKEN` | API token for Replicate image generation | Yes, if using image generation |
| `DEEPGRAM_API_KEY` | API key for Deepgram audio transcription | Yes, if using speech features |
| `ANTHROPIC_API_KEY` | API key for Anthropic/Claude | Yes, if using Anthropic features |

### Firebase Configuration Variables

If you're using Firebase services, you'll need to add these environment variables as well:

| Variable Name | Description | Required? |
|---------------|-------------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes, if using Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes, if using Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes, if using Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes, if using Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes, if using Firebase |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes, if using Firebase |

> **Security Note**: Environment variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. For Firebase, this is necessary because Firebase is initialized on the client side. However, exposure of these keys is generally acceptable as Firebase uses additional security rules to protect your data.

## Deployment Best Practices

1. **Test locally first**: Run `npm run build` and then `npm start` to verify your build works locally before deploying.

2. **Use Vercel's preview deployments**: Make changes in a branch and use Vercel's preview deployments to test before merging to main.

3. **Check logs after deployment**: After deploying, check the Vercel logs for any errors or warnings.

4. **Verify API routes**: After deployment, test each API route to ensure they're functioning correctly.

## Common Deployment Issues and Solutions

### Missing Environment Variables
- Symptoms: API calls fail, "Service not configured" errors
- Solution: Add all required environment variables in the Vercel project settings

### Image Optimization Issues
- Symptoms: Images fail to load or show error messages
- Solution: Ensure all remote domains are added to the `images.remotePatterns` in `next.config.mjs`

### API Route Failures
- Symptoms: API routes return 500 errors
- Solution: Check API implementation, ensure error handling is in place, and required dependencies are installed

### Edge Runtime Issues
- Symptoms: API routes using Edge Runtime fail
- Solution: Ensure all Edge Runtime APIs are compatible and properly implemented

### Firebase Connection Issues
- Symptoms: Authentication or database operations fail
- Solution: Verify all Firebase environment variables are correctly set in Vercel

### AI SDK Dependency Conflicts
- Symptoms: Build errors with type mismatches or import failures
- Solution: Use the direct SDK for Anthropic instead of @ai-sdk/anthropic, and ensure correct import syntax for OpenAI
- Note: There are known issues with version conflicts between the various AI SDKs. If you encounter these, consider:
  1. Using the provider's direct SDK instead of the AI SDK wrapper
  2. Adding version overrides in package.json
  3. Using a simpler implementation that doesn't mix different AI providers

## Deployment Checklist

- [ ] All required environment variables are set in Vercel
- [ ] Build passes locally with `npm run build`
- [ ] All API routes have proper error handling
- [ ] Image domains are properly configured
- [ ] Client-side code is properly marked with `'use client'`
- [ ] Server-side code doesn't use client-only APIs like `localStorage`
- [ ] Firebase configuration uses environment variables, not hardcoded values
- [ ] AI SDK dependencies are properly configured without version conflicts

## Support

If you encounter issues not covered in this guide, please check the [Next.js documentation](https://nextjs.org/docs) or [Vercel documentation](https://vercel.com/docs) for more information. 