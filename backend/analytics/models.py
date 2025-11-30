"""
Analytics models for user behavior tracking and insights.
"""
import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField


class UserBehavior(models.Model):
    """Track user actions and engagement."""
    
    ACTION_TYPES = [
        ('feature_used', 'Feature Used'),
        ('page_viewed', 'Page Viewed'),
        ('calculation_performed', 'Calculation Performed'),
        ('report_generated', 'Report Generated'),
        ('reminder_set', 'Reminder Set'),
        ('decision_made', 'Decision Made'),
        ('insight_viewed', 'Insight Viewed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='behaviors')
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    action_details = models.JSONField(default=dict, blank=True)  # Additional action data
    session_id = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'user_behaviors'
        verbose_name = 'User Behavior'
        verbose_name_plural = 'User Behaviors'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['user', 'action_type']),
            models.Index(fields=['action_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_action_type_display()} by {self.user} at {self.created_at}"


class AnalyticsInsight(models.Model):
    """Generated insights from user behavior."""
    
    INSIGHT_TYPES = [
        ('engagement', 'Engagement'),
        ('usage_pattern', 'Usage Pattern'),
        ('growth', 'Growth'),
        ('recommendation', 'Recommendation'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='analytics_insights')
    insight_type = models.CharField(max_length=50, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    insight_data = models.JSONField(default=dict, blank=True)  # Supporting data
    confidence_score = models.FloatField(default=0.5)  # 0-1
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_insights'
        verbose_name = 'Analytics Insight'
        verbose_name_plural = 'Analytics Insights'
        ordering = ['-confidence_score', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'insight_type']),
        ]
    
    def __str__(self):
        return f"{self.title} for {self.user}"


class GrowthMetric(models.Model):
    """Personal growth metrics tracking."""
    
    METRIC_TYPES = [
        ('feature_adoption', 'Feature Adoption'),
        ('engagement_score', 'Engagement Score'),
        ('accuracy_tracking', 'Accuracy Tracking'),
        ('consistency', 'Consistency'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='growth_metrics')
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    metric_value = models.FloatField()
    metric_data = models.JSONField(default=dict, blank=True)
    period_start = models.DateField()
    period_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'growth_metrics'
        verbose_name = 'Growth Metric'
        verbose_name_plural = 'Growth Metrics'
        ordering = ['-period_end', '-created_at']
        indexes = [
            models.Index(fields=['user', 'metric_type']),
            models.Index(fields=['user', 'period_end']),
        ]
    
    def __str__(self):
        return f"{self.get_metric_type_display()} for {self.user}: {self.metric_value}"
