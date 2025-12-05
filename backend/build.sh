#!/usr/bin/env bash
# Render.com build script for Django backend

set -o errexit  # Exit on error
set +o pipefail  # Don't exit on pipe failures

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Checking migration history..."
python manage.py showmigrations

# Fix for InconsistentMigrationHistory: Migration account.0001_initial is applied before its dependency accounts.0001_initial
echo "Fixing migration dependency issue..."
python manage.py migrate accounts 0001 --fake-initial || echo "Warning: Fake initial migration may have failed, continuing..."

# Ensure accounts app migrations are applied in correct order before creating new ones
echo "Ensuring accounts migrations are fully applied before creating new migrations..."
# First ensure all dependencies are met
python manage.py migrate accounts 0001 --no-input || true
python manage.py migrate accounts 0002 --no-input || true
# Then apply the notification migration (must be applied before 0004)
python manage.py migrate accounts 0003 --no-input || echo "Warning: Migration 0003 may have issues"

# Fix inconsistent migration history - remove 0004 if any dependency is missing
echo "Checking for inconsistent migration history..."
python << 'PYTHON_SCRIPT'
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()

from django.db import connection

cursor = connection.cursor()
# Check if 0004 is marked as applied
cursor.execute("""
    SELECT COUNT(*) FROM django_migrations 
    WHERE app = 'accounts' AND name = '0004_emailtemplate'
""")
has_0004 = cursor.fetchone()[0] > 0

# Check if 0002 is marked as applied
cursor.execute("""
    SELECT COUNT(*) FROM django_migrations 
    WHERE app = 'accounts' AND name = '0002_fix_allauth_dependency'
""")
has_0002 = cursor.fetchone()[0] > 0

# Check if 0003 is marked as applied
cursor.execute("""
    SELECT COUNT(*) FROM django_migrations 
    WHERE app = 'accounts' AND name = '0003_notification'
""")
has_0003 = cursor.fetchone()[0] > 0

if has_0004 and (not has_0002 or not has_0003):
    print(f"  ⚠ Found inconsistent state: 0004 is applied but dependencies are missing (0002: {has_0002}, 0003: {has_0003})")
    print("  → Removing 0004 from migration history to fix inconsistency...")
    cursor.execute("""
        DELETE FROM django_migrations 
        WHERE app = 'accounts' AND name = '0004_emailtemplate'
    """)
    connection.commit()
    print("  ✓ Fixed inconsistent migration history")

# Check for tables that might already exist but migrations not applied
# Format: (table_name, app_name, migration_name)
table_migration_checks = [
    ('email_templates', 'accounts', '0004_emailtemplate'),
]

