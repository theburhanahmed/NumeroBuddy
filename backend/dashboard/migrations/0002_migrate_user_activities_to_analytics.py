# Data migration: copy dashboard user_activities to analytics user_activity_log
# so activity feed continues to work after consolidating on UserActivityLog.

import uuid
from django.db import migrations, connection


def copy_activities_to_analytics(apps, schema_editor):
    """Copy rows from user_activities to user_activity_log, preserving created_at."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, user_id, activity_type, metadata, created_at FROM user_activities")
        rows = cursor.fetchall()
    if not rows:
        return
    UserActivityLog = apps.get_model('analytics', 'UserActivityLog')
    to_create = []
    for row in rows:
        _id, user_id, activity_type, metadata, created_at = row
        to_create.append(
            UserActivityLog(
                id=uuid.uuid4(),
                user_id=user_id,
                activity_type=activity_type,
                activity_data=metadata or {},
                created_at=created_at,
            )
        )
    # Bulk insert with created_at set (bypass auto_now_add by setting the attribute)
    UserActivityLog.objects.bulk_create(to_create)


def noop_reverse(apps, schema_editor):
    """No reverse: we do not delete from user_activity_log (data is consolidated)."""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
        ('analytics', '0002_abtest_businessmetric_conversionfunnel_eventtracking_and_more'),
    ]

    operations = [
        migrations.RunPython(copy_activities_to_analytics, noop_reverse),
    ]
