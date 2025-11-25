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