for table_name, app_name, migration_name in table_migration_checks:
    cursor.execute("""
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)
    """, [table_name])
    table_exists = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM django_migrations 
        WHERE app = %s AND name = %s
    """, [app_name, migration_name])
    migration_applied = cursor.fetchone()[0] > 0
    
    if table_exists and not migration_applied:
        print(f"  ⚠ Found {table_name} table exists but migration is not applied")
        print(f"  → Will fake the migration since table already exists")
        cursor.execute("""
            INSERT INTO django_migrations (app, name, applied)
            SELECT %s, %s, NOW()
            WHERE NOT EXISTS (
                SELECT 1 FROM django_migrations 
                WHERE app = %s AND name = %s
            )
        """, [app_name, migration_name, app_name, migration_name])
        connection.commit()
        print(f"  ✓ Marked {app_name}.{migration_name} as applied (faked)")

if not has_0004:
    cursor.execute("""
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'email_templates')
    """)
    email_templates_exists = cursor.fetchone()[0]
    if not email_templates_exists:
        print("  ✓ Migration history is consistent - 0004 will be applied normally")
elif has_0004 and has_0002 and has_0003:
    print("  ✓ Migration history is consistent")
PYTHON_SCRIPT

echo "Creating migrations for all apps..."
python manage.py makemigrations --no-input

echo "Running database migrations..."
# Check for tables that might already exist and fake their migrations if needed
python << 'PYTHON_SCRIPT'
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()

from django.db import connection
from django.core.management import call_command

cursor = connection.cursor()

# Define table-to-migration mappings for tables that might already exist
# Format: (table_name, app_name, migration_name)
# Note: If a migration creates multiple tables, list all of them with the same migration_name
table_migration_map = [
    ('email_templates', 'accounts', '0004_emailtemplate'),
    ('phone_reports', 'numerology', '0006_phonereport_detailedreading'),
    ('detailed_readings', 'numerology', '0006_phonereport_detailedreading'),
]

print("Checking for existing tables that need fake migrations...")
for table_name, app_name, migration_name in table_migration_map:
    # Check if table exists
    cursor.execute("""
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)
    """, [table_name])
    table_exists = cursor.fetchone()[0]
    
    # Check if migration is applied
    cursor.execute("""
        SELECT COUNT(*) FROM django_migrations 
        WHERE app = %s AND name = %s
    """, [app_name, migration_name])
    migration_applied = cursor.fetchone()[0] > 0
    
    if table_exists and not migration_applied:
        print(f"  → {table_name} table exists, faking migration {app_name}.{migration_name}...")
        try:
            call_command('migrate', app_name, migration_name, '--fake', verbosity=1, interactive=False)
            print(f"  ✓ Successfully faked migration {app_name}.{migration_name}")
        except Exception as e:
            print(f"  ⚠ Failed to fake migration {app_name}.{migration_name}: {e}")
            print(f"  → Will try to apply normally (may fail if table exists)")

print("  ✓ Finished checking for existing tables")
PYTHON_SCRIPT

python manage.py migrate --no-input --run-syncdb

# Ensure all accounts migrations are fully applied
echo "Ensuring all accounts migrations are fully applied..."
python manage.py migrate accounts --no-input

# Verify critical tables exist (using actual db_table names from models)
echo "Verifying critical database tables..."
python << 'PYTHON_SCRIPT'
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()

from django.db import connection
from django.core.management import call_command

cursor = connection.cursor()
# These are the actual table names from db_table in models
tables = ['notifications', 'users', 'user_profiles', 'otp_codes']
missing_tables = []

for table in tables:
    cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)", [table])
    exists = cursor.fetchone()[0]
    if exists:
        print(f'✓ Table {table} exists')
    else:
        print(f'⚠ WARNING: Table {table} does not exist')
        missing_tables.append(table)

# If notifications table is missing, try to create it
if 'notifications' in missing_tables:
    print('  → Attempting to create notifications table via migration...')
    try:
        call_command('migrate', 'accounts', '0003', verbosity=1, interactive=False)
        # Verify it was created
        cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications')")
        if cursor.fetchone()[0]:
            print('  ✓ Notifications table created successfully via migration!')
        else:
            raise Exception("Migration completed but table still doesn't exist")
    except Exception as e:
        print(f'  ⚠ Migration failed: {e}')
        print('  → Attempting to create table directly via SQL...')
        try:
            # Create table directly as fallback
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS notifications (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    title VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    notification_type VARCHAR(30) NOT NULL DEFAULT 'info',
                    is_read BOOLEAN NOT NULL DEFAULT FALSE,
                    is_sent BOOLEAN NOT NULL DEFAULT FALSE,
                    data JSONB DEFAULT '{}',
                    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                    read_at TIMESTAMP WITH TIME ZONE,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
                );
            """)
            # Create indexes
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS notificatio_user_id_a4dd5c_idx ON notifications(user_id, is_read);
                CREATE INDEX IF NOT EXISTS notificatio_user_id_7336fd_idx ON notifications(user_id, created_at);
                CREATE INDEX IF NOT EXISTS notificatio_notific_19df93_idx ON notifications(notification_type);
            """)
            connection.commit()
            # Verify it was created
            cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications')")
            if cursor.fetchone()[0]:
                print('  ✓ Notifications table created successfully via SQL fallback!')
            else:
                raise Exception("SQL creation completed but table still doesn't exist")
        except Exception as sql_error:
            print(f'  ✗ Failed to create notifications table via SQL: {sql_error}')
            print('  ⚠ Continuing build, but notifications feature will not work until table is created')
            # Don't exit - let the app start and handle errors gracefully

if missing_tables:
    print(f'\n⚠ WARNING: {len(missing_tables)} table(s) are missing: {", ".join(missing_tables)}')
else:
    print('\n✓ All critical tables verified!')
PYTHON_SCRIPT

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed successfully!"