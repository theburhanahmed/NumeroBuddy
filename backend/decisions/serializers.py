"""
Serializers for decisions app.
"""
from rest_framework import serializers
from .models import Decision, DecisionOutcome, DecisionPattern


class DecisionSerializer(serializers.ModelSerializer):
    """Serializer for decisions."""
    
    decision_category_display = serializers.CharField(source='get_decision_category_display', read_only=True)
    outcome = serializers.SerializerMethodField()
    
    class Meta:
        model = Decision
        fields = [
            'id', 'decision_text', 'decision_category', 'decision_category_display',
            'decision_date', 'analysis_date', 'personal_day_number',
            'personal_year_number', 'personal_month_number', 'timing_score',
            'timing_reasoning', 'recommendation', 'suggested_actions',
            'is_made', 'made_date', 'outcome_recorded', 'outcome',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'analysis_date', 'created_at', 'updated_at']
    
    def get_outcome(self, obj):
        if hasattr(obj, 'outcome'):
            return DecisionOutcomeSerializer(obj.outcome).data
        return None


class DecisionOutcomeSerializer(serializers.ModelSerializer):
    """Serializer for decision outcomes."""
    
    outcome_type_display = serializers.CharField(source='get_outcome_type_display', read_only=True)
    
    class Meta:
        model = DecisionOutcome
        fields = [
            'id', 'outcome_type', 'outcome_type_display', 'outcome_description',
            'satisfaction_score', 'actual_date', 'notes', 'recorded_at'
        ]
        read_only_fields = ['id', 'recorded_at']


class DecisionPatternSerializer(serializers.ModelSerializer):
    """Serializer for decision patterns."""
    
    class Meta:
        model = DecisionPattern
        fields = [
            'id', 'pattern_type', 'pattern_data', 'confidence_score', 'discovered_at'
        ]
        read_only_fields = ['id', 'discovered_at']

