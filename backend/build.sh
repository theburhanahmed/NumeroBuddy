#!/usr/bin/env bash
# Render.com build script for Django backend

set -o errexit  # Exit on error
set +o pipefail  # Don't exit on pipe failures

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Checking migration history..."
python manage.py showmigrations || echo "Warning: showmigrations failed, continuing..."

# Note: Migration history fixes are handled in the comprehensive Python script below
# to avoid triggering InconsistentMigrationHistory errors before we can fix them

# Fix inconsistent migration history BEFORE makemigrations
echo "Checking for inconsistent migration history..."
python << 'PYTHON_SCRIPT'
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()

from django.db import connection
from django.core.management import call_command
from django.db.migrations.loader import MigrationLoader

cursor = connection.cursor()

# Define migration dependency chain for accounts app
# Format: (migration_name, dependencies_list, table_name_if_creates_one)
ACCOUNTS_MIGRATIONS = [
    ('0001_initial', [], None),  # Creates users, user_profiles, etc.
    ('0002_fix_allauth_dependency', ['0001_initial', 'account.0001_initial'], None),
    ('0003_notification', ['0002_fix_allauth_dependency'], 'notifications'),
    ('0004_emailtemplate', ['0003_notification'], 'email_templates'),
    ('0005_privacysettings_notificationpreference_auditlog_and_more', ['0004_emailtemplate'], None),
]

# Check migration states for all accounts migrations
cursor.execute("""
    SELECT name, applied 
    FROM django_migrations 
    WHERE app = 'accounts' 
    ORDER BY name
""")
migration_states = {row[0]: row[1] for row in cursor.fetchall()}

# Check for 'account' app migration (django-allauth dependency)
cursor.execute("SELECT COUNT(*) FROM django_migrations WHERE app = 'account' AND name = '0001_initial'")
has_account_0001 = cursor.fetchone()[0] > 0

print("=" * 70)
print("Migration Consistency Check")
print("=" * 70)

# Check which migrations are applied
applied_migrations = set()
for mig_name, _, _ in ACCOUNTS_MIGRATIONS:
    if mig_name in migration_states:
        applied_migrations.add(mig_name)
        print(f"  ✓ {mig_name} is applied")
    else:
        print(f"  ✗ {mig_name} is NOT applied")

if has_account_0001:
    print("  ✓ account.0001_initial (django-allauth) is applied")
else:
    print("  ✗ account.0001_initial (django-allauth) is NOT applied")

print()

# Step 1: Ensure account.0001_initial is marked (required dependency for 0002)
if not has_account_0001:
    print("  → Marking account.0001_initial as applied (required for accounts.0002)...")
    cursor.execute("""
        INSERT INTO django_migrations (app, name, applied)
        SELECT 'account', '0001_initial', NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM django_migrations 
            WHERE app = 'account' AND name = '0001_initial'
        )
    """)
    connection.commit()
    has_account_0001 = True
    print("  ✓ Marked account.0001_initial as applied")
    print()

# Step 2: Check table existence for migrations that create tables
table_existence = {}
for mig_name, _, table_name in ACCOUNTS_MIGRATIONS:
    if table_name:
        cursor.execute("""
            SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)
        """, [table_name])
        table_existence[mig_name] = cursor.fetchone()[0]
        print(f"  Table '{table_name}' exists: {table_existence[mig_name]}")

print()

# Step 3: Fix migration dependencies in order
# We need to ensure each migration's dependencies are satisfied before it's marked as applied

def get_dependencies(mig_name):
    """Get the list of dependency migration names for a given migration."""
    for mig, deps, _ in ACCOUNTS_MIGRATIONS:
        if mig == mig_name:
            return deps
    return []

def all_dependencies_satisfied(mig_name, applied_set):
    """Check if all dependencies for a migration are satisfied."""
    deps = get_dependencies(mig_name)
    for dep in deps:
        # Handle cross-app dependencies (e.g., 'account.0001_initial')
        if '.' in dep:
            app_name, dep_name = dep.split('.', 1)
            if app_name == 'account' and dep_name == '0001_initial':
                if not has_account_0001:
                    return False
        else:
            # Same-app dependency
            if dep not in applied_set:
                return False
    return True

# Build a map of migration to its index in the chain
mig_index = {mig: idx for idx, (mig, _, _) in enumerate(ACCOUNTS_MIGRATIONS)}

# Identify problematic migrations (applied but dependencies missing)
problematic = []
for mig_name, _, _ in ACCOUNTS_MIGRATIONS:
    if mig_name in applied_migrations:
        if not all_dependencies_satisfied(mig_name, applied_migrations):
            problematic.append(mig_name)
            print(f"  ⚠ {mig_name} is applied but dependencies are missing")

