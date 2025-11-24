#!/usr/bin/env bash
# Render.com build script for Django backend

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Checking migration history..."
python manage.py showmigrations

echo "Creating migrations for all apps..."
python manage.py makemigrations --no-input

echo "Attempting to resolve migration inconsistencies..."
# Handle the specific migration dependency issue between accounts and account apps
# This is a known issue when using django-allauth with custom user models
python manage.py migrate accounts 0001_initial --no-input || true
python manage.py migrate --no-input

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!"