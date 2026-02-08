# Remove BreakthroughYear and CrisisYear; use PredictiveCycle with cycle_type.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('numerology', '0012_migrate_breakthrough_crisis_to_predictive'),
    ]

    operations = [
        migrations.DeleteModel(name='BreakthroughYear'),
        migrations.DeleteModel(name='CrisisYear'),
    ]
