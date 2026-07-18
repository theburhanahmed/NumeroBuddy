import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [('reports', '0004_reportcomparison_scheduledreport_and_more')]

    operations = [
        migrations.CreateModel(
            name='UniversalReport',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('report_type', models.CharField(choices=[('personal', 'Personal'), ('business', 'Business'), ('phone', 'Phone'), ('vehicle', 'Vehicle'), ('name', 'Name'), ('compatibility', 'Compatibility'), ('future', 'Future')], db_index=True, max_length=32)),
                ('title', models.CharField(max_length=200)),
                ('input_data', models.JSONField(blank=True, default=dict)),
                ('calculated_results', models.JSONField(blank=True, default=dict)),
                ('ai_insights', models.JSONField(blank=True, default=list)),
                ('recommendations', models.JSONField(blank=True, default=list)),
                ('remedies', models.JSONField(blank=True, default=list)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('is_saved', models.BooleanField(db_index=True, default=True)),
                ('is_pinned', models.BooleanField(db_index=True, default=False)),
                ('pdf_status', models.CharField(default='not_requested', max_length=20)),
                ('share_token', models.UUIDField(blank=True, null=True, unique=True)),
                ('report_version', models.PositiveIntegerField(default=1)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='universal_reports', to='accounts.user')),
            ],
            options={'db_table': 'universal_reports', 'ordering': ['-updated_at']},
        ),
        migrations.AddIndex(model_name='universalreport', index=models.Index(fields=['user', 'report_type', 'updated_at'], name='universal_r_user_id_8b9939_idx')),
        migrations.AddIndex(model_name='universalreport', index=models.Index(fields=['user', 'is_saved', 'updated_at'], name='universal_r_user_id_eaa0ea_idx')),
    ]
