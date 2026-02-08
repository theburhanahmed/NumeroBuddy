"""
Serializers for dashboard app.
"""
from rest_framework import serializers
from .models import DashboardWidget, QuickInsight


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


# Activity types display labels (aligned with former dashboard UserActivity.ACTIVITY_TYPES)
ACTIVITY_TYPE_LABELS = {
    'birth_chart_viewed': 'Birth Chart Viewed',
    'daily_reading_viewed': 'Daily Reading Viewed',
    'compatibility_checked': 'Compatibility Checked',
    'remedy_tracked': 'Remedy Tracked',
    'ai_chat_used': 'AI Chat Used',
    'report_generated': 'Report Generated',
    'profile_updated': 'Profile Updated',
    'person_added': 'Person Added',
    'consultation_booked': 'Consultation Booked',
}


class UserActivitySerializer(serializers.Serializer):
    """
    Serializer for activity feed items from analytics.UserActivityLog.
    Exposes activity_data as metadata for API compatibility.
    """
    id = serializers.UUIDField(read_only=True)
    activity_type = serializers.CharField(read_only=True)
    activity_type_display = serializers.SerializerMethodField()
    metadata = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)

    def get_activity_type_display(self, obj):
        return ACTIVITY_TYPE_LABELS.get(obj.activity_type, obj.activity_type.replace('_', ' ').title())

    def get_metadata(self, obj):
        return getattr(obj, 'activity_data', {})


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

