from django.db import migrations
from django.utils import timezone

def add_default_report_templates(apps, schema_editor):
    ReportTemplate = apps.get_model('core', 'ReportTemplate')
    
    # Define default templates
    default_templates = [
        {
            'name': 'Basic Birth Chart',
            'description': 'A comprehensive analysis of your core numerology numbers including Life Path, Destiny, Soul Urge, and Personality numbers.',
            'report_type': 'basic',
            'is_premium': False,
            'is_active': True,
        },
        {
            'name': 'Detailed Analysis',
            'description': 'An in-depth exploration of all your numerology numbers with personalized interpretations and life guidance.',
            'report_type': 'detailed',
            'is_premium': False,
            'is_active': True,
        },
        {
            'name': 'Compatibility Report',
            'description': 'Analysis of compatibility between you and another person based on numerology calculations.',
            'report_type': 'compatibility',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Career Guidance',
            'description': 'Insights into your professional path, strengths, challenges, and optimal career directions based on your numerology profile.',
            'report_type': 'career',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Relationship Analysis',
            'description': 'Deep dive into your relationship patterns, compatibility factors, and advice for improving personal connections.',
            'report_type': 'relationship',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Financial Forecast',
            'description': 'Numerology-based insights into your financial patterns, opportunities, and strategies for wealth building.',
            'report_type': 'finance',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Health Insights',
            'description': 'Understanding your health patterns and wellness guidance through the lens of numerology.',
            'report_type': 'health',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Yearly Forecast',
            'description': 'Annual forecast based on your Personal Year number with predictions and guidance for the upcoming year.',
            'report_type': 'yearly',
            'is_premium': True,
            'is_active': True,
        },
        {
            'name': 'Monthly Guidance',
            'description': 'Monthly insights based on your Personal Month number with actionable advice and opportunities.',
            'report_type': 'monthly',
            'is_premium': False,
            'is_active': True,
        },
        {
            'name': 'Daily Reading',
            'description': 'Your personalized daily numerology reading with lucky numbers, colors, and actionable tips.',
            'report_type': 'daily',
            'is_premium': False,
            'is_active': True,
        }
    ]
    
    # Create templates
    for template_data in default_templates:
        # Check if template already exists
        existing = ReportTemplate.objects.filter(
            report_type=template_data['report_type']
        ).first()
        
        if not existing:
            ReportTemplate.objects.create(**template_data)

def reverse_add_default_report_templates(apps, schema_editor):
    ReportTemplate = apps.get_model('core', 'ReportTemplate')
    
    # Remove the default templates
    report_types = [
        'basic', 'detailed', 'compatibility', 'career', 'relationship',
        'finance', 'health', 'yearly', 'monthly', 'daily'
    ]
    
    ReportTemplate.objects.filter(report_type__in=report_types).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('core', '0007_passwordresettoken'),
    ]

    operations = [
        migrations.RunPython(
            add_default_report_templates,
            reverse_add_default_report_templates
        ),
    ]