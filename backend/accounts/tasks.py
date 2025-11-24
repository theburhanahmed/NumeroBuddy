"""
Celery tasks for NumerAI accounts application.
"""
from celery import shared_task
from django.utils import timezone
from .models import OTPCode, RefreshToken
import logging

logger = logging.getLogger(__name__)


@shared_task
def cleanup_expired_otps():
    """Clean up expired OTP codes."""
    expired_count = OTPCode.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()[0]
    
    logger.info(f'Deleted {expired_count} expired OTP codes')
    return f'Deleted {expired_count} expired OTP codes'


@shared_task
def cleanup_expired_tokens():
    """Clean up expired refresh tokens."""
    expired_count = RefreshToken.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()[0]
    
    logger.info(f'Deleted {expired_count} expired refresh tokens')
    return f'Deleted {expired_count} expired refresh tokens'