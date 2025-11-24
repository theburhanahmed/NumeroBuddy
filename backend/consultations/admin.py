"""
Django admin configuration for consultations models.
"""
from django.contrib import admin
from .models import Expert, Consultation, ConsultationReview


@admin.register(Expert)
class ExpertAdmin(admin.ModelAdmin):
    """Admin interface for Expert model."""
    
    list_display = ['name', 'email', 'specialty', 'experience_years', 'is_active', 'created_at']
    list_filter = ['specialty', 'is_active', 'created_at']
    search_fields = ['name', 'email', 'bio']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {'fields': ('name', 'email', 'specialty', 'experience_years')}),
        ('Profile', {'fields': ('bio', 'profile_picture_url', 'languages')}),
        ('Status', {'fields': ('is_active', 'rating')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    """Admin interface for Consultation model."""
    
    list_display = ['user', 'expert', 'scheduled_time', 'status', 'created_at']
    list_filter = ['status', 'scheduled_time', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'expert__name']
    ordering = ['-scheduled_time']
    
    fieldsets = (
        ('Participants', {'fields': ('user', 'expert')}),
        ('Schedule', {'fields': ('scheduled_time', 'duration_minutes')}),
        ('Status', {'fields': ('status', 'notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ConsultationReview)
class ConsultationReviewAdmin(admin.ModelAdmin):
    """Admin interface for ConsultationReview model."""
    
    list_display = ['user', 'expert', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'expert__name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Participants', {'fields': ('user', 'expert', 'consultation')}),
        ('Review', {'fields': ('rating', 'comment')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']