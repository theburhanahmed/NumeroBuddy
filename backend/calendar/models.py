"""
Calendar models for Smart Numerology Calendar.
"""
import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class NumerologyEvent(models.Model):
    """Important dates based on numerology cycles."""
    
    EVENT_TYPES = [
        ('personal_year_start', 'Personal Year Start'),
        ('personal_month_start', 'Personal Month Start'),
        ('pinnacle_cycle', 'Pinnacle Cycle'),
        ('challenge_period', 'Challenge Period'),
        ('auspicious_day', 'Auspicious Day'),
        ('remedy_day', 'Remedy Practice Day'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='numerology_events')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    event_date = models.DateField(db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    numerology_number = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(33)])
    importance = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(10)])  # 1-10 scale
    is_recurring = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'numerology_events'
        verbose_name = 'Numerology Event'
        verbose_name_plural = 'Numerology Events'
        ordering = ['event_date', 'importance']
        indexes = [
            models.Index(fields=['user', 'event_date']),
            models.Index(fields=['user', 'event_type']),
            models.Index(fields=['event_date', 'importance']),
        ]
    
    def __str__(self):
        return f"{self.title} on {self.event_date} for {self.user}"


class PersonalCycle(models.Model):
    """Personal Year/Month/Day cycles for users."""
    
    CYCLE_TYPES = [
        ('personal_year', 'Personal Year'),
        ('personal_month', 'Personal Month'),
        ('personal_day', 'Personal Day'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='personal_cycles')
    cycle_type = models.CharField(max_length=20, choices=CYCLE_TYPES)
    cycle_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(9)])
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'personal_cycles'
        verbose_name = 'Personal Cycle'
        verbose_name_plural = 'Personal Cycles'
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['user', 'start_date']),
            models.Index(fields=['user', 'cycle_type']),
        ]
    
    def __str__(self):
        return f"{self.get_cycle_type_display()} {self.cycle_number} for {self.user}"


class AuspiciousDate(models.Model):
    """Calculated auspicious dates for specific activities."""
    
    ACTIVITY_TYPES = [
        ('wedding', 'Wedding'),
        ('business_start', 'Business Start'),
        ('travel', 'Travel'),
        ('important_decision', 'Important Decision'),
        ('health_treatment', 'Health Treatment'),
        ('education_start', 'Education Start'),
        ('property_purchase', 'Property Purchase'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='auspicious_dates')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    activity_description = models.CharField(max_length=500, blank=True)
    auspicious_date = models.DateField()
    numerology_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])  # 1-10 auspiciousness
    reasoning = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'auspicious_dates'
        verbose_name = 'Auspicious Date'
        verbose_name_plural = 'Auspicious Dates'
        ordering = ['auspicious_date', '-numerology_score']
        indexes = [
            models.Index(fields=['user', 'auspicious_date']),
            models.Index(fields=['user', 'activity_type']),
        ]
    
    def __str__(self):
        return f"Auspicious {self.get_activity_type_display()} date for {self.user} on {self.auspicious_date}"


class CalendarReminder(models.Model):
    """User-set reminders with numerology context."""
    
    REMINDER_TYPES = [
        ('remedy', 'Remedy Practice'),
        ('meditation', 'Meditation'),
        ('affirmation', 'Affirmation'),
        ('cycle_change', 'Cycle Change'),
        ('custom', 'Custom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='calendar_reminders')
    reminder_type = models.CharField(max_length=50, choices=REMINDER_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    reminder_date = models.DateField()
    reminder_time = models.TimeField(null=True, blank=True)
    numerology_context = models.TextField(blank=True)  # Why this date is significant
    is_completed = models.BooleanField(default=False)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=100, blank=True)  # e.g., "daily", "weekly", "monthly"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'calendar_reminders'
        verbose_name = 'Calendar Reminder'
        verbose_name_plural = 'Calendar Reminders'
        ordering = ['reminder_date', 'reminder_time']
        indexes = [
            models.Index(fields=['user', 'reminder_date']),
            models.Index(fields=['user', 'is_completed']),
            models.Index(fields=['reminder_date', 'is_completed']),
        ]
    
    def __str__(self):
        return f"{self.title} reminder for {self.user} on {self.reminder_date}"

