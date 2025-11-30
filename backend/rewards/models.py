"""
Rewards Economy models.
"""
import uuid
from django.db import models


class Reward(models.Model):
    """Available rewards."""
    
    REWARD_TYPES = [
        ('premium_feature', 'Premium Feature'),
        ('discount', 'Discount'),
        ('badge', 'Badge'),
        ('points_bonus', 'Points Bonus'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    reward_type = models.CharField(max_length=50, choices=REWARD_TYPES)
    points_cost = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'rewards'
        ordering = ['points_cost']


class UserReward(models.Model):
    """User reward history."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='user_rewards')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    redeemed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_rewards'
        ordering = ['-redeemed_at']


class Achievement(models.Model):
    """Achievements/badges."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon_url = models.URLField(blank=True)
    points_awarded = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievements'
        ordering = ['points_awarded']


class UserAchievement(models.Model):
    """User achievements."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='user_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_achievements'
        unique_together = [['user', 'achievement']]
        ordering = ['-earned_at']


class PointsTransaction(models.Model):
    """Points tracking."""
    
    TRANSACTION_TYPES = [
        ('earned', 'Earned'),
        ('spent', 'Spent'),
        ('bonus', 'Bonus'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='points_transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    points = models.IntegerField()
    description = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'points_transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
        ]
