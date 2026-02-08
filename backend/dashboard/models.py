"""
Dashboard models for NumerAI OS.
"""
import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField


class DashboardWidget(models.Model):
    """User-customizable dashboard widgets."""
    
    WIDGET_TYPES = [
        ('daily_reading', 'Daily Reading'),
        ('birth_chart', 'Birth Chart'),
        ('calendar', 'Calendar'),
        ('co_pilot', 'AI Co-Pilot'),
        ('insights', 'Insights'),
        ('activity', 'Activity Feed'),
        ('quick_actions', 'Quick Actions'),
        ('remedies', 'Remedies'),
        ('compatibility', 'Compatibility'),
        ('analytics', 'Analytics'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='dashboard_widgets')
    widget_type = models.CharField(max_length=50, choices=WIDGET_TYPES)
    position = models.IntegerField(default=0)  # For ordering
    is_visible = models.BooleanField(default=True)
    config = models.JSONField(default=dict, blank=True)  # Widget-specific configuration
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_widgets'
        verbose_name = 'Dashboard Widget'
        verbose_name_plural = 'Dashboard Widgets'
        ordering = ['position']
        unique_together = ['user', 'widget_type']
        indexes = [
            models.Index(fields=['user', 'position']),
            models.Index(fields=['user', 'is_visible']),
        ]
    
    def __str__(self):
        return f"{self.get_widget_type_display()} for {self.user}"


# UserActivity deprecated: activity tracking consolidated in analytics.UserActivityLog.
# See dashboard/serializers.ACTIVITY_TYPE_LABELS for feed display labels.


class QuickInsight(models.Model):
    """AI-generated quick insights for dashboard."""
    
    INSIGHT_TYPES = [
        ('daily_tip', 'Daily Tip'),
        ('cycle_reminder', 'Cycle Reminder'),
        ('pattern_discovery', 'Pattern Discovery'),
        ('recommendation', 'Recommendation'),
        ('alert', 'Alert'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='quick_insights')
    insight_type = models.CharField(max_length=50, choices=INSIGHT_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    action_url = models.CharField(max_length=500, blank=True, null=True)  # URL to navigate to
    action_text = models.CharField(max_length=100, blank=True, null=True)  # Button text
    priority = models.IntegerField(default=0)  # Higher = more important
    is_read = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)  # When insight expires
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'quick_insights'
        verbose_name = 'Quick Insight'
        verbose_name_plural = 'Quick Insights'
        ordering = ['-priority', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', 'expires_at']),
            models.Index(fields=['insight_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} for {self.user}"
