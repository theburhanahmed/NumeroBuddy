#!/usr/bin/env bash
# Render.com build script for Django backend

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Checking migration history..."
python manage.py showmigrations

# Fix for InconsistentMigrationHistory: Migration account.0001_initial is applied before its dependency accounts.0001_initial
echo "Fixing migration dependency issue..."
python manage.py migrate accounts 0001 --fake-initial

echo "Creating migrations for all apps..."
python manage.py makemigrations --no-input

echo "Running database migrations..."
python manage.py migrate --no-input

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!"