"""
Admin configuration for smart_calendar app.
"""
from django.contrib import admin
from .models import NumerologyEvent, PersonalCycle, AuspiciousDate, CalendarReminder


@admin.register(NumerologyEvent)
class NumerologyEventAdmin(admin.ModelAdmin):
    list_display = ['user', 'event_type', 'event_date', 'title', 'importance', 'created_at']
    list_filter = ['event_type', 'importance', 'event_date', 'created_at']
    search_fields = ['user__email', 'user__phone', 'title', 'description']
    ordering = ['event_date', '-importance']


@admin.register(PersonalCycle)
class PersonalCycleAdmin(admin.ModelAdmin):
    list_display = ['user', 'cycle_type', 'cycle_number', 'start_date', 'end_date']
    list_filter = ['cycle_type', 'cycle_number', 'start_date']
    search_fields = ['user__email', 'user__phone']
    ordering = ['start_date']


@admin.register(AuspiciousDate)
class AuspiciousDateAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'auspicious_date', 'numerology_score', 'created_at']
    list_filter = ['activity_type', 'numerology_score', 'auspicious_date']
    search_fields = ['user__email', 'user__phone', 'activity_description']
    ordering = ['auspicious_date', '-numerology_score']


@admin.register(CalendarReminder)
class CalendarReminderAdmin(admin.ModelAdmin):
    list_display = ['user', 'reminder_type', 'title', 'reminder_date', 'is_completed', 'created_at']
    list_filter = ['reminder_type', 'is_completed', 'is_recurring', 'reminder_date']
    search_fields = ['user__email', 'user__phone', 'title', 'description']
    ordering = ['reminder_date', 'reminder_time']
