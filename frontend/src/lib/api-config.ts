// Centralized API URL configuration for the Vite frontend.
// Requires VITE_API_URL environment variable to be set to the backend origin
// (e.g. http://localhost:8000). Do NOT include /api/v1 — request paths already
// include it.

function getApiUrl(): string {
  let apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (apiUrl) {
    // Normalize: strip trailing /api/v1 so we never double the prefix (paths use /api/v1/...)
    apiUrl = apiUrl.replace(/\/api\/v1\/?$/i, '');
    return apiUrl;
  }

  // In development, default to local backend so the app runs without VITE_API_URL
  const isDev = import.meta.env.MODE === 'development';
  if (isDev) {
    const fallback = 'http://localhost:8000';
    console.warn(
      'VITE_API_URL is not set. Using default for development:',
      fallback,
      '\nTo override, add VITE_API_URL to your .env file'
    );
    return fallback;
  }

  const errorMessage =
    'VITE_API_URL environment variable is required but not set.\n' +
    'Please set this variable in your deployment environment.';

  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const API_URL = getApiUrl();

