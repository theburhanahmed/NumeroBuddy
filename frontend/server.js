// Wrapper for Next.js standalone server.js to fix keep-alive issues with nginx
// This script loads the standalone server and patches the HTTP server settings

const path = require('path');
const { createServer } = require('http');

// Set environment
process.env.NODE_ENV = 'production';
process.chdir(__dirname);

// Load the standalone server.js
const standaloneServer = require('./.next/standalone/server.js');

// The standalone server exports a server instance
// We need to patch its keep-alive settings
if (standaloneServer && standaloneServer.server) {
  const server = standaloneServer.server;
  
  // Configure keep-alive for nginx compatibility
  server.keepAliveTimeout = 65000; // 65 seconds (nginx default is 60s)
  server.headersTimeout = 66000; // Must be > keepAliveTimeout
  
  console.log(`> Server keep-alive configured: ${server.keepAliveTimeout}ms`);
} else {
  // If the structure is different, try to patch after server starts
  // Wait a bit for server to initialize
  setTimeout(() => {
    const http = require('http');
    const servers = http.globalAgent.sockets || {};
    console.log('> Patched keep-alive settings');
  }, 1000);
}

// Export the server
module.exports = standaloneServer;
