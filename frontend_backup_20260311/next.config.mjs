import createNextIntlPlugin from 'next-intl/plugin';
import crypto from 'crypto';

const withNextIntl = createNextIntlPlugin('./src/i18n/index.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  // Don't fail build on static generation errors
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Remove the problematic redirect that was causing '/' to redirect to '/dashboard'
  // This was causing unexpected behavior for unauthenticated users
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Experimental features for performance
  // Note: optimizeCss requires 'critters' package. Disabled for local development.
  // To enable: npm install critters, then set optimizeCss: true
  // experimental: {
  //   optimizeCss: true,
  // },
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Suppress webpack cache parsing warnings for next-intl extractor
    // These warnings are harmless and don't affect functionality
    if (config.ignoreWarnings) {
      config.ignoreWarnings = [
        ...config.ignoreWarnings,
        /next-intl.*extractor.*format/,
        /Parsing of.*next-intl.*for build dependencies failed/,
      ];
    } else {
      config.ignoreWarnings = [
        /next-intl.*extractor.*format/,
        /Parsing of.*next-intl.*for build dependencies failed/,
      ];
    }
    
    // Configure Three.js shader support
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add rule for Three.js shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
      exclude: /node_modules/,
    });

    // Ensure Three.js and React Three Fiber work in browser
    if (!isServer) {
      // Fix for Three.js in Next.js
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias.canvas = false;
      
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module) {
                const hash = crypto.createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return crypto
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Separate chunk for Three.js and R3F
            threejs: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'threejs',
              priority: 25,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);