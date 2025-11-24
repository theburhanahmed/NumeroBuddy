#!/usr/bin/env bash
# Render.com build script for Django backend

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Checking migration history..."
python manage.py showmigrations

# Completely rewritten migration handling for refactored Django codebase
echo "=== Migration Handling for Refactored Codebase ==="

# Step 1: Handle django-allauth and custom accounts app dependency issues
echo "Step 1: Resolving django-allauth and accounts app dependency conflicts..."
# Check if we have the inconsistent state where account is applied but accounts is not
ACCOUNTS_INITIAL_APPLIED=$(python manage.py showmigrations accounts | grep "0001_initial" | grep -c "^\[X\]" || echo "0")
ACCOUNT_INITIAL_APPLIED=$(python manage.py showmigrations account | grep "0001_initial" | grep -c "^\[X\]" || echo "0")

if [ "$ACCOUNTS_INITIAL_APPLIED" -eq 0 ] && [ "$ACCOUNT_INITIAL_APPLIED" -eq 1 ]; then
    echo "  → Detected dependency conflict: account.0001_initial applied before accounts.0001_initial"
    echo "  → Faking initial migration to resolve dependency order..."
    python manage.py migrate accounts 0001_initial --fake-initial --no-input
    echo "  → Initial migration faked successfully"
else
    echo "  → No dependency conflicts detected"
fi

# Step 2: Create any missing migrations
echo "Step 2: Creating any missing migrations..."
python manage.py makemigrations --no-input

# Step 3: Apply all migrations
echo "Step 3: Applying all migrations..."
python manage.py migrate --no-input

echo "=== Migration Handling Complete ==="

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!"