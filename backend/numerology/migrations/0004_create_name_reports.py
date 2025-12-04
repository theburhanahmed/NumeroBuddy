# Generated manually for name numerology feature

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('numerology', '0003_dailyreading_llm_explanation_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='NameReport',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.TextField(help_text='Original name input')),
                ('name_type', models.CharField(choices=[('birth', 'Birth Name'), ('current', 'Current Name'), ('nickname', 'Nickname')], max_length=20)),
                ('system', models.CharField(choices=[('pythagorean', 'Pythagorean'), ('chaldean', 'Chaldean')], max_length=20)),
                ('normalized_name', models.TextField(help_text='Normalized name after processing')),
                ('numbers', models.JSONField(help_text='Expression, soul_urge, personality, name_vibration')),
                ('breakdown', models.JSONField(help_text='Per-letter breakdown and word breakdown')),
                ('explanation', models.JSONField(blank=True, help_text='LLM result: short_summary, long_explanation, action_points', null=True)),
                ('explanation_error', models.TextField(blank=True, help_text='Error message if LLM explanation failed', null=True)),
                ('computed_at', models.DateTimeField(auto_now_add=True)),
                ('version', models.IntegerField(default=1, help_text='Report version for tracking changes')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='name_reports', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Name Report',
                'verbose_name_plural': 'Name Reports',
                'db_table': 'name_reports',
                'ordering': ['-computed_at'],
            },
        ),
        migrations.AddIndex(
            model_name='namereport',
            index=models.Index(fields=['user', 'name_type', 'system'], name='name_reports_user_system_idx'),
        ),
        migrations.AddIndex(
            model_name='namereport',
            index=models.Index(fields=['user', 'computed_at'], name='name_reports_user_computed_idx'),
        ),
        migrations.AddIndex(
            model_name='namereport',
            index=models.Index(fields=['name_type', 'system'], name='name_reports_type_system_idx'),
        ),
    ]

