"""
Django admin configuration for reports models.
"""
from django.contrib import admin
from .models import ReportTemplate, GeneratedReport, ScheduledReport, ReportComparison


@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    """Admin interface for ReportTemplate model."""
    
    list_display = ['name', 'report_type', 'is_premium', 'is_active', 'created_at']
    list_filter = ['report_type', 'is_premium', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'description', 'report_type')}),
        ('Settings', {'fields': ('is_premium', 'is_active')}),
        ('Content', {'fields': ('content_template', 'required_data')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    """Admin interface for GeneratedReport model."""
    
    list_display = ['user', 'person', 'template', 'title', 'generated_at']
    list_filter = ['template__report_type', 'generated_at']
    search_fields = ['user__email', 'user__full_name', 'title']
    ordering = ['-generated_at']
    
    fieldsets = (
        ('User & Template', {'fields': ('user', 'person', 'template')}),
        ('Report Details', {'fields': ('title', 'content')}),
        ('Metadata', {'fields': ('expires_at',)}),
        ('Timestamps', {'fields': ('generated_at',)}),
    )
    
    readonly_fields = ['generated_at']


@admin.register(ScheduledReport)
class ScheduledReportAdmin(admin.ModelAdmin):
    """Admin interface for ScheduledReport model."""
    
    list_display = ['user', 'person', 'template', 'schedule_frequency', 'next_run_date', 'is_active', 'last_run_at']
    list_filter = ['schedule_frequency', 'is_active', 'next_run_date', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'person__name', 'template__name']
    ordering = ['next_run_date']
    
    fieldsets = (
        ('User & Template', {'fields': ('user', 'person', 'template')}),
        ('Schedule', {'fields': ('schedule_frequency', 'next_run_date', 'is_active')}),
        ('Execution', {'fields': ('last_run_at',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ReportComparison)
class ReportComparisonAdmin(admin.ModelAdmin):
    """Admin interface for ReportComparison model."""
    
    list_display = ['user', 'report1', 'report2', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'user__full_name', 'report1__title', 'report2__title']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Reports', {'fields': ('report1', 'report2')}),
        ('Comparison', {'fields': ('comparison_data',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']