"""
Admin configuration for knowledge_graph app.
"""
from django.contrib import admin
from .models import NumberRelationship, NumerologyPattern, NumerologyRule


@admin.register(NumberRelationship)
class NumberRelationshipAdmin(admin.ModelAdmin):
    list_display = ['number1', 'number2', 'relationship_type', 'strength', 'created_at']
    list_filter = ['relationship_type', 'strength', 'created_at']
    search_fields = ['number1', 'number2', 'description']
    ordering = ['number1', 'number2']


@admin.register(NumerologyPattern)
class NumerologyPatternAdmin(admin.ModelAdmin):
    list_display = ['user', 'pattern_type', 'confidence_score', 'discovered_at']
    list_filter = ['pattern_type', 'confidence_score', 'discovered_at']
    search_fields = ['user__email', 'user__phone', 'description']
    ordering = ['-confidence_score', '-discovered_at']


@admin.register(NumerologyRule)
class NumerologyRuleAdmin(admin.ModelAdmin):
    list_display = ['rule_name', 'rule_type', 'is_active', 'created_at']
    list_filter = ['rule_type', 'is_active', 'created_at']
    search_fields = ['rule_name', 'rule_result']
    ordering = ['rule_type', 'rule_name']
