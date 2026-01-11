from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('account', '0001_initial'),
    ]

    operations = [
        # This migration serves as a dependency fixer to resolve the inconsistent migration history
        # between the custom 'accounts' app and django-allauth 'account' app.
        # It ensures that both initial migrations are properly recognized as applied.
        # Using RunPython with a no-op function instead of empty RunSQL for better compatibility
        migrations.RunPython(lambda apps, schema_editor: None, lambda apps, schema_editor: None),
    ]