"""
Serializers for calendar app.
"""
from rest_framework import serializers
from .models import NumerologyEvent, PersonalCycle, AuspiciousDate, CalendarReminder


class NumerologyEventSerializer(serializers.ModelSerializer):
    """Serializer for numerology events."""
    
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    
    class Meta:
        model = NumerologyEvent
        fields = [
            'id', 'event_type', 'event_type_display', 'event_date',
            'title', 'description', 'numerology_number', 'importance',
            'is_recurring', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PersonalCycleSerializer(serializers.ModelSerializer):
    """Serializer for personal cycles."""
    
    cycle_type_display = serializers.CharField(source='get_cycle_type_display', read_only=True)
    
    class Meta:
        model = PersonalCycle
        fields = [
            'id', 'cycle_type', 'cycle_type_display', 'cycle_number',
            'start_date', 'end_date', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AuspiciousDateSerializer(serializers.ModelSerializer):
    """Serializer for auspicious dates."""
    
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = AuspiciousDate
        fields = [
            'id', 'activity_type', 'activity_type_display', 'activity_description',
            'auspicious_date', 'numerology_score', 'reasoning', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CalendarReminderSerializer(serializers.ModelSerializer):
    """Serializer for calendar reminders."""
    
    reminder_type_display = serializers.CharField(source='get_reminder_type_display', read_only=True)
    
    class Meta:
        model = CalendarReminder
        fields = [
            'id', 'reminder_type', 'reminder_type_display', 'title',
            'description', 'reminder_date', 'reminder_time',
            'numerology_context', 'is_completed', 'is_recurring',
            'recurrence_pattern', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

