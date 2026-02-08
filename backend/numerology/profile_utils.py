"""
Utility functions for optimized profile fetching and common operations.
This module centralizes profile retrieval with proper query optimization.
"""
from django.core.cache import cache
from django.db.models import Prefetch
from .models import NumerologyProfile, DailyReading, CompatibilityCheck, Remedy
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def get_numerology_profile(user, use_cache=True):
    """
    Get numerology profile with optimized query using select_related.
    
    Args:
        user: User instance
        use_cache: Whether to use caching (default: True)
    
    Returns:
        NumerologyProfile instance
    
    Raises:
        NumerologyProfile.DoesNotExist: If profile doesn't exist
    """
    cache_key = f'numerology_profile_{user.id}'
    
    if use_cache:
        cached_profile = cache.get(cache_key)
        if cached_profile:
            return cached_profile
    
    try:
        profile = NumerologyProfile.objects.select_related('user').get(user=user)
        
        if use_cache:
            # Cache for 1 hour (profiles rarely change)
            cache.set(cache_key, profile, 3600)
        
        return profile
    except NumerologyProfile.DoesNotExist:
        logger.warning(f"NumerologyProfile not found for user {user.id}")
        raise


def ensure_numerology_profile_from_user_profile(user):
    """
    Create NumerologyProfile from UserProfile if user has full_name and date_of_birth.
    Used to fix users who never got a profile (e.g. after signal fix) or on first profile request.
    
    Returns:
        NumerologyProfile if created, None if not possible (missing data or validation failed)
    """
    from accounts.models import UserProfile
    from .numerology import NumerologyCalculator, validate_name, validate_birth_date

    try:
        user_profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return None
    if not user_profile.date_of_birth or not getattr(user, 'full_name', None):
        return None
    if not validate_name(user.full_name) or not validate_birth_date(user_profile.date_of_birth):
        return None
    try:
        calculator = NumerologyCalculator(system='pythagorean')
        numbers = calculator.calculate_all(user.full_name, user_profile.date_of_birth)
        lo_shu_grid = calculator.calculate_lo_shu_grid(user.full_name, user_profile.date_of_birth)
    except Exception as e:
        logger.warning(f"Could not compute numerology for user {user.id}: {e}")
        return None

    defaults = {
        'life_path_number': numbers['life_path_number'],
        'destiny_number': numbers['destiny_number'],
        'soul_urge_number': numbers['soul_urge_number'],
        'personality_number': numbers['personality_number'],
        'attitude_number': numbers['attitude_number'],
        'maturity_number': numbers['maturity_number'],
        'balance_number': numbers['balance_number'],
        'personal_year_number': numbers['personal_year_number'],
        'personal_month_number': numbers['personal_month_number'],
        'karmic_debt_number': numbers.get('karmic_debt_number'),
        'hidden_passion_number': numbers.get('hidden_passion_number'),
        'subconscious_self_number': numbers.get('subconscious_self_number'),
        'lo_shu_grid': lo_shu_grid,
        'calculation_system': 'pythagorean',
    }
    profile, created = NumerologyProfile.objects.get_or_create(user=user, defaults=defaults)
    if created:
        invalidate_profile_cache(user)
        logger.info(f"Created numerology profile for user {user.id} from UserProfile")
    return profile


def get_or_none_numerology_profile(user, use_cache=True):
    """
    Get numerology profile or return None if it doesn't exist.
    
    Args:
        user: User instance
        use_cache: Whether to use caching (default: True)
    
    Returns:
        NumerologyProfile instance or None
    """
    try:
        return get_numerology_profile(user, use_cache=use_cache)
    except NumerologyProfile.DoesNotExist:
        return None


def invalidate_profile_cache(user):
    """
    Invalidate cached profile for a user.
    Call this after profile updates.
    
    Args:
        user: User instance
    """
    cache_key = f'numerology_profile_{user.id}'
    cache.delete(cache_key)


def get_profile_with_readings(user, days=30):
    """
    Get profile with recent daily readings prefetched.
    
    Args:
        user: User instance
        days: Number of recent days to fetch (default: 30)
    
    Returns:
        NumerologyProfile instance with prefetched readings
    """
    from datetime import timedelta
    from django.utils import timezone
    
    cutoff_date = timezone.now().date() - timedelta(days=days)
    
    profile = NumerologyProfile.objects.select_related('user').prefetch_related(
        Prefetch(
            'user__daily_readings',
            queryset=DailyReading.objects.filter(
                reading_date__gte=cutoff_date
            ).order_by('-reading_date'),
            to_attr='recent_readings'
        )
    ).get(user=user)
    
    return profile


def get_profile_with_compatibility_checks(user, limit=10):
    """
    Get profile with recent compatibility checks prefetched.
    
    Args:
        user: User instance
        limit: Number of recent checks to fetch (default: 10)
    
    Returns:
        NumerologyProfile instance with prefetched compatibility checks
    """
    profile = NumerologyProfile.objects.select_related('user').prefetch_related(
        Prefetch(
            'user__compatibility_checks',
            queryset=CompatibilityCheck.objects.order_by('-created_at')[:limit],
            to_attr='recent_compatibility_checks'
        )
    ).get(user=user)
    
    return profile


def get_profile_with_remedies(user):
    """
    Get profile with active remedies prefetched.
    
    Args:
        user: User instance
    
    Returns:
        NumerologyProfile instance with prefetched remedies
    """
    profile = NumerologyProfile.objects.select_related('user').prefetch_related(
        Prefetch(
            'user__remedies',
            queryset=Remedy.objects.filter(is_active=True).prefetch_related('trackings'),
            to_attr='active_remedies'
        )
    ).get(user=user)
    
    return profile


def handle_profile_not_found(error_message='Numerology profile not found. Please calculate your profile first.'):
    """
    Return standardized error response for missing profile.
    
    Args:
        error_message: Custom error message (optional)
    
    Returns:
        Response with 404 status
    """
    return Response(
        {'error': error_message},
        status=status.HTTP_404_NOT_FOUND
    )


def require_profile(view_func):
    """
    Decorator to ensure user has a numerology profile before accessing view.
    Automatically fetches and passes profile to the view function.
    
    Usage:
        @api_view(['GET'])
        @permission_classes([IsAuthenticated])
        @require_profile
        def my_view(request, profile):
            # profile is automatically available
            return Response({'data': profile.life_path_number})
    """
    from functools import wraps
    
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            profile = get_numerology_profile(request.user)
            return view_func(request, profile=profile, *args, **kwargs)
        except NumerologyProfile.DoesNotExist:
            return handle_profile_not_found()
    
    return wrapper


def bulk_get_profiles(users):
    """
    Get multiple profiles efficiently with a single query.
    
    Args:
        users: List or queryset of User instances
    
    Returns:
        Dictionary mapping user_id to NumerologyProfile
    """
    profiles = NumerologyProfile.objects.select_related('user').filter(
        user__in=users
    )
    
    return {profile.user_id: profile for profile in profiles}


def get_profile_summary(profile):
    """
    Get a summary dictionary of key profile information.
    Useful for API responses that don't need full profile data.
    
    Args:
        profile: NumerologyProfile instance
    
    Returns:
        Dictionary with key profile information
    """
    return {
        'life_path_number': profile.life_path_number,
        'destiny_number': profile.destiny_number,
        'soul_urge_number': profile.soul_urge_number,
        'personality_number': profile.personality_number,
        'personal_year_number': profile.personal_year_number,
        'driver_number': profile.driver_number,
        'conductor_number': profile.conductor_number,
        'calculation_system': profile.calculation_system,
        'calculated_at': profile.calculated_at,
    }
