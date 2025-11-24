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
        ('Profile', {'fields': ('bio', 'profile_picture_url')}),
        ('Status', {'fields': ('is_active', 'rating')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    """Admin interface for Consultation model."""
    
    list_display = ['user', 'expert', 'scheduled_at', 'status', 'created_at']
    list_filter = ['status', 'scheduled_at', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'expert__name']
    ordering = ['-scheduled_at']
    
    fieldsets = (
        ('Participants', {'fields': ('user', 'expert')}),
        ('Schedule', {'fields': ('scheduled_at', 'duration_minutes')}),
        ('Status', {'fields': ('status', 'notes')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ConsultationReview)
class ConsultationReviewAdmin(admin.ModelAdmin):
    """Admin interface for ConsultationReview model."""
    
    list_display = ['get_user_email', 'get_expert_name', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['consultation__user__email', 'consultation__user__full_name', 'consultation__expert__name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Review', {'fields': ('consultation', 'rating', 'review_text', 'is_anonymous')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']
    
    @admin.display(description='User Email', ordering='consultation__user__email')
    def get_user_email(self, obj):
        return obj.consultation.user.email
    
    @admin.display(description='Expert Name', ordering='consultation__expert__name')
    def get_expert_name(self, obj):
        return obj.consultation.expert.name
