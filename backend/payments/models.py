"""
Payment models for NumerAI application.
"""
import uuid
from django.db import models
from django.utils import timezone
from accounts.models import User
from subscription_plans import PlanTier


class Subscription(models.Model):
    """User subscription model linked to Stripe."""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('canceled', 'Canceled'),
        ('past_due', 'Past Due'),
        ('trialing', 'Trialing'),
        ('unpaid', 'Unpaid'),
        ('incomplete', 'Incomplete'),
        ('incomplete_expired', 'Incomplete Expired'),
    ]
    
    PLAN_CHOICES = [choice for choice in PlanTier.choices if choice[0] != PlanTier.FREE]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    stripe_subscription_id = models.CharField(max_length=255, unique=True, db_index=True, null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=255, unique=True, db_index=True, null=True, blank=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='incomplete')
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)
    trial_start = models.DateTimeField(null=True, blank=True)
    trial_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['stripe_subscription_id']),
            models.Index(fields=['stripe_customer_id']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.plan} ({self.status})"
    
    def is_active(self):
        """Check if subscription is currently active."""
        return self.status in ('active', 'trialing') and (
            not self.current_period_end or self.current_period_end > timezone.now()
        )


class SubscriptionChange(models.Model):
    STATUS_CHOICES = [
        ('pending_checkout', 'Pending Checkout'),
        ('pending_period_end', 'Pending Period End'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
    ]
    CHANGE_TYPE_CHOICES = [
        ('checkout', 'Checkout'),
        ('upgrade', 'Upgrade'),
        ('downgrade', 'Downgrade'),
        ('cancel', 'Cancel'),
        ('sync', 'Synchronization'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_changes')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='changes')
    from_plan = models.CharField(max_length=20, choices=PlanTier.choices)
    to_plan = models.CharField(max_length=20, choices=PlanTier.choices)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    change_type = models.CharField(max_length=20, choices=CHANGE_TYPE_CHOICES)
    effective_at = models.DateTimeField(null=True, blank=True)
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='requested_subscription_changes')
    source = models.CharField(max_length=30, default='admin')
    stripe_checkout_session_id = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    stripe_schedule_id = models.CharField(max_length=255, null=True, blank=True)
    checkout_url = models.URLField(max_length=1000, null=True, blank=True)
    failure_reason = models.TextField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'subscription_changes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'effective_at']),
        ]

    def __str__(self):
        return f"{self.user} - {self.from_plan} to {self.to_plan} ({self.status})"


class Payment(models.Model):
    """Payment records from Stripe."""
    
    STATUS_CHOICES = [
        ('succeeded', 'Succeeded'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True, db_index=True, null=True, blank=True)
    stripe_charge_id = models.CharField(max_length=255, unique=True, db_index=True, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='usd')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['stripe_payment_intent_id']),
            models.Index(fields=['stripe_charge_id']),
        ]
    
    def __str__(self):
        return f"{self.user} - ${self.amount} ({self.status})"


class BillingHistory(models.Model):
    """Billing history for audit and user viewing."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='billing_history')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='billing_history')
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='billing_history')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='usd')
    description = models.TextField()
    invoice_url = models.URLField(max_length=500, null=True, blank=True)
    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'billing_history'
        verbose_name = 'Billing History'
        verbose_name_plural = 'Billing History'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user} - ${self.amount} - {self.description}"


class WebhookEvent(models.Model):
    """Store Stripe webhook events for auditing."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stripe_event_id = models.CharField(max_length=255, unique=True, db_index=True)
    event_type = models.CharField(max_length=100, db_index=True)
    payload = models.JSONField()
    processed = models.BooleanField(default=False)
    processing_error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'webhook_events'
        verbose_name = 'Webhook Event'
        verbose_name_plural = 'Webhook Events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['stripe_event_id']),
            models.Index(fields=['event_type', 'processed']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.stripe_event_id}"