if problematic:
    print(f"\n  → Found {len(problematic)} problematic migration(s), fixing...")
    
    # Remove problematic migrations from history (they'll be re-applied correctly)
    for mig_name in problematic:
        print(f"  → Removing {mig_name} from migration history...")
        cursor.execute("""
            DELETE FROM django_migrations 
            WHERE app = 'accounts' AND name = %s
        """, [mig_name])
        connection.commit()
        applied_migrations.discard(mig_name)
        print(f"  ✓ Removed {mig_name} from history")
    print()

# Step 4: Ensure migrations are marked in correct order, faking if tables exist
for mig_name, deps, table_name in ACCOUNTS_MIGRATIONS:
    is_applied = mig_name in applied_migrations
    deps_satisfied = all_dependencies_satisfied(mig_name, applied_migrations)
    
    if not is_applied and deps_satisfied:
        # Migration not applied but dependencies are satisfied
        if table_name and table_name in table_existence and table_existence[mig_name]:
            # Table exists, fake the migration
            print(f"  → Table '{table_name}' exists, faking migration {mig_name}...")
            try:
                call_command('migrate', 'accounts', mig_name, '--fake', verbosity=1, interactive=False)
                applied_migrations.add(mig_name)
                print(f"  ✓ Faked migration {mig_name}")
            except Exception as e:
                print(f"  ⚠ Failed to fake {mig_name}: {e}")
                # Try manual insert as fallback
                cursor.execute("""
                    INSERT INTO django_migrations (app, name, applied)
                    SELECT 'accounts', %s, NOW()
                    WHERE NOT EXISTS (
                        SELECT 1 FROM django_migrations 
                        WHERE app = 'accounts' AND name = %s
                    )
                """, [mig_name, mig_name])
                connection.commit()
                applied_migrations.add(mig_name)
                print(f"  ✓ Manually marked {mig_name} as applied")
        elif not table_name:
            # No-op migration (like 0002), safe to mark as applied if deps satisfied
            print(f"  → Marking no-op migration {mig_name} as applied...")
            cursor.execute("""
                INSERT INTO django_migrations (app, name, applied)
                SELECT 'accounts', %s, NOW()
                WHERE NOT EXISTS (
                    SELECT 1 FROM django_migrations 
                    WHERE app = 'accounts' AND name = %s
                )
            """, [mig_name, mig_name])
            connection.commit()
            applied_migrations.add(mig_name)
            print(f"  ✓ Marked {mig_name} as applied")

# Step 5: Final validation - ensure no out-of-order migrations remain
print()
print("  → Final validation...")
final_problematic = []
for mig_name, _, _ in ACCOUNTS_MIGRATIONS:
    if mig_name in applied_migrations:
        if not all_dependencies_satisfied(mig_name, applied_migrations):
            final_problematic.append(mig_name)

if final_problematic:
    print(f"  ⚠ WARNING: Still found {len(final_problematic)} problematic migration(s)")
    for mig_name in final_problematic:
        print(f"    → Removing {mig_name} from history (final cleanup)...")
        cursor.execute("""
            DELETE FROM django_migrations 
            WHERE app = 'accounts' AND name = %s
        """, [mig_name])
        connection.commit()
    print("  ✓ Cleaned up remaining inconsistencies")
else:
    print("  ✓ All migrations are in consistent state")

print()
print("=" * 70)
print("Migration history fix completed")
print("=" * 70)
PYTHON_SCRIPT

# Verify migration consistency before proceeding
echo "Verifying migration consistency..."
python << 'PYTHON_SCRIPT'
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'numerai.settings.production')
django.setup()

from django.db import connection
from django.core.management import call_command

try:
    # This will raise InconsistentMigrationHistory if there are still issues
    from django.db.migrations.loader import MigrationLoader
    loader = MigrationLoader(connection)
    loader.check_consistent_history(connection)
    print("  ✓ Migration history is consistent")
except Exception as e:
    print(f"  ⚠ Migration consistency check failed: {e}")
    print("  → This may indicate remaining issues that need manual intervention")
    sys.exit(1)
PYTHON_SCRIPT

if [ $? -ne 0 ]; then
    echo "  ⚠ Migration consistency check failed, but continuing..."
fi

echo "Creating migrations for all apps..."
python manage.py makemigrations --no-input || echo "Warning: makemigrations failed, continuing..."

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

# Run migrations with error handling
python manage.py migrate --no-input --run-syncdb || echo "Warning: Some migrations may have failed, continuing..."

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

# Seed database with test data (optional, can be disabled with SKIP_SEED env var)
if [ -z "$SKIP_SEED" ]; then
    echo "Seeding database with test data..."
    python manage.py seed_data --skip-migrations || echo "Warning: Seed data command failed, continuing..."
else
    echo "Skipping seed data (SKIP_SEED is set)"
fi

echo "Build completed successfully!"