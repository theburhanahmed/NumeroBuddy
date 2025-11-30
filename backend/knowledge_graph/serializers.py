"""
Serializers for knowledge_graph app.
"""
from rest_framework import serializers
from .models import NumberRelationship, NumerologyPattern, NumerologyRule


class NumberRelationshipSerializer(serializers.ModelSerializer):
    """Serializer for number relationships."""
    
    relationship_type_display = serializers.CharField(source='get_relationship_type_display', read_only=True)
    
    class Meta:
        model = NumberRelationship
        fields = [
            'id', 'number1', 'number2', 'relationship_type',
            'relationship_type_display', 'strength', 'description',
            'examples', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NumerologyPatternSerializer(serializers.ModelSerializer):
    """Serializer for numerology patterns."""
    
    pattern_type_display = serializers.CharField(source='get_pattern_type_display', read_only=True)
    
    class Meta:
        model = NumerologyPattern
        fields = [
            'id', 'user', 'pattern_type', 'pattern_type_display',
            'pattern_data', 'description', 'significance',
            'confidence_score', 'discovered_at'
        ]
        read_only_fields = ['id', 'discovered_at']


class NumerologyRuleSerializer(serializers.ModelSerializer):
    """Serializer for numerology rules."""
    
    rule_type_display = serializers.CharField(source='get_rule_type_display', read_only=True)
    
    class Meta:
        model = NumerologyRule
        fields = [
            'id', 'rule_type', 'rule_type_display', 'rule_name',
            'rule_condition', 'rule_result', 'examples',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

