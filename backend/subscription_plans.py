from django.db import models


class PlanTier(models.TextChoices):
    FREE = 'free', 'Free'
    BASIC = 'basic', 'Basic'
    PREMIUM = 'premium', 'Premium'
    ELITE = 'elite', 'Elite'


PLAN_ORDER = {
    PlanTier.FREE: 0,
    PlanTier.BASIC: 1,
    PlanTier.PREMIUM: 2,
    PlanTier.ELITE: 3,
}
PAID_PLAN_TIERS = (PlanTier.BASIC, PlanTier.PREMIUM, PlanTier.ELITE)
ACTIVE_SUBSCRIPTION_STATUSES = ('active', 'trialing')


def is_valid_plan(plan):
    return plan in PlanTier.values


def is_upgrade(current_plan, target_plan):
    return PLAN_ORDER[target_plan] > PLAN_ORDER[current_plan]
