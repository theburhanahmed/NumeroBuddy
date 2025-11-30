"""
Serializers for analytics app.
"""
from rest_framework import serializers
from .models import UserBehavior, AnalyticsInsight, GrowthMetric


class UserBehaviorSerializer(serializers.ModelSerializer):
    """Serializer for user behaviors."""
    
    action_type_display = serializers.CharField(source='get_action_type_display', read_only=True)
    
    class Meta:
        model = UserBehavior
        fields = [
            'id', 'action_type', 'action_type_display', 'action_details',
            'session_id', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AnalyticsInsightSerializer(serializers.ModelSerializer):
    """Serializer for analytics insights."""
    
    insight_type_display = serializers.CharField(source='get_insight_type_display', read_only=True)
    
    class Meta:
        model = AnalyticsInsight
        fields = [
            'id', 'insight_type', 'insight_type_display', 'title',
            'content', 'insight_data', 'confidence_score',
            'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class GrowthMetricSerializer(serializers.ModelSerializer):
    """Serializer for growth metrics."""
    
    metric_type_display = serializers.CharField(source='get_metric_type_display', read_only=True)
    
    class Meta:
        model = GrowthMetric
        fields = [
            'id', 'metric_type', 'metric_type_display', 'metric_value',
            'metric_data', 'period_start', 'period_end', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

