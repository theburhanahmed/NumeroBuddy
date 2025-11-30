"""
Matchmaking models for numerology-based matching.
"""
import uuid
from django.db import models


class Match(models.Model):
    """Numerology-based matches."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='matches_initiated')
    user2 = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='matches_received')
    match_score = models.IntegerField()  # 0-100
    match_details = models.JSONField(default=dict)  # Detailed compatibility breakdown
    is_mutual = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'matches'
        unique_together = [['user1', 'user2']]
        ordering = ['-match_score']
        indexes = [
            models.Index(fields=['user1', 'match_score']),
            models.Index(fields=['user2', 'match_score']),
        ]


class MatchPreference(models.Model):
    """User matching preferences."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='match_preferences')
    preferred_life_paths = models.JSONField(default=list, blank=True)
    min_compatibility_score = models.IntegerField(default=70)
    age_range_min = models.IntegerField(null=True, blank=True)
    age_range_max = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'match_preferences'
