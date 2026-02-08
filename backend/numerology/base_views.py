"""
Base view classes and mixins for common patterns in numerology views.
Reduces code duplication and standardizes error handling.
"""
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class StandardErrorMixin:
    """Mixin providing standardized error responses."""
    
    @staticmethod
    def error_response(message, status_code=status.HTTP_400_BAD_REQUEST, extra_data=None):
        """
        Return standardized error response.
        
        Args:
            message: Error message string
            status_code: HTTP status code
            extra_data: Additional data to include in response
        
        Returns:
            Response object
        """
        data = {'error': message}
        if extra_data:
            data.update(extra_data)
        return Response(data, status=status_code)
    
    @staticmethod
    def validation_error(errors):
        """
        Return validation error response.
        
        Args:
            errors: Dictionary of field errors or list of error messages
        
        Returns:
            Response object with 400 status
        """
        return Response(
            {'error': 'Validation failed', 'details': errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @staticmethod
    def not_found_error(resource='Resource'):
        """
        Return 404 not found error.
        
        Args:
            resource: Name of the resource that wasn't found
        
        Returns:
            Response object with 404 status
        """
        return Response(
            {'error': f'{resource} not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    @staticmethod
    def success_response(data, message=None, status_code=status.HTTP_200_OK):
        """
        Return standardized success response.
        
        Args:
            data: Response data
            message: Optional success message
            status_code: HTTP status code
        
        Returns:
            Response object
        """
        response_data = data if isinstance(data, dict) else {'data': data}
        if message:
            response_data['message'] = message
        return Response(response_data, status=status_code)


class ValidatedRequestMixin:
    """Mixin providing request validation utilities."""
    
    def validate_required_fields(self, request, fields):
        """
        Validate that required fields are present in request data.
        
        Args:
            request: Request object
            fields: List of required field names
        
        Returns:
            Tuple of (is_valid, error_response)
            If valid: (True, None)
            If invalid: (False, Response object)
        """
        missing_fields = []
        for field in fields:
            if field not in request.data or request.data.get(field) is None:
                missing_fields.append(field)
        
        if missing_fields:
            return False, self.error_response(
                f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        return True, None
    
    def get_validated_data(self, request, field_validators):
        """
        Get and validate request data with custom validators.
        
        Args:
            request: Request object
            field_validators: Dict mapping field names to validator functions
                Example: {'age': lambda x: int(x) if x else None}
        
        Returns:
            Tuple of (is_valid, data_or_error)
            If valid: (True, validated_data_dict)
            If invalid: (False, Response object)
        """
        validated_data = {}
        errors = {}
        
        for field, validator in field_validators.items():
            try:
                value = request.data.get(field)
                validated_data[field] = validator(value) if validator else value
            except (ValueError, TypeError) as e:
                errors[field] = str(e)
        
        if errors:
            return False, self.validation_error(errors)
        
        return True, validated_data


def handle_exceptions(view_func):
    """
    Decorator to handle common exceptions in view functions.
    
    Usage:
        @api_view(['GET'])
        @handle_exceptions
        def my_view(request):
            # Your code here
            return Response({'data': 'success'})
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            return view_func(request, *args, **kwargs)
        except ValueError as e:
            logger.error(f"ValueError in {view_func.__name__}: {str(e)}")
            return Response(
                {'error': f'Invalid input: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except KeyError as e:
            logger.error(f"KeyError in {view_func.__name__}: {str(e)}")
            return Response(
                {'error': f'Missing required field: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error in {view_func.__name__}: {str(e)}", exc_info=True)
            return Response(
                {'error': 'An unexpected error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return wrapper


class NumerologyBaseView(APIView, StandardErrorMixin, ValidatedRequestMixin):
    """
    Base view class for numerology endpoints.
    Provides common functionality and error handling.
    """
    
    def handle_exception(self, exc):
        """Override to provide custom exception handling."""
        logger.error(f"Exception in {self.__class__.__name__}: {str(exc)}", exc_info=True)
        
        if hasattr(exc, 'status_code'):
            return Response(
                {'error': str(exc)},
                status=exc.status_code
            )
        
        return Response(
            {'error': 'An unexpected error occurred'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def validate_date_params(view_func):
    """
    Decorator to validate date parameters in request.
    Expects 'day', 'month', 'year' in request data.
    
    Usage:
        @api_view(['POST'])
        @validate_date_params
        def my_view(request):
            # day, month, year are guaranteed to be valid
            return Response({'data': 'success'})
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        day = request.data.get('day')
        month = request.data.get('month')
        year = request.data.get('year')
        
        if not all([day, month, year]):
            return Response(
                {'error': 'Missing required date fields: day, month, year'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            day = int(day)
            month = int(month)
            year = int(year)
            
            if not (1 <= day <= 31):
                raise ValueError('Day must be between 1 and 31')
            if not (1 <= month <= 12):
                raise ValueError('Month must be between 1 and 12')
            if not (1900 <= year <= 2100):
                raise ValueError('Year must be between 1900 and 2100')
            
            # Update request data with validated values
            request.data['day'] = day
            request.data['month'] = month
            request.data['year'] = year
            
        except ValueError as e:
            return Response(
                {'error': f'Invalid date parameters: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return view_func(request, *args, **kwargs)
    
    return wrapper


def validate_birth_date_params(view_func):
    """
    Decorator to validate birth date parameters in request.
    Expects 'birth_day', 'birth_month', 'birth_year' in request data.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        birth_day = request.data.get('birth_day')
        birth_month = request.data.get('birth_month')
        birth_year = request.data.get('birth_year')
        
        if not all([birth_day, birth_month, birth_year]):
            return Response(
                {'error': 'Missing required fields: birth_day, birth_month, birth_year'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            birth_day = int(birth_day)
            birth_month = int(birth_month)
            birth_year = int(birth_year)
            
            if not (1 <= birth_day <= 31):
                raise ValueError('Birth day must be between 1 and 31')
            if not (1 <= birth_month <= 12):
                raise ValueError('Birth month must be between 1 and 12')
            if not (1900 <= birth_year <= 2100):
                raise ValueError('Birth year must be between 1900 and 2100')
            
            # Update request data with validated values
            request.data['birth_day'] = birth_day
            request.data['birth_month'] = birth_month
            request.data['birth_year'] = birth_year
            
        except ValueError as e:
            return Response(
                {'error': f'Invalid birth date parameters: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return view_func(request, *args, **kwargs)
    
    return wrapper


def log_activity(activity_type):
    """
    Decorator to log user activity.
    
    Args:
        activity_type: String describing the activity type
    
    Usage:
        @api_view(['GET'])
        @log_activity('viewed_profile')
        def my_view(request):
            return Response({'data': 'success'})
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            from utils.activity_logger import log_user_activity
            
            response = view_func(request, *args, **kwargs)
            
            # Log activity after successful response
            if response.status_code < 400 and hasattr(request, 'user') and request.user.is_authenticated:
                try:
                    log_user_activity(request.user, activity_type, {
                        'endpoint': request.path,
                        'method': request.method,
                    })
                except Exception as e:
                    logger.warning(f"Failed to log activity: {str(e)}")
            
            return response
        
        return wrapper
    return decorator
