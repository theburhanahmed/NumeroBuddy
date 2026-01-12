"""
Admin configuration for payments application.
"""
from django.contrib import admin
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
from .models import Subscription, Payment, BillingHistory, WebhookEvent


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Subscription model."""
    list_display = ['user', 'plan', 'status', 'current_period_end', 'created_at']
    list_filter = ['status', 'plan', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'stripe_subscription_id', 'stripe_customer_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Subscription Details', {
            'fields': ('plan', 'status', 'stripe_subscription_id', 'stripe_customer_id'),
            'description': 'Change the plan here to test feature availability. This will sync with the user\'s subscription_plan field.'
        }),
        ('Billing Period', {
            'fields': ('current_period_start', 'current_period_end', 'cancel_at_period_end', 'canceled_at'),
        }),
        ('Trial', {
            'fields': ('trial_start', 'trial_end'),
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
        }),
    )
    
    actions = ['set_plan_basic', 'set_plan_premium', 'set_plan_elite', 'activate_subscription', 'set_active_status']
    
    def set_plan_basic(self, request, queryset):
        """Set selected subscriptions to Basic plan."""
        count = 0
        for subscription in queryset:
            subscription.plan = 'basic'
            subscription.save()
            # Sync with user
            if subscription.user:
                subscription.user.subscription_plan = 'basic'
                subscription.user.is_premium = True
                subscription.user.save(update_fields=['subscription_plan', 'is_premium'])
            count += 1
        self.message_user(request, f'{count} subscription(s) set to Basic plan.', messages.SUCCESS)
    set_plan_basic.short_description = "Set selected subscriptions to Basic plan"
    
    def set_plan_premium(self, request, queryset):
        """Set selected subscriptions to Premium plan."""
        count = 0
        for subscription in queryset:
            subscription.plan = 'premium'
            subscription.save()
            # Sync with user
            if subscription.user:
                subscription.user.subscription_plan = 'premium'
                subscription.user.is_premium = True
                subscription.user.save(update_fields=['subscription_plan', 'is_premium'])
            count += 1
        self.message_user(request, f'{count} subscription(s) set to Premium plan.', messages.SUCCESS)
    set_plan_premium.short_description = "Set selected subscriptions to Premium plan"
    
    def set_plan_elite(self, request, queryset):
        """Set selected subscriptions to Elite plan."""
        count = 0
        for subscription in queryset:
            subscription.plan = 'elite'
            subscription.save()
            # Sync with user
            if subscription.user:
                subscription.user.subscription_plan = 'elite'
                subscription.user.is_premium = True
                subscription.user.save(update_fields=['subscription_plan', 'is_premium'])
            count += 1
        self.message_user(request, f'{count} subscription(s) set to Elite plan.', messages.SUCCESS)
    set_plan_elite.short_description = "Set selected subscriptions to Elite plan"
    
    def activate_subscription(self, request, queryset):
        """Activate selected subscriptions and set period dates."""
        count = 0
        now = timezone.now()
        for subscription in queryset:
            subscription.status = 'active'
            if not subscription.current_period_start:
                subscription.current_period_start = now
            if not subscription.current_period_end:
                subscription.current_period_end = now + timedelta(days=30)
            subscription.cancel_at_period_end = False
            subscription.save()
            # Sync with user
            if subscription.user:
                subscription.user.is_premium = True
                subscription.user.premium_expiry = subscription.current_period_end
                subscription.user.save(update_fields=['is_premium', 'premium_expiry'])
            count += 1
        self.message_user(request, f'{count} subscription(s) activated.', messages.SUCCESS)
    activate_subscription.short_description = "Activate selected subscriptions"
    
    def set_active_status(self, request, queryset):
        """Set status to active for selected subscriptions."""
        count = queryset.update(status='active')
        self.message_user(request, f'{count} subscription(s) status set to active.', messages.SUCCESS)
    set_active_status.short_description = "Set status to active"
    
    def save_model(self, request, obj, form, change):
        """Override save to sync with user's subscription_plan."""
        super().save_model(request, obj, form, change)
        # Sync subscription plan with user
        if obj.user:
            # Map subscription plan to user subscription_plan
            # Subscription plans: basic, premium, elite
            # User plans: free, basic, premium, elite
            user_plan = obj.plan  # They match for paid plans
            obj.user.subscription_plan = user_plan
            # Set is_premium based on plan
            obj.user.is_premium = obj.plan in ['basic', 'premium', 'elite']
            # Set premium_expiry if subscription is active
            if obj.status == 'active' and obj.current_period_end:
                obj.user.premium_expiry = obj.current_period_end
            obj.user.save(update_fields=['subscription_plan', 'is_premium', 'premium_expiry'])


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment model."""
    list_display = ['user', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['user__email', 'stripe_payment_intent_id', 'stripe_charge_id']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(BillingHistory)
class BillingHistoryAdmin(admin.ModelAdmin):
    """Admin interface for BillingHistory model."""
    list_display = ['user', 'amount', 'currency', 'description', 'created_at']
    list_filter = ['currency', 'created_at']
    search_fields = ['user__email', 'description']
    readonly_fields = ['id', 'created_at']


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    """Admin interface for WebhookEvent model."""
    list_display = ['stripe_event_id', 'event_type', 'processed', 'created_at']
    list_filter = ['event_type', 'processed', 'created_at']
    search_fields = ['stripe_event_id', 'event_type']
    readonly_fields = ['id', 'created_at', 'processed_at']
