"""
Django management command to change a user's subscription plan for testing.

Usage:
    python manage.py change_subscription <user_email_or_id> <plan> [options]

Examples:
    python manage.py change_subscription user@example.com premium
    python manage.py change_subscription user@example.com basic --status active
    python manage.py change_subscription user@example.com premium --trailing
    python manage.py change_subscription user@example.com premium --status trialing --trial-days 14
    python manage.py change_subscription user@example.com free
"""
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from payments.models import Subscription


class Command(BaseCommand):
    help = 'Change a user\'s subscription plan for testing (plan, period length, trailing, trial)'

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
            help='Period length in days (default: 30)'
        )
        parser.add_argument(
            '--trailing',
            action='store_true',
            help='Set cancel_at_period_end=True (user keeps access until period end)'
        )
        parser.add_argument(
            '--trial-days',
            type=int,
            default=None,
            metavar='N',
            help='Start trial: set status=trialing and trial_end to N days from now'
        )

    def handle(self, *args, **options):
        user_identifier = options['user_identifier']
        plan = options['plan']
        status = options['status']
        days = options['days']
        trailing = options['trailing']
        trial_days = options['trial_days']

        # --trial-days implies status=trialing
        if trial_days is not None:
            status = 'trialing'

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

        from payments.subscription_management import SubscriptionManagementService

        change = SubscriptionManagementService.request_plan_change(
            user=user,
            target_plan=plan,
            source='management_command',
        )
        if not change:
            self.stdout.write(self.style.SUCCESS('Subscription is already on the requested plan.'))
            return
        self.stdout.write(self.style.SUCCESS(f'Subscription change status: {change.status}'))
        if change.checkout_url:
            self.stdout.write(f'Checkout required: {change.checkout_url}')
        if change.effective_at:
            self.stdout.write(f'Effective at: {change.effective_at}')
