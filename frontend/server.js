// Custom Next.js server wrapper for nginx proxy compatibility
// This fixes the "upstream prematurely closed connection" issue
const { createServer } = require('http');
const path = require('path');

const dir = path.join(__dirname);
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Set environment
process.env.NODE_ENV = 'production';
process.chdir(dir);

// Load Next.js standalone server
const { startServer } = require('next/dist/server/lib/start-server');

// Create HTTP server with proper keep-alive settings for nginx
const httpServer = createServer();

// Configure keep-alive for nginx compatibility
// nginx default keepalive_timeout is 60s, so we set ours slightly higher
httpServer.keepAliveTimeout = 65000; // 65 seconds (nginx default is 60s)
httpServer.headersTimeout = 66000; // Must be > keepAliveTimeout (66 seconds)

// Increase max connections
httpServer.maxHeadersCount = 2000;

// Start Next.js server first
startServer({
  dir,
  hostname,
  port,
  isDev: false,
  allowRetry: false,
  keepAliveTimeout: 65000,
}).then((nextServer) => {
  // Wrap Next.js server's request handler
  httpServer.on('request', async (req, res) => {
    try {
      // Ensure proper headers for proxy
      if (!req.headers['x-forwarded-proto']) {
        req.headers['x-forwarded-proto'] = 'https';
      }
      
      // Use Next.js server's handler
      await nextServer.handler(req, res);
    } catch (err) {
      console.error('Error handling request:', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  });

  // Start our HTTP server
  httpServer.listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start HTTP server:', err);
      process.exit(1);
    }
    console.log(`> Custom server ready on http://${hostname}:${port}`);
    console.log(`> Keep-alive timeout: ${httpServer.keepAliveTimeout}ms`);
  });
}).catch((err) => {
  console.error('Failed to start Next.js server:', err);
  process.exit(1);
});

// Handle server errors
httpServer.on('error', (err) => {
  console.error('HTTP server error:', err);
});

// Graceful shutdown
const shutdown = (signal) => {
  return () => {
    console.log(`${signal} signal received: closing HTTP server`);
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };
};

process.on('SIGTERM', shutdown('SIGTERM'));
process.on('SIGINT', shutdown('SIGINT'));
