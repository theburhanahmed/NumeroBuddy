"""
Admin configuration for social app.
"""
from django.contrib import admin
from .models import Connection, Interaction, SocialGroup


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'connection_type', 'is_mutual', 'created_at']
    list_filter = ['connection_type', 'is_mutual', 'created_at']
    search_fields = ['user1__email', 'user2__email']
    ordering = ['-created_at']


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ['from_user', 'to_user', 'interaction_type', 'created_at']
    list_filter = ['interaction_type', 'created_at']
    search_fields = ['from_user__email', 'to_user__email']
    ordering = ['-created_at']


@admin.register(SocialGroup)
class SocialGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'group_type', 'created_by', 'created_at']
    list_filter = ['group_type', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    filter_horizontal = ['members']
