"""
Admin configuration for analytics app.
"""
from django.contrib import admin
from .models import UserBehavior, AnalyticsInsight, GrowthMetric


@admin.register(UserBehavior)
class UserBehaviorAdmin(admin.ModelAdmin):
    list_display = ['user', 'action_type', 'created_at']
    list_filter = ['action_type', 'created_at']
    search_fields = ['user__email', 'user__phone', 'action_type']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(AnalyticsInsight)
class AnalyticsInsightAdmin(admin.ModelAdmin):
    list_display = ['user', 'insight_type', 'title', 'confidence_score', 'is_read', 'created_at']
    list_filter = ['insight_type', 'is_read', 'confidence_score', 'created_at']
    search_fields = ['user__email', 'user__phone', 'title', 'content']
    ordering = ['-confidence_score', '-created_at']


@admin.register(GrowthMetric)
class GrowthMetricAdmin(admin.ModelAdmin):
    list_display = ['user', 'metric_type', 'metric_value', 'period_end', 'created_at']
    list_filter = ['metric_type', 'period_end', 'created_at']
    search_fields = ['user__email', 'user__phone']
    ordering = ['-period_end', '-created_at']
