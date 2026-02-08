# Remove deprecated UserActivity model; activity feed uses analytics.UserActivityLog.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_migrate_user_activities_to_analytics'),
    ]

    operations = [
        migrations.DeleteModel(name='UserActivity'),
    ]
