# Generated migration for adding database indexes to NumerologyProfile

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('numerology', '0009_breakthroughyear_crisisyear_emotionalcycle_and_more'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='numerologyprofile',
            index=models.Index(fields=['user', 'calculated_at'], name='numerology_user_ca_idx'),
        ),
        migrations.AddIndex(
            model_name='numerologyprofile',
            index=models.Index(fields=['calculation_system'], name='numerology_calc_sy_idx'),
        ),
        migrations.AddIndex(
            model_name='numerologyprofile',
            index=models.Index(fields=['updated_at'], name='numerology_updated_idx'),
        ),
    ]
