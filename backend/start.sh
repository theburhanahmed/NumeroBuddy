#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until python -c "import psycopg2; psycopg2.connect(host='${DB_HOST:-postgres}', port='${DB_PORT:-5432}', user='${DB_USER:-numerai}', password='${DB_PASSWORD}', dbname='${DB_NAME:-numerai}', connect_timeout=5)" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - executing migrations"
python manage.py migrate --noinput || echo "Migration failed, continuing..."

echo "Collecting static files"
python manage.py collectstatic --noinput || echo "Collectstatic failed, continuing..."

echo "Starting Gunicorn"
exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 4 --threads 2 --timeout 120 numerai.wsgi:application

