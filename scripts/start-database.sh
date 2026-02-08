#!/bin/bash
# Start PostgreSQL (and optionally Redis) for local development
# Run from project root: ./scripts/start-database.sh
#
# Option A: Uses Docker if available (docker compose up -d postgres redis)
# Option B: Starts Homebrew PostgreSQL and creates numerai user/db

set -e
cd "$(dirname "$0")/.."

# Try Docker first
if command -v docker &> /dev/null && docker info &> /dev/null; then
  echo "Starting PostgreSQL and Redis via Docker..."
  docker compose up -d postgres redis
  echo "Waiting for PostgreSQL to be ready..."
  sleep 5
  if docker compose exec -T postgres pg_isready -U numerai &> /dev/null; then
    echo "PostgreSQL is ready on localhost:5432 (Database: numerai, User: numerai, Password: numerai)"
    echo ""
    echo "Run migrations: cd backend && source venv/bin/activate && python manage.py migrate"
    exit 0
  fi
fi

# Fallback: Homebrew PostgreSQL on macOS
if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
  echo "Docker not available. Attempting Homebrew PostgreSQL..."
  if brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null; then
    sleep 3
    echo "PostgreSQL started. Create user/db if needed:"
    echo "  createuser -s numerai"
    echo "  createdb -O numerai numerai"
    echo "  psql -c \"ALTER USER numerai WITH PASSWORD 'numerai';\""
    echo ""
    echo "Then: cd backend && python manage.py migrate"
    exit 0
  fi
fi

echo ""
echo "Could not start PostgreSQL. Choose one:"
echo ""
echo "  1. Install Docker Desktop, then run this script again"
echo "  2. Homebrew: brew install postgresql && brew services start postgresql"
echo "     Then: createuser -s numerai && createdb numerai"
echo "     Set password: psql -c \"ALTER USER numerai WITH PASSWORD 'numerai';\""
echo ""
exit 1
