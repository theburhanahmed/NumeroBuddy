"""
Django admin configuration for reports models.
"""
from django.contrib import admin
from .models import ReportTemplate, GeneratedReport


@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    """Admin interface for ReportTemplate model."""
    
    list_display = ['name', 'report_type', 'is_premium', 'is_active', 'created_at']
    list_filter = ['report_type', 'is_premium', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'description', 'report_type')}),
        ('Settings', {'fields': ('is_premium', 'is_active', 'required_data')}),
        ('Content', {'fields': ('content_template',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    """Admin interface for GeneratedReport model."""
    
    list_display = ['user', 'template', 'title', 'created_at']
    list_filter = ['template__report_type', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'title']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User & Template', {'fields': ('user', 'template')}),
        ('Report Details', {'fields': ('title', 'content')}),
        ('Metadata', {'fields': ('metadata',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']