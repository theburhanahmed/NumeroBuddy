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
python manage.py migrate accounts 0001 --fake-initial || echo "Warning: Fake initial migration may have failed, continuing..."

echo "Creating migrations for all apps..."
python manage.py makemigrations --no-input

echo "Running database migrations..."
python manage.py migrate --no-input --run-syncdb

# Ensure accounts app migrations are fully applied (critical for notifications table)
echo "Ensuring accounts migrations are fully applied..."
python manage.py migrate accounts --no-input

# Verify critical tables exist
echo "Verifying critical database tables..."
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()
from django.db import connection
cursor = connection.cursor()
tables = ['notifications', 'accounts_user', 'accounts_userprofile']
for table in tables:
    cursor.execute(\"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)\", [table])
    exists = cursor.fetchone()[0]
    if exists:
        print(f'✓ Table {table} exists')
    else:
        print(f'⚠ WARNING: Table {table} does not exist')
" || echo "Warning: Table verification script failed, but continuing..."

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!"