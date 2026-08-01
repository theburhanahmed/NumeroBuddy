import stripe
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from feature_flags.entitlements import EntitlementService
from subscription_plans import ACTIVE_SUBSCRIPTION_STATUSES, PAID_PLAN_TIERS, PlanTier, is_upgrade, is_valid_plan
from .models import SubscriptionChange
from .services import create_checkout_session


class SubscriptionManagementService:
    @classmethod
    def request_plan_change(cls, user, target_plan, actor=None, source='admin'):
        if not is_valid_plan(target_plan):
            raise ValueError(f'Invalid plan: {target_plan}')

        current_plan = EntitlementService.get_effective_plan(user)
        pending = EntitlementService.get_pending_change(user)
        if pending and pending.to_plan == target_plan:
            return pending
        if current_plan == target_plan and not pending:
            EntitlementService.sync_user(user)
            return None
        if pending:
            pending.status = 'canceled'
            pending.save(update_fields=['status'])

        try:
            subscription = user.subscription
        except ObjectDoesNotExist:
            subscription = None
        has_active_stripe_subscription = bool(
            subscription
            and subscription.stripe_subscription_id
            and subscription.status in ACTIVE_SUBSCRIPTION_STATUSES
        )

        if target_plan == PlanTier.FREE and not has_active_stripe_subscription:
            if subscription:
                subscription.status = 'canceled'
                subscription.cancel_at_period_end = False
                subscription.canceled_at = timezone.now()
                subscription.save(update_fields=['status', 'cancel_at_period_end', 'canceled_at'])
            EntitlementService.sync_user(user, subscription)
            return cls._record_completed_change(user, subscription, current_plan, target_plan, actor, source, 'cancel')

        if not has_active_stripe_subscription:
            return cls._create_checkout_change(user, subscription, current_plan, target_plan, actor, source)

        if is_upgrade(current_plan, target_plan):
            return cls._apply_immediate_upgrade(user, subscription, current_plan, target_plan, actor, source)
        return cls._schedule_downgrade(user, subscription, current_plan, target_plan, actor, source)

    @classmethod
    def _create_checkout_change(cls, user, subscription, current_plan, target_plan, actor, source):
        if target_plan not in PAID_PLAN_TIERS:
            raise ValueError('Checkout can only be created for a paid plan')

        change = SubscriptionChange.objects.create(
            user=user,
            subscription=subscription,
            from_plan=current_plan,
            to_plan=target_plan,
            status='processing',
            change_type='checkout',
            requested_by=actor,
            source=source,
        )
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        try:
            result = create_checkout_session(
                user=user,
                plan=target_plan,
                success_url=f'{frontend_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{frontend_url}/pricing',
                idempotency_key=f'subscription-change-{change.id}',
            )
            change.status = 'pending_checkout'
            change.stripe_checkout_session_id = result['session_id']
            change.checkout_url = result['url']
            change.save(update_fields=['status', 'stripe_checkout_session_id', 'checkout_url'])
            return change
        except Exception as exc:
            change.status = 'failed'
            change.failure_reason = str(exc)
            change.save(update_fields=['status', 'failure_reason'])
            raise

    @classmethod
    def _apply_immediate_upgrade(cls, user, subscription, current_plan, target_plan, actor, source):
        price_id = settings.STRIPE_PRICE_IDS.get(target_plan)
        if not price_id:
            raise ValueError(f'Price ID not configured for plan: {target_plan}')

        change = SubscriptionChange.objects.create(
            user=user,
            subscription=subscription,
            from_plan=current_plan,
            to_plan=target_plan,
            status='processing',
            change_type='upgrade',
            requested_by=actor,
            source=source,
        )
        try:
            stripe_subscription = stripe.Subscription.retrieve(
                subscription.stripe_subscription_id,
                expand=['items.data.price'],
            )
            item = stripe_subscription['items']['data'][0]
            updated = stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                items=[{'id': item['id'], 'price': price_id}],
                proration_behavior='always_invoice',
                metadata={'plan': target_plan, 'user_id': str(user.id)},
                idempotency_key=f'subscription-change-{change.id}',
            )
            subscription.plan = target_plan
            subscription.status = cls._stripe_value(updated, 'status', subscription.status)
            subscription.cancel_at_period_end = cls._stripe_value(updated, 'cancel_at_period_end', False)
            subscription.save(update_fields=['plan', 'status', 'cancel_at_period_end'])
            EntitlementService.sync_user(user, subscription)
            change.status = 'completed'
            change.completed_at = timezone.now()
            change.save(update_fields=['status', 'completed_at'])
            return change
        except Exception as exc:
            change.status = 'failed'
            change.failure_reason = str(exc)
            change.save(update_fields=['status', 'failure_reason'])
            raise

    @classmethod
    def _schedule_downgrade(cls, user, subscription, current_plan, target_plan, actor, source):
        change_type = 'cancel' if target_plan == PlanTier.FREE else 'downgrade'
        change = SubscriptionChange.objects.create(
            user=user,
            subscription=subscription,
            from_plan=current_plan,
            to_plan=target_plan,
            status='processing',
            change_type=change_type,
            effective_at=subscription.current_period_end,
            requested_by=actor,
            source=source,
        )
        try:
            if target_plan == PlanTier.FREE:
                stripe.Subscription.modify(
                    subscription.stripe_subscription_id,
                    cancel_at_period_end=True,
                    metadata={'plan': current_plan, 'pending_plan': target_plan, 'user_id': str(user.id)},
                    idempotency_key=f'subscription-change-{change.id}',
                )
                subscription.cancel_at_period_end = True
                subscription.save(update_fields=['cancel_at_period_end'])
            else:
                price_id = settings.STRIPE_PRICE_IDS.get(target_plan)
                if not price_id:
                    raise ValueError(f'Price ID not configured for plan: {target_plan}')
                stripe_subscription = stripe.Subscription.retrieve(
                    subscription.stripe_subscription_id,
                    expand=['items.data.price'],
                )
                item = stripe_subscription['items']['data'][0]
                stripe.Subscription.modify(
                    subscription.stripe_subscription_id,
                    items=[{'id': item['id'], 'price': price_id}],
                    proration_behavior='none',
                    metadata={'plan': current_plan, 'pending_plan': target_plan, 'user_id': str(user.id)},
                    idempotency_key=f'subscription-change-{change.id}',
                )
            change.status = 'pending_period_end'
            change.save(update_fields=['status'])
            return change
        except Exception as exc:
            change.status = 'failed'
            change.failure_reason = str(exc)
            change.save(update_fields=['status', 'failure_reason'])
            raise

    @classmethod
    def complete_pending_change(cls, subscription, stripe_event_id=None):
        change = subscription.changes.filter(
            status='pending_period_end',
            effective_at__lte=timezone.now(),
        ).order_by('effective_at').first()
        if not change:
            return None

        if change.to_plan == PlanTier.FREE:
            subscription.status = 'canceled'
            subscription.cancel_at_period_end = False
            subscription.canceled_at = timezone.now()
            subscription.save(update_fields=['status', 'cancel_at_period_end', 'canceled_at'])
        else:
            subscription.plan = change.to_plan
            subscription.save(update_fields=['plan'])
        EntitlementService.sync_user(subscription.user, subscription)
        change.status = 'completed'
        change.completed_at = timezone.now()
        change.metadata = {**change.metadata, 'stripe_event_id': stripe_event_id}
        change.save(update_fields=['status', 'completed_at', 'metadata'])
        return change

    @classmethod
    def complete_checkout_change(cls, user, subscription, checkout_session_id):
        change = SubscriptionChange.objects.filter(
            user=user,
            stripe_checkout_session_id=checkout_session_id,
            status='pending_checkout',
        ).first()
        if not change:
            return None
        change.subscription = subscription
        change.status = 'completed'
        change.completed_at = timezone.now()
        change.save(update_fields=['subscription', 'status', 'completed_at'])
        return change

    @classmethod
    def _record_completed_change(cls, user, subscription, current_plan, target_plan, actor, source, change_type):
        return SubscriptionChange.objects.create(
            user=user,
            subscription=subscription,
            from_plan=current_plan,
            to_plan=target_plan,
            status='completed',
            change_type=change_type,
            requested_by=actor,
            source=source,
            completed_at=timezone.now(),
        )

    @staticmethod
    def _stripe_value(obj, key, default=None):
        if isinstance(obj, dict):
            return obj.get(key, default)
        return getattr(obj, key, default)
