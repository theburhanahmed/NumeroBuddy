import stripe
from django.core.management.base import BaseCommand

from feature_flags.entitlements import EntitlementService
from payments.models import Subscription
from subscription_plans import PAID_PLAN_TIERS


class Command(BaseCommand):
    help = 'Compare local subscription records with Stripe and optionally synchronize local state'

    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true', help='Apply Stripe state to local records')

    def handle(self, *args, **options):
        apply_changes = options['apply']
        mismatches = 0
        for subscription in Subscription.objects.exclude(stripe_subscription_id__isnull=True).exclude(stripe_subscription_id=''):
            try:
                remote = stripe.Subscription.retrieve(subscription.stripe_subscription_id)
            except stripe.error.StripeError as exc:
                mismatches += 1
                self.stderr.write(f'{subscription.user}: Stripe lookup failed: {exc}')
                continue

            remote_status = remote.get('status')
            remote_plan = (remote.get('metadata') or {}).get('plan')
            changed_fields = []
            if remote_status and remote_status != subscription.status:
                changed_fields.append(f'status {subscription.status}->{remote_status}')
                if apply_changes:
                    subscription.status = remote_status
            if remote_plan in PAID_PLAN_TIERS and remote_plan != subscription.plan:
                changed_fields.append(f'plan {subscription.plan}->{remote_plan}')
                if apply_changes:
                    subscription.plan = remote_plan

            if changed_fields:
                mismatches += 1
                self.stdout.write(f'{subscription.user}: {", ".join(changed_fields)}')
                if apply_changes:
                    subscription.save(update_fields=['status', 'plan'])
                    EntitlementService.sync_user(subscription.user, subscription)

        mode = 'applied' if apply_changes else 'found'
        self.stdout.write(self.style.SUCCESS(f'{mode} {mismatches} subscription mismatch(es)'))
