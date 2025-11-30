"""
Admin configuration for rewards app.
"""
from django.contrib import admin
from .models import Reward, UserReward, Achievement, UserAchievement, PointsTransaction


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'reward_type', 'points_cost', 'is_active', 'created_at']
    list_filter = ['reward_type', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['points_cost']


@admin.register(UserReward)
class UserRewardAdmin(admin.ModelAdmin):
    list_display = ['user', 'reward', 'redeemed_at']
    list_filter = ['redeemed_at']
    search_fields = ['user__email', 'reward__name']
    ordering = ['-redeemed_at']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'points_awarded', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['points_awarded']


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'earned_at']
    list_filter = ['earned_at']
    search_fields = ['user__email', 'achievement__name']
    ordering = ['-earned_at']


@admin.register(PointsTransaction)
class PointsTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'points', 'description', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['user__email', 'description']
    ordering = ['-created_at']
