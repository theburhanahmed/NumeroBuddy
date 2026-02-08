"""
Admin configuration for dashboard app.
Activity feed is consolidated in analytics.UserActivityLog (see analytics admin).
"""
from django.contrib import admin
from .models import DashboardWidget, QuickInsight


@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    list_display = ['user', 'widget_type', 'position', 'is_visible', 'created_at']
    list_filter = ['widget_type', 'is_visible', 'created_at']
    search_fields = ['user__email', 'user__phone', 'widget_type']
    ordering = ['user', 'position']


@admin.register(QuickInsight)
class QuickInsightAdmin(admin.ModelAdmin):
    list_display = ['user', 'insight_type', 'title', 'priority', 'is_read', 'created_at']
    list_filter = ['insight_type', 'is_read', 'priority', 'created_at']
    search_fields = ['user__email', 'user__phone', 'title', 'content']
    ordering = ['-priority', '-created_at']
    readonly_fields = ['created_at']
