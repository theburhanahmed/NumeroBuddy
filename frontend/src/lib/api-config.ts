/**
 * Centralized API URL configuration
 * Requires NEXT_PUBLIC_API_URL environment variable to be set
 *
 * API_URL must be the backend origin only (e.g. http://localhost:8000).
 * Do NOT include /api/v1 — request paths already include it.
 *
 * This variable must be set at build time in your deployment environment.
 * For Render.com: Set it in the Environment Variables section of your service settings.
 */

function getApiUrl(): string {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    // Normalize: strip trailing /api/v1 so we never double the prefix (paths use /api/v1/...)
    apiUrl = apiUrl.replace(/\/api\/v1\/?$/i, '');
    return apiUrl;
  }

  // In development, default to local backend so the app runs without .env.local
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const fallback = 'http://localhost:8000';
    if (typeof window === 'undefined') {
      console.warn(
        'NEXT_PUBLIC_API_URL is not set. Using default for development:',
        fallback,
        '\nTo override, add NEXT_PUBLIC_API_URL to .env.local'
      );
    }
    return fallback;
  }

  const errorMessage =
    'NEXT_PUBLIC_API_URL environment variable is required but not set.\n' +
    'Please set this variable in your deployment environment:\n' +
    '- Render.com: Go to your service → Environment → Add NEXT_PUBLIC_API_URL\n' +
    '- Docker: Pass it as build arg: --build-arg NEXT_PUBLIC_API_URL=...\n' +
    '- Local: Add it to .env.local file';

  if (typeof window !== 'undefined') {
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  throw new Error(errorMessage);
}

export const API_URL = getApiUrl();
