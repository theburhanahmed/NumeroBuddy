#!/bin/sh
set -e

# Start Next.js server in background on port 3001
PORT=3001 node server.js.original &
NEXTJS_PID=$!

# Wait for Next.js to be ready
echo "Waiting for Next.js server to start..."
for i in $(seq 1 30); do
  if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "Next.js server is ready"
    break
  fi
  sleep 1
done

# Start proxy server (this will be the main process)
echo "Starting proxy server..."
exec node proxy-server.js
