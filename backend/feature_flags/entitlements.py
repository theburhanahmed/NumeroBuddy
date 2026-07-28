from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from subscription_plans import ACTIVE_SUBSCRIPTION_STATUSES, PLAN_ORDER, PlanTier
from .models import FeatureFlag, SubscriptionFeatureAccess


class EntitlementService:
    @classmethod
    def get_effective_plan(cls, user):
        try:
            subscription = user.subscription
        except (AttributeError, ObjectDoesNotExist):
            return PlanTier.FREE

        if subscription.status not in ACTIVE_SUBSCRIPTION_STATUSES:
            return PlanTier.FREE
        if subscription.current_period_end and subscription.current_period_end <= timezone.now():
            return PlanTier.FREE
        return subscription.plan if subscription.plan in PlanTier.values else PlanTier.FREE

    @classmethod
    def get_pending_change(cls, user):
        return user.subscription_changes.filter(
            status__in=('pending_checkout', 'pending_period_end', 'processing')
        ).order_by('-created_at').first()

    @classmethod
    def can_access(cls, user, feature_name):
        tier = cls.get_effective_plan(user)
        return SubscriptionFeatureAccess.objects.filter(
            feature_flag__name=feature_name,
            feature_flag__is_active=True,
            subscription_tier=tier,
            is_enabled=True,
        ).exists()

    @classmethod
    def get_feature_limits(cls, user, feature_name):
        tier = cls.get_effective_plan(user)
        access = SubscriptionFeatureAccess.objects.filter(
            feature_flag__name=feature_name,
            feature_flag__is_active=True,
            subscription_tier=tier,
            is_enabled=True,
        ).first()
        return access.limits if access else {}

    @classmethod
    def get_user_features(cls, user):
        tier = cls.get_effective_plan(user)
        accesses = SubscriptionFeatureAccess.objects.filter(
            subscription_tier=tier,
            feature_flag__is_active=True,
        ).select_related('feature_flag')
        access_by_feature = {access.feature_flag.name: access for access in accesses}
        features = {}
        for flag in FeatureFlag.objects.filter(is_active=True):
            access = access_by_feature.get(flag.name)
            enabled_tiers = list(flag.tier_access.filter(is_enabled=True).values_list('subscription_tier', flat=True))
            required_plan = min(enabled_tiers, key=lambda plan: PLAN_ORDER.get(plan, 99)) if enabled_tiers else None
            features[flag.name] = {
                'enabled': bool(access and access.is_enabled),
                'limits': access.limits if access and access.is_enabled else {},
                'display_name': flag.display_name,
                'category': flag.category,
                'required_plan': required_plan,
            }
        return features

    @classmethod
    def sync_user(cls, user, subscription=None):
        if subscription is None:
            try:
                subscription = user.subscription
            except (AttributeError, ObjectDoesNotExist):
                subscription = None

        effective_plan = cls.get_effective_plan(user) if subscription else PlanTier.FREE
        user.subscription_plan = effective_plan
        user.is_premium = effective_plan != PlanTier.FREE
        user.premium_expiry = subscription.current_period_end if subscription and user.is_premium else None
        user.save(update_fields=['subscription_plan', 'is_premium', 'premium_expiry'])
        return effective_plan

    @classmethod
    def serialize(cls, user):
        try:
            subscription = user.subscription
        except (AttributeError, ObjectDoesNotExist):
            subscription = None
        pending = cls.get_pending_change(user)
        return {
            'effective_plan': cls.get_effective_plan(user),
            'billing_plan': subscription.plan if subscription else PlanTier.FREE,
            'subscription_status': subscription.status if subscription else None,
            'current_period_end': subscription.current_period_end if subscription else None,
            'cancel_at_period_end': subscription.cancel_at_period_end if subscription else False,
            'pending_plan': pending.to_plan if pending else None,
            'pending_change_status': pending.status if pending else None,
            'features': cls.get_user_features(user),
        }
