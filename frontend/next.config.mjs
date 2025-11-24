/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  // Remove the problematic redirect that was causing '/' to redirect to '/dashboard'
  // This was causing unexpected behavior for unauthenticated users
};

export default nextConfig;