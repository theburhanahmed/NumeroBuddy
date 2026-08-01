"""
Feature flag services for checking access and managing flags.
"""
from typing import Any, Dict
from django.core.cache import cache
from accounts.models import User
from .entitlements import EntitlementService
from .models import FeatureFlag, SubscriptionFeatureAccess


class FeatureFlagService:
    """Service for checking feature flag access."""
    
    CACHE_TIMEOUT = 300  # 5 minutes
    CACHE_KEY_PREFIX = 'feature_flag'
    
    @classmethod
    def can_access(cls, user: User, feature_name: str) -> bool:
        """
        Check if user can access a specific feature.
        
        Args:
            user: User instance
            feature_name: Feature flag name
            
        Returns:
            True if user can access, False otherwise
        """
        return EntitlementService.can_access(user, feature_name)
    
    @classmethod
    def get_user_features(cls, user: User) -> Dict[str, bool]:
        """
        Get all available features for a user.
        
        Args:
            user: User instance
            
        Returns:
            Dictionary mapping feature names to access status
        """
        return {
            name: feature['enabled']
            for name, feature in EntitlementService.get_user_features(user).items()
        }
    
    @classmethod
    def get_feature_limits(cls, user: User, feature_name: str) -> Dict[str, Any]:
        """
        Get usage limits for a feature.
        
        Args:
            user: User instance
            feature_name: Feature flag name
            
        Returns:
            Dictionary of limits (empty if no limits or no access)
        """
        return EntitlementService.get_feature_limits(user, feature_name)
    
    @classmethod
    def invalidate_cache(cls, user: User = None, feature_name: str = None):
        """
        Invalidate feature flag cache.
        
        Args:
            user: User instance (if None, invalidate all users)
            feature_name: Feature name (if None, invalidate all features)
        """
        if user and feature_name:
            cache_key = f"{cls.CACHE_KEY_PREFIX}:{user.id}:{feature_name}"
            cache.delete(cache_key)
        elif user:
            # Invalidate all features for this user (we'll delete common patterns)
            # Note: For Redis, we'd use delete_pattern, but for Django cache we'll just clear
            # In production with Redis, use cache.delete_pattern
            pass  # Individual cache keys will expire naturally
        elif feature_name:
            # Invalidate this feature for all users
            # Note: In production with Redis, use cache.delete_pattern
            pass  # Individual cache keys will expire naturally
        else:
            # Invalidate all - would need Redis pattern matching
            pass  # Cache will expire naturally


class FeatureFlagManager:
    """Service for managing feature flags (admin operations)."""
    
    @classmethod
    def create_feature_flag(
        cls,
        name: str,
        display_name: str,
        description: str = "",
        category: str = "core",
        default_tier: str = "free",
        is_active: bool = True
    ) -> FeatureFlag:
        """
        Create a new feature flag.
        
        Args:
            name: Unique identifier
            display_name: Human-readable name
            description: Feature description
            category: Feature category
            default_tier: Minimum tier required
            is_active: Whether feature is active
            
        Returns:
            Created FeatureFlag instance
        """
        feature_flag = FeatureFlag.objects.create(
            name=name,
            display_name=display_name,
            description=description,
            category=category,
            default_tier=default_tier,
            is_active=is_active
        )
        
        # Create default tier access based on default_tier
        tiers = ['free', 'basic', 'premium', 'elite']
        default_tier_index = tiers.index(default_tier) if default_tier in tiers else 0
        
        for i, tier in enumerate(tiers):
            is_enabled = i >= default_tier_index
            SubscriptionFeatureAccess.objects.create(
                subscription_tier=tier,
                feature_flag=feature_flag,
                is_enabled=is_enabled
            )
        
        # Invalidate cache
        FeatureFlagService.invalidate_cache(feature_name=name)
        
        return feature_flag
    
    @classmethod
    def toggle_tier_access(
        cls,
        feature_flag: FeatureFlag,
        tier: str,
        is_enabled: bool
    ) -> SubscriptionFeatureAccess:
        """
        Toggle feature access for a specific tier.
        
        Args:
            feature_flag: FeatureFlag instance
            tier: Subscription tier
            is_enabled: Whether to enable access
            
        Returns:
            Updated SubscriptionFeatureAccess instance
        """
        access, created = SubscriptionFeatureAccess.objects.get_or_create(
            feature_flag=feature_flag,
            subscription_tier=tier,
            defaults={'is_enabled': is_enabled}
        )
        
        if not created:
            access.is_enabled = is_enabled
            access.save(update_fields=['is_enabled'])
        
        # Invalidate cache for this feature
        FeatureFlagService.invalidate_cache(feature_name=feature_flag.name)
        
        return access
    
    @classmethod
    def bulk_toggle_tier_access(
        cls,
        feature_flag: FeatureFlag,
        tier_updates: Dict[str, bool]
    ):
        """
        Bulk update tier access for a feature.
        
        Args:
            feature_flag: FeatureFlag instance
            tier_updates: Dictionary mapping tier names to enabled status
        """
        for tier, is_enabled in tier_updates.items():
            cls.toggle_tier_access(feature_flag, tier, is_enabled)

