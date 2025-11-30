"""
Admin configuration for dashboard app.
"""
from django.contrib import admin
from .models import DashboardWidget, UserActivity, QuickInsight


@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'widget_type', 'position', 'is_visible', 'created_at']
    list_filter = ['widget_type', 'is_visible', 'created_at']
    search_fields = ['user__email', 'user__phone', 'widget_type']
    ordering = ['user', 'position']


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'created_at']
    list_filter = ['activity_type', 'created_at']
    search_fields = ['user__email', 'user__phone', 'activity_type']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(QuickInsight)
class QuickInsightAdmin(admin.ModelAdmin):
    list_display = ['user', 'insight_type', 'title', 'priority', 'is_read', 'created_at']
    list_filter = ['insight_type', 'is_read', 'priority', 'created_at']
    search_fields = ['user__email', 'user__phone', 'title', 'content']
    ordering = ['-priority', '-created_at']
    readonly_fields = ['created_at']
