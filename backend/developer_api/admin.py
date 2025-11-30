"""
Admin configuration for developer_api app.
"""
from django.contrib import admin
from .models import APIKey, APIUsage


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ['user', 'key_name', 'is_active', 'rate_limit', 'created_at', 'last_used_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__email', 'user__phone', 'key_name', 'api_key']
    ordering = ['-created_at']
    readonly_fields = ['api_key', 'created_at', 'last_used_at']


@admin.register(APIUsage)
class APIUsageAdmin(admin.ModelAdmin):
    list_display = ['api_key', 'endpoint', 'method', 'response_status', 'response_time_ms', 'created_at']
    list_filter = ['method', 'response_status', 'created_at']
    search_fields = ['api_key__key_name', 'endpoint']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
