"""
Django admin configuration for AI chat models.
"""
from django.contrib import admin
from .models import AIConversation, AIMessage


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    """Admin interface for AIConversation model."""
    
    list_display = ['user', 'started_at', 'message_count', 'is_active']
    list_filter = ['is_active', 'started_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-started_at']
    
    readonly_fields = ['started_at', 'last_message_at']


@admin.register(AIMessage)
class AIMessageAdmin(admin.ModelAdmin):
    """Admin interface for AIMessage model."""
    
    list_display = ['conversation', 'role', 'created_at', 'tokens_used']
    list_filter = ['role', 'created_at']
    search_fields = ['content']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at']