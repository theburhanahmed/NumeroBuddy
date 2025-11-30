"""
Admin configuration for decisions app.
"""
from django.contrib import admin
from .models import Decision, DecisionOutcome, DecisionPattern


@admin.register(Decision)
class DecisionAdmin(admin.ModelAdmin):
    list_display = ['user', 'decision_category', 'decision_date', 'timing_score', 'is_made', 'created_at']
    list_filter = ['decision_category', 'is_made', 'outcome_recorded', 'created_at']
    search_fields = ['user__email', 'user__phone', 'decision_text']
    ordering = ['-analysis_date']
    readonly_fields = ['analysis_date', 'created_at', 'updated_at']


@admin.register(DecisionOutcome)
class DecisionOutcomeAdmin(admin.ModelAdmin):
    list_display = ['decision', 'outcome_type', 'satisfaction_score', 'recorded_at']
    list_filter = ['outcome_type', 'recorded_at']
    search_fields = ['decision__decision_text', 'outcome_description']
    ordering = ['-recorded_at']
    readonly_fields = ['recorded_at']


@admin.register(DecisionPattern)
class DecisionPatternAdmin(admin.ModelAdmin):
    list_display = ['user', 'pattern_type', 'confidence_score', 'discovered_at']
    list_filter = ['pattern_type', 'confidence_score', 'discovered_at']
    search_fields = ['user__email', 'user__phone', 'pattern_type']
    ordering = ['-confidence_score', '-discovered_at']
