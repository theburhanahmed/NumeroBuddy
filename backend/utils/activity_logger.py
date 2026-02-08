"""
Utility for logging user activities.
Uses analytics.UserActivityLog as the single source of truth for activity tracking.
"""
from functools import wraps
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


def log_user_activity(user, activity_type, metadata=None):
    """
    Log a user activity (dashboard feed and analytics).

    Args:
        user: User instance
        activity_type: Type of activity (e.g. birth_chart_viewed, report_generated)
        metadata: Optional dict with additional activity data (stored as activity_data)
    """
    if not user or not user.is_authenticated:
        return

    try:
        from analytics.models import UserActivityLog
        UserActivityLog.objects.create(
            user=user,
            activity_type=activity_type,
            activity_data=metadata or {},
        )
    except Exception as e:
        logger.error(f'Failed to log user activity: {str(e)}', exc_info=True)


def log_activity(activity_type, metadata_func=None):
    """
    Decorator to log user activity for API views.
    
    Args:
        activity_type: Type of activity to log
        metadata_func: Optional function to extract metadata from request/response
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            # Call the original function
            response = func(request, *args, **kwargs)
            
            # Log activity if user is authenticated
            if hasattr(request, 'user') and request.user.is_authenticated:
                metadata = {}
                if metadata_func:
                    try:
                        metadata = metadata_func(request, response, *args, **kwargs)
                    except Exception as e:
                        logger.warning(f'Failed to extract metadata: {str(e)}')
                
                log_user_activity(request.user, activity_type, metadata)
            
            return response
        return wrapper
    return decorator


def log_page_view(user, page_name, metadata=None):
    """Log a page view activity."""
    activity_metadata = {'page': page_name}
    if metadata:
        activity_metadata.update(metadata)
    
    # Map page names to activity types
    page_to_activity = {
        'dashboard': 'profile_updated',
        'birth_chart': 'birth_chart_viewed',
        'daily_reading': 'daily_reading_viewed',
        'compatibility': 'compatibility_checked',
        'remedies': 'remedy_tracked',
        'ai_chat': 'ai_chat_used',
        'reports': 'report_generated',
        'people': 'person_added',
        'consultations': 'consultation_booked',
    }
    
    activity_type = page_to_activity.get(page_name, 'profile_updated')
    log_user_activity(user, activity_type, activity_metadata)


def log_feature_usage(user, feature_name, metadata=None):
    """Log feature usage."""
    activity_metadata = {'feature': feature_name}
    if metadata:
        activity_metadata.update(metadata)
    
    log_user_activity(user, 'profile_updated', activity_metadata)

