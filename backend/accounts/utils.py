"""
Utility functions for accounts application.
"""
import random
import string
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_otp(length=6):
    """Generate a random OTP."""
    return ''.join(random.choices(string.digits, k=length))


def send_otp_email(email, otp):
    """Send OTP to user's email."""
    try:
        logger.info(f"Attempting to send OTP email to {email}")
        send_mail(
            subject='NumerAI - OTP Verification',
            message=f'Your OTP for account verification is: {otp}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"OTP email successfully sent to {email}")
        return True
    except Exception as e:
        logger.error(
            f"Failed to send OTP email to {email}: {str(e)}. "
            f"Email backend: {settings.EMAIL_BACKEND}, "
            f"From email: {settings.DEFAULT_FROM_EMAIL}, "
            f"Email host: {getattr(settings, 'EMAIL_HOST', 'Not configured')}"
        )
        return False


def generate_secure_token(length=32):
    """Generate a secure random token."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def send_password_reset_email(user, token):
    """Send password reset email with token."""
    try:
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        logger.info(f"Attempting to send password reset email to {user.email}")
        send_mail(
            subject='NumerAI - Password Reset',
            message=f'Hello {user.full_name},\n\n'
                    f'You requested a password reset. Click the link below to reset your password:\n'
                    f'{reset_url}\n\n'
                    f'This link will expire in 24 hours.\n\n'
                    f'If you did not request this, please ignore this email.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Password reset email successfully sent to {user.email}")
        return True
    except Exception as e:
        logger.error(
            f"Failed to send password reset email to {user.email}: {str(e)}. "
            f"Email backend: {settings.EMAIL_BACKEND}, "
            f"From email: {settings.DEFAULT_FROM_EMAIL}"
        )
        return False