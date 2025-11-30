"""
Social Graph models for user connections and interactions.
"""
import uuid
from django.db import models


class Connection(models.Model):
    """User-to-user connections."""
    
    CONNECTION_TYPES = [
        ('friend', 'Friend'),
        ('follower', 'Follower'),
        ('following', 'Following'),
        ('blocked', 'Blocked'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='connections_initiated')
    user2 = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='connections_received')
    connection_type = models.CharField(max_length=20, choices=CONNECTION_TYPES, default='friend')
    is_mutual = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'connections'
        unique_together = [['user1', 'user2']]
        indexes = [
            models.Index(fields=['user1', 'connection_type']),
            models.Index(fields=['user2', 'connection_type']),
        ]
    
    def __str__(self):
        return f"{self.user1} - {self.user2} ({self.connection_type})"


class Interaction(models.Model):
    """Social interactions between users."""
    
    INTERACTION_TYPES = [
        ('compatibility_shared', 'Compatibility Shared'),
        ('insight_shared', 'Insight Shared'),
        ('profile_viewed', 'Profile Viewed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='interactions_sent')
    to_user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='interactions_received')
    interaction_type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'interactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['from_user', 'to_user']),
            models.Index(fields=['interaction_type', 'created_at']),
        ]


class SocialGroup(models.Model):
    """Numerology-based groups."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    group_type = models.CharField(max_length=100)  # e.g., "life_path_7", "personal_year_1"
    members = models.ManyToManyField('accounts.User', related_name='social_groups')
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='groups_created')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_groups'
        ordering = ['-created_at']
