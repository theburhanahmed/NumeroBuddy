"""
Django admin configuration for accounts models.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponse
from .models import User, UserProfile, OTPCode, RefreshToken, DeviceToken, EmailTemplate, PasswordResetToken, Notification, AuditLog
from .models_api_key import APIKey
from .models_notification_prefs import NotificationPreference
from .models_privacy import PrivacySettings
from .email_service import render_email_template


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    list_display = ['email', 'phone', 'full_name', 'is_verified', 'is_premium', 'subscription_plan', 'is_active', 'created_at']
    list_filter = ['is_verified', 'is_premium', 'is_active', 'subscription_plan', 'created_at']
    search_fields = ['email', 'phone', 'full_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'phone', 'password')}),
        ('Personal Info', {'fields': ('full_name',)}),
        ('Subscription & Status', {
            'fields': ('is_active', 'is_verified', 'is_premium', 'subscription_plan', 'premium_expiry'),
            'description': 'Change subscription_plan here to test feature availability. This will sync with the user\'s Subscription model if it exists.'
        }),
        ('Security', {'fields': ('failed_login_attempts', 'locked_until', 'last_login')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    
    actions = ['set_plan_free', 'set_plan_basic', 'set_plan_premium', 'set_plan_elite']
    
    def set_plan_free(self, request, queryset):
        """Set selected users to Free plan."""
        count = queryset.update(subscription_plan='free', is_premium=False, premium_expiry=None)
        # Also update related subscriptions if they exist
        from payments.models import Subscription
        for user in queryset:
            if hasattr(user, 'subscription'):
                user.subscription.status = 'canceled'
                user.subscription.save(update_fields=['status'])
        self.message_user(request, f'{count} user(s) set to Free plan.', messages.SUCCESS)
    set_plan_free.short_description = "Set selected users to Free plan"
    
    def set_plan_basic(self, request, queryset):
        """Set selected users to Basic plan."""
        count = 0
        for user in queryset:
            user.subscription_plan = 'basic'
            user.is_premium = True
            user.save(update_fields=['subscription_plan', 'is_premium'])
            # Sync with subscription if it exists
            if hasattr(user, 'subscription'):
                user.subscription.plan = 'basic'
                user.subscription.status = 'active'
                user.subscription.save(update_fields=['plan', 'status'])
            count += 1
        self.message_user(request, f'{count} user(s) set to Basic plan.', messages.SUCCESS)
    set_plan_basic.short_description = "Set selected users to Basic plan"
    
    def set_plan_premium(self, request, queryset):
        """Set selected users to Premium plan."""
        count = 0
        for user in queryset:
            user.subscription_plan = 'premium'
            user.is_premium = True
            user.save(update_fields=['subscription_plan', 'is_premium'])
            # Sync with subscription if it exists
            if hasattr(user, 'subscription'):
                user.subscription.plan = 'premium'
                user.subscription.status = 'active'
                user.subscription.save(update_fields=['plan', 'status'])
            count += 1
        self.message_user(request, f'{count} user(s) set to Premium plan.', messages.SUCCESS)
    set_plan_premium.short_description = "Set selected users to Premium plan"
    
    def set_plan_elite(self, request, queryset):
        """Set selected users to Elite plan."""
        count = 0
        for user in queryset:
            user.subscription_plan = 'elite'
            user.is_premium = True
            user.save(update_fields=['subscription_plan', 'is_premium'])
            # Sync with subscription if it exists
            if hasattr(user, 'subscription'):
                user.subscription.plan = 'elite'
                user.subscription.status = 'active'
                user.subscription.save(update_fields=['plan', 'status'])
            count += 1
        self.message_user(request, f'{count} user(s) set to Elite plan.', messages.SUCCESS)
    set_plan_elite.short_description = "Set selected users to Elite plan"
    
    def save_model(self, request, obj, form, change):
        """Override save to sync with subscription model."""
        super().save_model(request, obj, form, change)
        # Sync user subscription_plan with Subscription model if it exists
        if hasattr(obj, 'subscription'):
            subscription = obj.subscription
            # Map user subscription_plan to subscription plan
            # Only sync if it's a paid plan (basic, premium, elite)
            if obj.subscription_plan in ['basic', 'premium', 'elite']:
                subscription.plan = obj.subscription_plan
                if obj.is_premium and subscription.status != 'active':
                    subscription.status = 'active'
                subscription.save(update_fields=['plan', 'status'])
            elif obj.subscription_plan == 'free':
                # If set to free, cancel the subscription
                subscription.status = 'canceled'
                subscription.save(update_fields=['status'])
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'full_name', 'password1', 'password2'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for UserProfile model."""
    
    list_display = ['user', 'date_of_birth', 'gender', 'timezone', 'profile_completed_at']
    list_filter = ['gender', 'timezone', 'profile_completed_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Personal Information', {'fields': ('date_of_birth', 'gender', 'timezone', 'location')}),
        ('Profile', {'fields': ('profile_picture_url', 'bio')}),
        ('Completion', {'fields': ('profile_completed_at',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['profile_completed_at', 'created_at', 'updated_at']


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    """Admin interface for OTPCode model."""
    
    list_display = ['user', 'code', 'type', 'is_used', 'attempts', 'expires_at', 'created_at']
    list_filter = ['type', 'is_used', 'created_at']
    search_fields = ['user__email', 'user__phone', 'code']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('OTP Details', {'fields': ('code', 'type', 'attempts', 'is_used')}),
        ('Expiration', {'fields': ('expires_at',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    """Admin interface for RefreshToken model."""
    
    list_display = ['user', 'is_blacklisted', 'expires_at', 'created_at']
    list_filter = ['is_blacklisted', 'created_at']
    search_fields = ['user__email', 'token']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Token', {'fields': ('token', 'is_blacklisted')}),
        ('Expiration', {'fields': ('expires_at',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


@admin.register(DeviceToken)
class DeviceTokenAdmin(admin.ModelAdmin):
    """Admin interface for DeviceToken model."""
    
    list_display = ['user', 'device_type', 'device_name', 'is_active', 'registered_at']
    list_filter = ['device_type', 'is_active', 'registered_at']
    search_fields = ['user__email', 'device_name', 'fcm_token']
    ordering = ['-registered_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Device', {'fields': ('fcm_token', 'device_type', 'device_name', 'is_active')}),
        ('Timestamps', {'fields': ('registered_at', 'last_used')}),
    )
    
    readonly_fields = ['registered_at', 'last_used']


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    """Admin interface for EmailTemplate model."""
    
    list_display = ['template_type', 'subject', 'is_active', 'preview_link', 'test_link', 'updated_at']
    list_filter = ['is_active', 'template_type', 'created_at', 'updated_at']
    search_fields = ['template_type', 'subject', 'body_html', 'body_text']
    ordering = ['template_type']
    
    fieldsets = (
        ('Template Information', {
            'fields': ('template_type', 'is_active', 'subject')
        }),
        ('Email Body', {
            'fields': ('body_html', 'body_text'),
            'description': 'Use {{variable_name}} for variable substitution. Available variables are listed below.'
        }),
        ('Template Variables', {
            'fields': ('variables',),
            'description': 'JSON object describing available variables. Example: {"user_name": "User\'s full name", "otp": "OTP code"}'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def preview_link(self, obj):
        """Link to preview the email template."""
        if obj.pk:
            url = reverse('admin:accounts_emailtemplate_preview', args=[obj.pk])
            return format_html('<a href="{}" target="_blank">Preview</a>', url)
        return '-'
    preview_link.short_description = 'Preview'
    
    def test_link(self, obj):
        """Link to test the email template."""
        if obj.pk:
            url = reverse('admin:accounts_emailtemplate_test', args=[obj.pk])
            return format_html('<a href="{}">Test Email</a>', url)
        return '-'
    test_link.short_description = 'Test'
    
    def get_urls(self):
        """Add custom URLs for preview and test."""
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<uuid:template_id>/preview/',
                self.admin_site.admin_view(self.preview_template),
                name='accounts_emailtemplate_preview',
            ),
            path(
                '<uuid:template_id>/test/',
                self.admin_site.admin_view(self.test_template),
                name='accounts_emailtemplate_test',
            ),
        ]
        return custom_urls + urls
    
    def preview_template(self, request, template_id):
        """Preview rendered email template."""
        try:
            template = EmailTemplate.objects.get(pk=template_id)
            
            # Sample context for preview
            sample_context = {
                'user_name': 'John Doe',
                'otp': '123456',
                'email': 'user@example.com',
                'app_name': 'NumerAI',
                'reset_url': 'https://numerai.app/reset-password?token=sample-token',
                'token': 'sample-token',
                'expiry_hours': 24,
            }
            
            # Merge with template variables if available
            if template.variables:
                for key in template.variables.keys():
                    if key not in sample_context:
                        sample_context[key] = f'[Sample {key}]'
            
            # Render template
            rendered_html, rendered_text = render_email_template(template, sample_context)
            
            # Render subject
            from django.template import Context, Template
            subject_template = Template(template.subject)
            subject_context = Context(sample_context)
            rendered_subject = subject_template.render(subject_context)
            
            # Return HTML preview
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Preview: {rendered_subject}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }}
                    .email-container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                    .email-header {{ border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }}
                    .email-subject {{ font-size: 18px; font-weight: bold; color: #333; }}
                    .email-body {{ line-height: 1.6; color: #555; }}
                    .info-box {{ background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }}
                    .info-box h3 {{ margin-top: 0; }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <div class="email-subject">{rendered_subject}</div>
                    </div>
                    <div class="info-box">
                        <h3>Preview Information</h3>
                        <p><strong>Template Type:</strong> {template.get_template_type_display()}</p>
                        <p><strong>Sample Variables Used:</strong></p>
                        <ul>
                            {''.join([f'<li><strong>{k}:</strong> {v}</li>' for k, v in sample_context.items()])}
                        </ul>
                    </div>
                    <div class="email-body">
                        {rendered_html}
                    </div>
                </div>
            </body>
            </html>
            """
            return HttpResponse(html_content)
        except EmailTemplate.DoesNotExist:
            messages.error(request, 'Email template not found.')
            return redirect('admin:accounts_emailtemplate_changelist')
        except Exception as e:
            messages.error(request, f'Error previewing template: {str(e)}')
            return redirect('admin:accounts_emailtemplate_changelist')
    
    def test_template(self, request, template_id):
        """Test email template by sending a test email."""
        try:
            template = EmailTemplate.objects.get(pk=template_id)
            
            if request.method == 'POST':
                test_email = request.POST.get('test_email')
                if not test_email:
                    messages.error(request, 'Please provide a test email address.')
                    return redirect('admin:accounts_emailtemplate_test', template_id=template_id)
                
                # Sample context for test
                sample_context = {
                    'user_name': 'Test User',
                    'otp': '123456',
                    'email': test_email,
                    'app_name': 'NumerAI',
                    'reset_url': 'https://numerai.app/reset-password?token=test-token',
                    'token': 'test-token',
                    'expiry_hours': 24,
                }
                
                # Merge with template variables if available
                if template.variables:
                    for key in template.variables.keys():
                        if key not in sample_context:
                            sample_context[key] = f'[Test {key}]'
                
                # Send test email
                from .email_service import send_templated_email
                success = send_templated_email(
                    template_type=template.template_type,
                    recipient=test_email,
                    context=sample_context,
                    fail_silently=False
                )
                
                if success:
                    messages.success(request, f'Test email sent successfully to {test_email}')
                else:
                    messages.error(request, 'Failed to send test email. Check email configuration.')
                
                return redirect('admin:accounts_emailtemplate_change', template_id=template_id)
            
            # GET request - show test form
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Email Template</title>
                <style>
                    body {{ font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }}
                    .form-container {{ max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                    .form-group {{ margin-bottom: 20px; }}
                    label {{ display: block; margin-bottom: 5px; font-weight: bold; }}
                    input[type="email"] {{ width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }}
                    button {{ background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }}
                    button:hover {{ background: #45a049; }}
                    .back-link {{ margin-top: 20px; }}
                    .back-link a {{ color: #2196F3; text-decoration: none; }}
                </style>
            </head>
            <body>
                <div class="form-container">
                    <h2>Test Email Template: {template.get_template_type_display()}</h2>
                    <form method="post">
                        <div class="form-group">
                            <label for="test_email">Test Email Address:</label>
                            <input type="email" id="test_email" name="test_email" required placeholder="test@example.com">
                        </div>
                        <button type="submit">Send Test Email</button>
                    </form>
                    <div class="back-link">
                        <a href="{reverse('admin:accounts_emailtemplate_changelist')}">← Back to Email Templates</a>
                    </div>
                </div>
            </body>
            </html>
            """
            return HttpResponse(html_content)
        except EmailTemplate.DoesNotExist:
            messages.error(request, 'Email template not found.')
            return redirect('admin:accounts_emailtemplate_changelist')
        except Exception as e:
            messages.error(request, f'Error testing template: {str(e)}')
            return redirect('admin:accounts_emailtemplate_changelist')


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    """Admin interface for PasswordResetToken model."""
    
    list_display = ['user', 'token', 'is_used', 'created_at', 'expires_at']
    list_filter = ['is_used', 'created_at', 'expires_at']
    search_fields = ['user__email', 'user__full_name', 'token']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Token', {'fields': ('token', 'is_used')}),
        ('Expiration', {'fields': ('expires_at',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin interface for Notification model."""
    
    list_display = ['user', 'title', 'notification_type', 'is_read', 'is_sent', 'created_at']
    list_filter = ['notification_type', 'is_read', 'is_sent', 'created_at']
    search_fields = ['user__email', 'user__full_name', 'title', 'message']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Notification', {'fields': ('title', 'message', 'notification_type')}),
        ('Status', {'fields': ('is_read', 'is_sent', 'read_at')}),
        ('Data', {'fields': ('data',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['created_at', 'read_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin interface for AuditLog model."""
    
    list_display = ['user', 'action', 'resource_type', 'resource_id', 'ip_address', 'timestamp']
    list_filter = ['action', 'resource_type', 'timestamp']
    search_fields = ['user__email', 'user__full_name', 'resource_id', 'ip_address']
    ordering = ['-timestamp']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Action', {'fields': ('action', 'resource_type', 'resource_id', 'details')}),
        ('Request Info', {'fields': ('ip_address', 'user_agent')}),
        ('Timestamps', {'fields': ('timestamp',)}),
    )
    
    readonly_fields = ['timestamp']


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    """Admin interface for APIKey model."""
    
    list_display = ['user', 'name', 'key_prefix', 'is_active', 'last_used', 'expires_at', 'created_at']
    list_filter = ['is_active', 'created_at', 'expires_at']
    search_fields = ['user__email', 'user__full_name', 'name', 'key', 'key_prefix']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Key Details', {'fields': ('name', 'key', 'key_prefix', 'is_active')}),
        ('Usage', {'fields': ('last_used', 'expires_at')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    
    readonly_fields = ['key', 'key_prefix', 'created_at']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    """Admin interface for NotificationPreference model."""
    
    list_display = ['user', 'notification_type', 'channel', 'enabled', 'updated_at']
    list_filter = ['notification_type', 'channel', 'enabled', 'updated_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Preference', {'fields': ('notification_type', 'channel', 'enabled')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    """Admin interface for PrivacySettings model."""
    
    list_display = ['user', 'profile_visibility', 'gdpr_consent', 'privacy_policy_accepted', 'updated_at']
    list_filter = ['profile_visibility', 'gdpr_consent', 'privacy_policy_accepted', 'updated_at']
    search_fields = ['user__email', 'user__full_name']
    ordering = ['-updated_at']
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Data Sharing', {'fields': ('share_analytics', 'share_marketing', 'share_third_party')}),
        ('Visibility', {'fields': ('profile_visibility',)}),
        ('Data Retention', {'fields': ('data_retention_consent', 'data_retention_period_days')}),
        ('GDPR', {'fields': ('gdpr_consent', 'gdpr_consent_date', 'privacy_policy_accepted', 'privacy_policy_version', 'privacy_policy_accepted_date')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at']