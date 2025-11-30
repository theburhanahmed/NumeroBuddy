"""
Serializers for dashboard app.
"""
from rest_framework import serializers
from .models import DashboardWidget, UserActivity, QuickInsight


class DashboardWidgetSerializer(serializers.ModelSerializer):
    """Serializer for dashboard widgets."""
    
    widget_type_display = serializers.CharField(source='get_widget_type_display', read_only=True)
    
    class Meta:
        model = DashboardWidget
        fields = [
            'id', 'widget_type', 'widget_type_display', 'position',
            'is_visible', 'config', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for user activities."""
    
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'activity_type', 'activity_type_display',
            'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class QuickInsightSerializer(serializers.ModelSerializer):
    """Serializer for quick insights."""
    
    insight_type_display = serializers.CharField(source='get_insight_type_display', read_only=True)
    
    class Meta:
        model = QuickInsight
        fields = [
            'id', 'insight_type', 'insight_type_display', 'title',
            'content', 'action_url', 'action_text', 'priority',
            'is_read', 'expires_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DashboardOverviewSerializer(serializers.Serializer):
    """Serializer for unified dashboard overview."""
    
    widgets = DashboardWidgetSerializer(many=True)
    insights = QuickInsightSerializer(many=True)
    recent_activities = UserActivitySerializer(many=True)
    daily_reading = serializers.DictField(required=False)
    numerology_profile = serializers.DictField(required=False)
    upcoming_events = serializers.ListField(required=False)
    stats = serializers.DictField(required=False)

