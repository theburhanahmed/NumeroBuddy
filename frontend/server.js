// Custom Next.js server wrapper that patches HTTP server for nginx compatibility
// This fixes the "upstream prematurely closed connection" issue

// Set keep-alive timeout environment variable (Next.js reads this)
process.env.KEEP_ALIVE_TIMEOUT = '65000';

// Patch HTTP module to intercept ALL server creation
const http = require('http');
const originalCreateServer = http.createServer;

// Wrap createServer to patch keep-alive settings
http.createServer = function(...args) {
  const server = originalCreateServer.apply(this, args);
  
  // Patch keep-alive settings for nginx compatibility
  server.keepAliveTimeout = 65000; // 65 seconds (nginx default is 60s)
  server.headersTimeout = 66000; // Must be > keepAliveTimeout
  
  // Also patch request handler to ensure connections stay alive
  const originalEmit = server.emit;
  server.emit = function(event, ...args) {
    if (event === 'request') {
      const req = args[0];
      const res = args[1];
      
      // Ensure response doesn't close connection prematurely
      if (res && !res.headersSent) {
        res.setHeader('Connection', 'keep-alive');
      }
    }
    return originalEmit.apply(this, [event, ...args]);
  };
  
  console.log(`> HTTP server keep-alive configured: ${server.keepAliveTimeout}ms`);
  
  return server;
};

// Patch global agent
http.globalAgent.keepAlive = true;
http.globalAgent.keepAliveMsecs = 65000;

// Patch any existing servers after Next.js starts
setTimeout(() => {
  try {
    const net = require('net');
    // Try to find and patch the server
    const _server = require('http')._connections || {};
    Object.values(_server).forEach(server => {
      if (server && typeof server.keepAliveTimeout !== 'undefined') {
        server.keepAliveTimeout = 65000;
        server.headersTimeout = 66000;
        console.log(`> Patched existing server keep-alive: ${server.keepAliveTimeout}ms`);
      }
    });
  } catch (e) {
    // Ignore errors
  }
}, 3000);

// Now load the original standalone server
require('./server.js.original');
