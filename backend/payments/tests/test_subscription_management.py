from datetime import timedelta
from unittest.mock import patch

import pytest
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from feature_flags.entitlements import EntitlementService
from feature_flags.models import FeatureFlag
from payments.models import Subscription
from payments.subscription_management import SubscriptionManagementService


@pytest.fixture
def user():
    return User.objects.create_user(
        email='entitlements@example.com',
        full_name='Entitlement User',
        password='testpass123',
    )


@pytest.mark.django_db
def test_user_plan_field_does_not_grant_unbacked_access(user):
    user.subscription_plan = 'elite'
    user.is_premium = True
    user.save(update_fields=['subscription_plan', 'is_premium'])

    assert EntitlementService.get_effective_plan(user) == 'free'


@pytest.mark.django_db
def test_active_subscription_grants_matrix_access(user):
    Subscription.objects.create(
        user=user,
        plan='premium',
        status='active',
        current_period_end=timezone.now() + timedelta(days=30),
    )

    assert EntitlementService.get_effective_plan(user) == 'premium'
    assert EntitlementService.can_access(user, 'name_numerology') is True
    assert EntitlementService.can_access(user, 'numerology_health') is False


@pytest.mark.django_db
def test_inactive_subscription_revokes_paid_access(user):
    Subscription.objects.create(user=user, plan='elite', status='past_due')

    assert EntitlementService.get_effective_plan(user) == 'free'


@pytest.mark.django_db
@override_settings(
    FRONTEND_URL='http://localhost:5173',
    STRIPE_PRICE_IDS={'basic': 'price_basic', 'premium': 'price_premium', 'elite': 'price_elite'},
)
@patch('payments.subscription_management.create_checkout_session')
def test_paid_plan_without_stripe_requires_checkout(mock_checkout, user):
    mock_checkout.return_value = {'url': 'https://checkout.example/session', 'session_id': 'cs_test'}

    change = SubscriptionManagementService.request_plan_change(user, 'basic', source='test')

    assert change.status == 'pending_checkout'
    assert change.to_plan == 'basic'
    assert EntitlementService.get_effective_plan(user) == 'free'


@pytest.mark.django_db
@override_settings(STRIPE_PRICE_IDS={'basic': 'price_basic', 'premium': 'price_premium', 'elite': 'price_elite'})
@patch('payments.subscription_management.stripe.Subscription.modify')
@patch('payments.subscription_management.stripe.Subscription.retrieve')
def test_upgrade_is_immediate_and_prorated(mock_retrieve, mock_modify, user):
    subscription = Subscription.objects.create(
        user=user,
        plan='basic',
        status='active',
        stripe_subscription_id='sub_test',
        current_period_end=timezone.now() + timedelta(days=30),
    )
    mock_retrieve.return_value = {'items': {'data': [{'id': 'si_test'}]}}
    mock_modify.return_value = {'status': 'active', 'cancel_at_period_end': False}

    change = SubscriptionManagementService.request_plan_change(user, 'premium', source='test')

    subscription.refresh_from_db()
    assert change.status == 'completed'
    assert subscription.plan == 'premium'
    assert mock_modify.call_args.kwargs['proration_behavior'] == 'always_invoice'


@pytest.mark.django_db
@override_settings(STRIPE_PRICE_IDS={'basic': 'price_basic', 'premium': 'price_premium', 'elite': 'price_elite'})
@patch('payments.subscription_management.stripe.Subscription.modify')
@patch('payments.subscription_management.stripe.Subscription.retrieve')
def test_downgrade_waits_until_period_end(mock_retrieve, mock_modify, user):
    period_end = timezone.now() + timedelta(days=30)
    subscription = Subscription.objects.create(
        user=user,
        plan='elite',
        status='active',
        stripe_subscription_id='sub_test',
        current_period_end=period_end,
    )
    mock_retrieve.return_value = {'items': {'data': [{'id': 'si_test'}]}}

    change = SubscriptionManagementService.request_plan_change(user, 'basic', source='test')

    subscription.refresh_from_db()
    assert change.status == 'pending_period_end'
    assert change.effective_at == period_end
    assert subscription.plan == 'elite'
    assert EntitlementService.get_effective_plan(user) == 'elite'
    assert mock_modify.call_args.kwargs['proration_behavior'] == 'none'


@pytest.mark.django_db
def test_entitlements_endpoint_returns_effective_plan_and_feature_details(user):
    Subscription.objects.create(
        user=user,
        plan='basic',
        status='active',
        current_period_end=timezone.now() + timedelta(days=30),
    )
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get('/api/v1/entitlements/me/')

    assert response.status_code == 200
    assert response.data['effective_plan'] == 'basic'
    assert response.data['features']['name_numerology']['enabled'] is True
    assert response.data['features']['phone_numerology']['enabled'] is False


@pytest.mark.django_db
def test_entitlement_matrix_contains_all_checked_feature_keys():
    expected = {
        'lo_shu_grid', 'numerology_lo_shu_visualization', 'compatibility_insights',
        'numerology_compatibility', 'rectification_suggestions', 'name_numerology',
        'phone_numerology', 'detailed_analysis', 'raj_yog_analysis', 'yearly_forecast',
        'expert_recommendations', 'numerology_vehicle', 'numerology_property',
        'numerology_business', 'numerology_phone', 'numerology_relationships',
        'numerology_multi_partner', 'numerology_marriage_harmony',
        'numerology_timing_optimization', 'numerology_danger_dates', 'numerology_timing',
        'numerology_health', 'numerology_medical_timing', 'numerology_name_correction',
        'numerology_spiritual', 'numerology_predictive', 'numerology_visualizations',
        'numerology_generational', 'numerology_feng_shui', 'numerology_space_optimization',
        'numerology_mental_state', 'meus_entities', 'meus_dashboard', 'meus_analysis',
        'meus_recommendations',
    }

    assert expected <= set(FeatureFlag.objects.values_list('name', flat=True))
