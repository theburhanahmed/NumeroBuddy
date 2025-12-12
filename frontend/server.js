// Custom Next.js server wrapper for nginx proxy compatibility
// Sets keep-alive timeout and loads the standalone server

// Set keep-alive timeout before loading Next.js
process.env.KEEP_ALIVE_TIMEOUT = '65000';

// Load the standalone server.js that Next.js generates
// In standalone mode, server.js is at the root of the standalone build
require('./server.js');
