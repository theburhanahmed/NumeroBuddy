"""
Subscription utility functions for numerology application.
"""
from accounts.models import User
from feature_flags.entitlements import EntitlementService


def get_user_subscription_tier(user: User) -> str:
    """
    Get user's subscription tier.
    
    Args:
        user: User instance
        
    Returns:
        Subscription tier: 'free', 'basic', 'premium', or 'elite'
    """
    return EntitlementService.get_effective_plan(user)


def can_access_feature(user: User, feature_name: str) -> bool:
    """
    Check if user's subscription allows access to a specific feature.
    
    Args:
        user: User instance
        feature_name: Name of the feature to check
        
    Returns:
        True if user can access the feature, False otherwise
    """
    return EntitlementService.can_access(user, feature_name)


def get_available_features(user: User) -> dict:
    """
    Get all available features for a user based on their subscription tier.
    
    Args:
        user: User instance
        
    Returns:
        Dictionary of feature names and their access status
    """
    return {
        name: feature['enabled']
        for name, feature in EntitlementService.get_user_features(user).items()
    }






















