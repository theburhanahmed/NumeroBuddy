"""
Decision Engine models for numerology-based decision analysis.
"""
import uuid
from django.db import models


class Decision(models.Model):
    """User decisions with numerology analysis."""
    
    DECISION_CATEGORIES = [
        ('career', 'Career'),
        ('relationship', 'Relationship'),
        ('financial', 'Financial'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('travel', 'Travel'),
        ('business', 'Business'),
        ('personal', 'Personal'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='decisions')
    decision_text = models.TextField()
    decision_category = models.CharField(max_length=50, choices=DECISION_CATEGORIES, default='personal')
    decision_date = models.DateField()  # When the decision is planned/needed
    analysis_date = models.DateTimeField(auto_now_add=True)
    
    # Numerology analysis results
    personal_day_number = models.IntegerField()
    personal_year_number = models.IntegerField()
    personal_month_number = models.IntegerField()
    timing_score = models.IntegerField()  # 1-10
    timing_reasoning = models.JSONField(default=list)
    recommendation = models.TextField()
    suggested_actions = models.JSONField(default=list)
    
    # Decision tracking
    is_made = models.BooleanField(default=False)
    made_date = models.DateField(null=True, blank=True)
    outcome_recorded = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'decisions'
        verbose_name = 'Decision'
        verbose_name_plural = 'Decisions'
        ordering = ['-analysis_date']
        indexes = [
            models.Index(fields=['user', 'decision_date']),
            models.Index(fields=['user', 'is_made']),
            models.Index(fields=['decision_category']),
        ]
    
    def __str__(self):
        return f"Decision: {self.decision_text[:50]}... by {self.user}"


class DecisionOutcome(models.Model):
    """Track decision results."""
    
    OUTCOME_TYPES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
        ('pending', 'Pending'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    decision = models.OneToOneField(Decision, on_delete=models.CASCADE, related_name='outcome')
    outcome_type = models.CharField(max_length=20, choices=OUTCOME_TYPES)
    outcome_description = models.TextField()
    satisfaction_score = models.IntegerField(null=True, blank=True)  # 1-10
    actual_date = models.DateField(null=True, blank=True)  # When decision was actually made/executed
    notes = models.TextField(blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'decision_outcomes'
        verbose_name = 'Decision Outcome'
        verbose_name_plural = 'Decision Outcomes'
        ordering = ['-recorded_at']
    
    def __str__(self):
        return f"Outcome for {self.decision} - {self.get_outcome_type_display()}"


class DecisionPattern(models.Model):
    """Learn from decision patterns."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='decision_patterns')
    pattern_type = models.CharField(max_length=100)  # e.g., "best_timing_for_career"
    pattern_data = models.JSONField()
    confidence_score = models.FloatField(default=0.5)  # 0-1
    discovered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'decision_patterns'
        verbose_name = 'Decision Pattern'
        verbose_name_plural = 'Decision Patterns'
        ordering = ['-confidence_score', '-discovered_at']
        indexes = [
            models.Index(fields=['user', 'pattern_type']),
        ]
    
    def __str__(self):
        return f"{self.pattern_type} pattern for {self.user}"
