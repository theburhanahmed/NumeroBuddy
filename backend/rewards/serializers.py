"""
Serializers for rewards app.
"""
from rest_framework import serializers
from .models import Reward, UserReward, Achievement, UserAchievement, PointsTransaction


class RewardSerializer(serializers.ModelSerializer):
    """Serializer for rewards."""
    
    reward_type_display = serializers.CharField(source='get_reward_type_display', read_only=True)
    
    class Meta:
        model = Reward
        fields = [
            'id', 'name', 'description', 'reward_type',
            'reward_type_display', 'points_cost', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserRewardSerializer(serializers.ModelSerializer):
    """Serializer for user rewards."""
    
    reward_name = serializers.CharField(source='reward.name', read_only=True)
    
    class Meta:
        model = UserReward
        fields = [
            'id', 'user', 'reward', 'reward_name', 'redeemed_at'
        ]
        read_only_fields = ['id', 'redeemed_at']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements."""
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon_url',
            'points_awarded', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for user achievements."""
    
    achievement_name = serializers.CharField(source='achievement.name', read_only=True)
    achievement_description = serializers.CharField(source='achievement.description', read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = [
            'id', 'user', 'achievement', 'achievement_name',
            'achievement_description', 'earned_at'
        ]
        read_only_fields = ['id', 'earned_at']


class PointsTransactionSerializer(serializers.ModelSerializer):
    """Serializer for points transactions."""
    
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = PointsTransaction
        fields = [
            'id', 'user', 'transaction_type', 'transaction_type_display',
            'points', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

