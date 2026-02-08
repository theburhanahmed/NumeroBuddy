# Data migration: copy BreakthroughYear and CrisisYear into PredictiveCycle (unified model).

from django.db import migrations


def migrate_breakthrough_and_crisis_to_predictive(apps, schema_editor):
    BreakthroughYear = apps.get_model('numerology', 'BreakthroughYear')
    CrisisYear = apps.get_model('numerology', 'CrisisYear')
    PredictiveCycle = apps.get_model('numerology', 'PredictiveCycle')

    for b in BreakthroughYear.objects.all():
        PredictiveCycle.objects.get_or_create(
            user=b.user,
            cycle_type='breakthrough',
            year=b.year,
            defaults={
                'cycle_data': {
                    'personal_year': b.personal_year,
                    'breakthrough_type': b.breakthrough_type,
                    'description': b.description,
                    'preparation': b.preparation,
                },
                'confidence_score': b.confidence_score,
            },
        )

    for c in CrisisYear.objects.all():
        PredictiveCycle.objects.get_or_create(
            user=c.user,
            cycle_type='crisis',
            year=c.year,
            defaults={
                'cycle_data': {
                    'personal_year': c.personal_year,
                    'crisis_type': c.crisis_type,
                    'description': c.description,
                    'guidance': c.guidance,
                    'preparation_steps': getattr(c, 'preparation_steps', []) or [],
                },
                'severity_level': c.severity_level or 'medium',
            },
        )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('numerology', '0011_rename_numerology_user_ca_idx_numerology__user_id_7ca2a3_idx_and_more'),
    ]

    operations = [
        migrations.RunPython(migrate_breakthrough_and_crisis_to_predictive, noop_reverse),
    ]
