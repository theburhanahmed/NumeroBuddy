"""
Django management command to change a user's subscription plan for testing.

Usage:
    python manage.py change_subscription <user_email_or_id> <plan> [--status STATUS]

Examples:
    python manage.py change_subscription user@example.com premium
    python manage.py change_subscription user@example.com basic --status active
    python manage.py change_subscription user@example.com free
"""
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from payments.models import Subscription


class Command(BaseCommand):
    help = 'Change a user\'s subscription plan for testing purposes'

    def add_arguments(self, parser):
        parser.add_argument(
            'user_identifier',
            type=str,
            help='User email, phone, or UUID'
        )
        parser.add_argument(
            'plan',
            type=str,
            choices=['free', 'basic', 'premium', 'elite'],
            help='Subscription plan to set'
        )
        parser.add_argument(
            '--status',
            type=str,
            choices=['active', 'canceled', 'trialing', 'incomplete'],
            default='active',
            help='Subscription status (default: active)'
        )
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Number of days for premium expiry (default: 30)'
        )

    def handle(self, *args, **options):
        user_identifier = options['user_identifier']
        plan = options['plan']
        status = options['status']
        days = options['days']

        # Find user
        try:
            # Try by UUID first
            try:
                user = User.objects.get(id=user_identifier)
            except (User.DoesNotExist, ValueError):
                # Try by email
                try:
                    user = User.objects.get(email=user_identifier)
                except User.DoesNotExist:
                    # Try by phone
                    user = User.objects.get(phone=user_identifier)
        except User.DoesNotExist:
            raise CommandError(f'User not found: {user_identifier}')

        self.stdout.write(f'Found user: {user.email or user.phone} ({user.full_name})')
        self.stdout.write(f'Current subscription_plan: {user.subscription_plan}')
        self.stdout.write(f'Current is_premium: {user.is_premium}')

        # Update User model
        user.subscription_plan = plan
        user.is_premium = plan in ['basic', 'premium', 'elite']
        
        if plan in ['basic', 'premium', 'elite'] and status == 'active':
            user.premium_expiry = timezone.now() + timedelta(days=days)
        elif plan == 'free':
            user.premium_expiry = None
        
        user.save(update_fields=['subscription_plan', 'is_premium', 'premium_expiry'])
        self.stdout.write(
            self.style.SUCCESS(
                f'✓ Updated User: subscription_plan={plan}, is_premium={user.is_premium}'
            )
        )

        # Update or create Subscription model
        if plan in ['basic', 'premium', 'elite']:
            subscription, created = Subscription.objects.get_or_create(
                user=user,
                defaults={
                    'plan': plan,
                    'status': status,
                    'current_period_start': timezone.now(),
                    'current_period_end': timezone.now() + timedelta(days=days),
                }
            )
            
            if not created:
                subscription.plan = plan
                subscription.status = status
                if status == 'active':
                    subscription.current_period_start = timezone.now()
                    subscription.current_period_end = timezone.now() + timedelta(days=days)
                    subscription.cancel_at_period_end = False
                subscription.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'✓ Updated Subscription: plan={plan}, status={status}'
                )
            )
        else:
            # For free plan, cancel any existing subscription
            if hasattr(user, 'subscription'):
                user.subscription.status = 'canceled'
                user.subscription.save(update_fields=['status'])
                self.stdout.write(
                    self.style.SUCCESS('✓ Canceled existing subscription')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Successfully changed subscription to {plan.upper()} plan!'
            )
        )
        self.stdout.write(f'User can now access features for {plan} tier.')
