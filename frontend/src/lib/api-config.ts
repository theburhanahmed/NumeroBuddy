/**
 * Centralized API URL configuration
 * Requires NEXT_PUBLIC_API_URL environment variable to be set
 * 
 * This variable must be set at build time in your deployment environment.
 * For Render.com: Set it in the Environment Variables section of your service settings.
 */

function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    const errorMessage = 
      'NEXT_PUBLIC_API_URL environment variable is required but not set.\n' +
      'Please set this variable in your deployment environment:\n' +
      '- Render.com: Go to your service → Environment → Add NEXT_PUBLIC_API_URL\n' +
      '- Docker: Pass it as build arg: --build-arg NEXT_PUBLIC_API_URL=...\n' +
      '- Local: Add it to .env.local file';
    
    if (typeof window !== 'undefined') {
      // Client-side: throw error with helpful message
      console.error(errorMessage);
      throw new Error(errorMessage);
    } else {
      // Server-side/build-time: throw error
      throw new Error(errorMessage);
    }
  }
  
  return apiUrl;
}

export const API_URL = getApiUrl();
