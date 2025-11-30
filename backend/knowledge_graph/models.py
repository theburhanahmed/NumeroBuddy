"""
Knowledge Graph models for Numerology relationships and patterns.
Initially using PostgreSQL, can be upgraded to Neo4j later.
"""
import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField


class NumberRelationship(models.Model):
    """Relationships between numerology numbers."""
    
    RELATIONSHIP_TYPES = [
        ('compatible', 'Compatible'),
        ('challenging', 'Challenging'),
        ('complementary', 'Complementary'),
        ('neutral', 'Neutral'),
        ('master_pair', 'Master Pair'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number1 = models.IntegerField(db_index=True)
    number2 = models.IntegerField(db_index=True)
    relationship_type = models.CharField(max_length=50, choices=RELATIONSHIP_TYPES)
    strength = models.IntegerField(default=5)  # 1-10 scale
    description = models.TextField()
    examples = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'number_relationships'
        verbose_name = 'Number Relationship'
        verbose_name_plural = 'Number Relationships'
        unique_together = [['number1', 'number2']]
        indexes = [
            models.Index(fields=['number1', 'number2']),
            models.Index(fields=['relationship_type']),
        ]
    
    def __str__(self):
        return f"{self.number1} - {self.number2} ({self.get_relationship_type_display()})"


class NumerologyPattern(models.Model):
    """Discovered patterns in numerology."""
    
    PATTERN_TYPES = [
        ('sequence', 'Number Sequence'),
        ('cycle', 'Cycle Pattern'),
        ('combination', 'Number Combination'),
        ('trend', 'Trend Pattern'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='numerology_patterns', null=True, blank=True)
    pattern_type = models.CharField(max_length=50, choices=PATTERN_TYPES)
    pattern_data = models.JSONField()  # Stores the pattern details
    description = models.TextField()
    significance = models.TextField()
    confidence_score = models.FloatField(default=0.5)  # 0-1 scale
    discovered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'numerology_patterns'
        verbose_name = 'Numerology Pattern'
        verbose_name_plural = 'Numerology Patterns'
        ordering = ['-confidence_score', '-discovered_at']
        indexes = [
            models.Index(fields=['user', 'pattern_type']),
            models.Index(fields=['pattern_type', 'confidence_score']),
        ]
    
    def __str__(self):
        return f"{self.get_pattern_type_display()} pattern for {self.user or 'Global'}"


class NumerologyRule(models.Model):
    """Rules and insights from the knowledge graph."""
    
    RULE_TYPES = [
        ('compatibility_rule', 'Compatibility Rule'),
        ('timing_rule', 'Timing Rule'),
        ('life_path_rule', 'Life Path Rule'),
        ('cycle_rule', 'Cycle Rule'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_type = models.CharField(max_length=50, choices=RULE_TYPES)
    rule_name = models.CharField(max_length=200)
    rule_condition = models.JSONField()  # Conditions for the rule
    rule_result = models.TextField()  # What the rule indicates
    examples = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'numerology_rules'
        verbose_name = 'Numerology Rule'
        verbose_name_plural = 'Numerology Rules'
        ordering = ['rule_type', 'rule_name']
        indexes = [
            models.Index(fields=['rule_type', 'is_active']),
        ]
    
    def __str__(self):
        return f"{self.rule_name} ({self.get_rule_type_display()})"
