// Custom Next.js server that works with standalone mode
// This properly handles keep-alive for nginx proxy

const path = require('path');
const http = require('http');
const { parse } = require('url');

const dir = path.join(__dirname);
process.env.NODE_ENV = 'production';
process.chdir(dir);

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Load Next.js standalone config
const nextConfig = require('./.next/standalone/package.json');
const { startServer } = require('next/dist/server/lib/start-server');

// Create HTTP server with proper keep-alive BEFORE starting Next.js
const server = http.createServer();

// Configure keep-alive for nginx
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.maxHeadersCount = 2000;

console.log(`> Custom server created with keep-alive: ${server.keepAliveTimeout}ms`);

// Start Next.js and attach to our server
startServer({
  dir,
  hostname,
  port,
  isDev: false,
  allowRetry: false,
  keepAliveTimeout: 65000,
}).then((nextServer) => {
  // Attach Next.js handler to our server
  server.on('request', async (req, res) => {
    try {
      // Ensure proper headers
      if (!req.headers['x-forwarded-proto']) {
        req.headers['x-forwarded-proto'] = 'https';
      }
      
      // Use Next.js handler
      const parsedUrl = parse(req.url, true);
      await nextServer.handler(req, res, parsedUrl);
    } catch (err) {
      console.error('Request error:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  });

  // Start listening
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start:', err);
      process.exit(1);
    }
    console.log(`> Server ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
