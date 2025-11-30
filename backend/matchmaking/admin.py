"""
Admin configuration for matchmaking app.
"""
from django.contrib import admin
from .models import Match, MatchPreference


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'match_score', 'is_mutual', 'created_at']
    list_filter = ['is_mutual', 'created_at']
    search_fields = ['user1__email', 'user2__email']
    ordering = ['-match_score', '-created_at']


@admin.register(MatchPreference)
class MatchPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'min_compatibility_score', 'created_at', 'updated_at']
    search_fields = ['user__email', 'user__phone']
    ordering = ['-updated_at']
    readonly_fields = ['created_at', 'updated_at']
