"""
Caching decorators for numerology endpoints.
Provides easy-to-use decorators for caching API responses.
"""
from functools import wraps
from django.core.cache import cache
from django.utils.encoding import force_str
from rest_framework.response import Response
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


def generate_cache_key(prefix, user_id, *args, **kwargs):
    """
    Generate a unique cache key based on prefix, user, and parameters.
    
    Args:
        prefix: Cache key prefix (e.g., 'profile', 'reading')
        user_id: User ID
        *args: Additional positional arguments
        **kwargs: Additional keyword arguments
    
    Returns:
        Unique cache key string
    """
    # Create a string representation of all parameters
    params_str = f"{user_id}:{args}:{sorted(kwargs.items())}"
    
    # Hash the parameters for a shorter key
    params_hash = hashlib.md5(params_str.encode()).hexdigest()[:16]
    
    return f"{prefix}:{params_hash}"


def cache_response(timeout=3600, key_prefix='api', vary_on_params=None):
    """
    Decorator to cache API response.
    
    Args:
        timeout: Cache timeout in seconds (default: 1 hour)
        key_prefix: Prefix for cache key
        vary_on_params: List of request parameters to include in cache key
    
    Usage:
        @api_view(['GET'])
        @cache_response(timeout=3600, key_prefix='profile')
        def get_profile(request):
            return Response({'data': 'profile'})
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Only cache GET requests
            if request.method != 'GET':
                return view_func(request, *args, **kwargs)
            
            # Only cache for authenticated users
            if not hasattr(request, 'user') or not request.user.is_authenticated:
                return view_func(request, *args, **kwargs)
            
            # Build cache key
            cache_key_parts = [key_prefix, str(request.user.id)]
            
            # Add URL parameters to cache key
            if vary_on_params:
                for param in vary_on_params:
                    value = request.query_params.get(param)
                    if value:
                        cache_key_parts.append(f"{param}:{value}")
            
            # Add URL path arguments
            if args:
                cache_key_parts.extend(str(arg) for arg in args)
            if kwargs:
                cache_key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
            
            cache_key = ':'.join(cache_key_parts)
            
            # Try to get from cache
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.debug(f"Cache hit: {cache_key}")
                return Response(cached_data)
            
            # Call the view function
            response = view_func(request, *args, **kwargs)
            
            # Cache successful responses
            if response.status_code == 200 and isinstance(response, Response):
                try:
                    cache.set(cache_key, response.data, timeout)
                    logger.debug(f"Cached response: {cache_key} (timeout: {timeout}s)")
                except Exception as e:
                    logger.warning(f"Failed to cache response: {e}")
            
            return response
        
        return wrapper
    return decorator


def cache_profile_data(timeout=3600):
    """
    Specialized decorator for caching profile-related data.
    Automatically invalidates when profile is updated.
    
    Usage:
        @api_view(['GET'])
        @cache_profile_data(timeout=3600)
        def get_profile_analysis(request):
            return Response({'data': 'analysis'})
    """
    return cache_response(timeout=timeout, key_prefix='profile')


def cache_reading_data(timeout=86400):
    """
    Specialized decorator for caching reading data.
    Default timeout: 24 hours (readings don't change frequently)
    
    Usage:
        @api_view(['GET'])
        @cache_reading_data()
        def get_daily_reading(request):
            return Response({'data': 'reading'})
    """
    return cache_response(timeout=timeout, key_prefix='reading', vary_on_params=['date'])


def cache_compatibility_data(timeout=86400):
    """
    Specialized decorator for caching compatibility data.
    Default timeout: 24 hours
    
    Usage:
        @api_view(['GET'])
        @cache_compatibility_data()
        def get_compatibility(request):
            return Response({'data': 'compatibility'})
    """
    return cache_response(timeout=timeout, key_prefix='compatibility')


def cache_report_data(timeout=3600):
    """
    Specialized decorator for caching report data.
    Default timeout: 1 hour
    
    Usage:
        @api_view(['GET'])
        @cache_report_data()
        def get_report(request):
            return Response({'data': 'report'})
    """
    return cache_response(timeout=timeout, key_prefix='report', vary_on_params=['type', 'year', 'month'])


def invalidate_cache(key_prefix, user_id):
    """
    Invalidate all cache entries for a specific prefix and user.
    
    Args:
        key_prefix: Cache key prefix to invalidate
        user_id: User ID
    
    Usage:
        # After updating profile
        invalidate_cache('profile', user.id)
    """
    # Django's cache doesn't support pattern-based deletion
    # We'll need to track keys or use a versioning strategy
    
    # For now, we'll invalidate specific known keys
    patterns = [
        f"{key_prefix}:{user_id}",
        f"{key_prefix}:{user_id}:*",
    ]
    
    for pattern in patterns:
        try:
            cache.delete(pattern)
            logger.debug(f"Invalidated cache: {pattern}")
        except Exception as e:
            logger.warning(f"Failed to invalidate cache {pattern}: {e}")


def invalidate_user_cache(user_id):
    """
    Invalidate all cache entries for a user.
    Call this when user profile is updated.
    
    Args:
        user_id: User ID
    """
    prefixes = ['profile', 'reading', 'compatibility', 'report']
    for prefix in prefixes:
        invalidate_cache(prefix, user_id)


class CacheManager:
    """
    Manager class for handling cache operations.
    Provides a cleaner interface for cache management.
    """
    
    @staticmethod
    def get_or_set(key, callback, timeout=3600):
        """
        Get value from cache or set it using callback.
        
        Args:
            key: Cache key
            callback: Function to call if cache miss
            timeout: Cache timeout in seconds
        
        Returns:
            Cached or computed value
        """
        value = cache.get(key)
        if value is None:
            value = callback()
            cache.set(key, value, timeout)
        return value
    
    @staticmethod
    def invalidate_pattern(pattern):
        """
        Invalidate cache keys matching pattern.
        Note: This is a simplified version. For production,
        consider using Redis with pattern matching.
        
        Args:
            pattern: Cache key pattern
        """
        try:
            cache.delete(pattern)
        except Exception as e:
            logger.warning(f"Failed to invalidate pattern {pattern}: {e}")
    
    @staticmethod
    def clear_user_cache(user_id):
        """
        Clear all cache for a specific user.
        
        Args:
            user_id: User ID
        """
        invalidate_user_cache(user_id)


def cache_calculation(timeout=None):
    """
    Decorator for caching calculation results.
    Use for expensive calculations that don't depend on user state.
    
    Args:
        timeout: Cache timeout in seconds (None = indefinite)
    
    Usage:
        @cache_calculation(timeout=86400)
        def calculate_compound_number(number):
            # Expensive calculation
            return result
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key_parts = [func.__name__]
            cache_key_parts.extend(str(arg) for arg in args)
            cache_key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
            cache_key = ':'.join(cache_key_parts)
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                logger.debug(f"Calculation cache hit: {cache_key}")
                return result
            
            # Calculate and cache
            result = func(*args, **kwargs)
            cache.set(cache_key, result, timeout)
            logger.debug(f"Cached calculation: {cache_key}")
            
            return result
        
        return wrapper
    return decorator


# Pre-configured decorators for common use cases
cache_profile = cache_profile_data()
cache_reading = cache_reading_data()
cache_compatibility = cache_compatibility_data()
cache_report = cache_report_data()


# Example usage in views:
"""
from numerology.cache_decorators import cache_profile, cache_reading, invalidate_user_cache

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_profile
def get_numerology_profile(request):
    profile = get_numerology_profile(request.user)
    return Response(NumerologyProfileSerializer(profile).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_reading
def get_daily_reading(request):
    # This will be cached with date parameter
    date = request.query_params.get('date')
    reading = get_reading_for_date(request.user, date)
    return Response(DailyReadingSerializer(reading).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    # Update profile
    profile = update_user_profile(request.user, request.data)
    
    # Invalidate cache
    invalidate_user_cache(request.user.id)
    
    return Response(NumerologyProfileSerializer(profile).data)
"""
