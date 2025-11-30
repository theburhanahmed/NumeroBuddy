"""
Calendar API views for Smart Numerology Calendar.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date, timedelta
from .models import NumerologyEvent, PersonalCycle, AuspiciousDate, CalendarReminder
from .serializers import (
    NumerologyEventSerializer, PersonalCycleSerializer,
    AuspiciousDateSerializer, CalendarReminderSerializer
)
from .services import CalendarService
from numerology.models import NumerologyProfile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_events(request):
    """Get numerology events for a date range."""
    user = request.user
    
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    
    if not start_date_str:
        start_date = date.today()
    else:
        try:
            start_date = date.fromisoformat(start_date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid start_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if not end_date_str:
        end_date = start_date + timedelta(days=30)
    else:
        try:
            end_date = date.fromisoformat(end_date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid end_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    events = NumerologyEvent.objects.filter(
        user=user,
        event_date__gte=start_date,
        event_date__lte=end_date
    ).order_by('event_date', '-importance')
    
    serializer = NumerologyEventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auspicious_dates(request):
    """Calculate best dates for activities."""
    user = request.user
    
    activity_type = request.query_params.get('activity_type', 'other')
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    preferred_numbers = request.query_params.get('preferred_numbers')
    
    # Get user's birth date
    try:
        profile = NumerologyProfile.objects.get(user=user)
        if not user.profile.date_of_birth:
            return Response(
                {'error': 'Birth date is required. Please update your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        birth_date = user.profile.date_of_birth
    except NumerologyProfile.DoesNotExist:
        return Response(
            {'error': 'Please calculate your numerology profile first.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not start_date_str:
        start_date = date.today()
    else:
        try:
            start_date = date.fromisoformat(start_date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid start_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if not end_date_str:
        end_date = start_date + timedelta(days=90)
    else:
        try:
            end_date = date.fromisoformat(end_date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid end_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    preferred_nums = None
    if preferred_numbers:
        try:
            preferred_nums = [int(n) for n in preferred_numbers.split(',')]
        except ValueError:
            pass
    
    service = CalendarService()
    auspicious_dates_list = service.find_auspicious_dates(
        birth_date,
        start_date,
        end_date,
        preferred_nums,
        activity_type
    )
    
    return Response(auspicious_dates_list, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reminder(request):
    """Create a numerology-based reminder."""
    user = request.user
    
    serializer = CalendarReminderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def reminder_detail(request, reminder_id):
    """Get, update, or delete a reminder."""
    try:
        reminder = CalendarReminder.objects.get(id=reminder_id, user=request.user)
    except CalendarReminder.DoesNotExist:
        return Response(
            {'error': 'Reminder not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = CalendarReminderSerializer(reminder)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = CalendarReminderSerializer(reminder, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        reminder.delete()
        return Response({'message': 'Reminder deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def personal_cycles(request):
    """Get personal cycle information."""
    user = request.user
    
    start_date_str = request.query_params.get('start_date')
    days_ahead = int(request.query_params.get('days_ahead', 90))
    
    if not start_date_str:
        start_date = date.today()
    else:
        try:
            start_date = date.fromisoformat(start_date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid start_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Get user's birth date
    try:
        if not user.profile.date_of_birth:
            return Response(
                {'error': 'Birth date is required. Please update your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        birth_date = user.profile.date_of_birth
    except AttributeError:
        return Response(
            {'error': 'Please update your profile with birth date.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    service = CalendarService()
    cycles = service.get_upcoming_cycles(birth_date, start_date, days_ahead)
    
    return Response(cycles, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def date_insight(request):
    """Get numerology insight for a specific date."""
    user = request.user
    date_str = request.query_params.get('date')
    
    if not date_str:
        target_date = date.today()
    else:
        try:
            target_date = date.fromisoformat(date_str)
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Get user's birth date
    try:
        if not user.profile.date_of_birth:
            return Response(
                {'error': 'Birth date is required. Please update your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        birth_date = user.profile.date_of_birth
    except AttributeError:
        return Response(
            {'error': 'Please update your profile with birth date.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    service = CalendarService()
    personal_day = service.get_personal_day_number(birth_date, target_date)
    
    # Get personal year and month
    personal_year = service.calculator.calculate_personal_year_number(birth_date, target_date)
    personal_month = service.calculator.calculate_personal_month_number(birth_date, target_date)
    
    insight = {
        'date': target_date.isoformat(),
        'personal_day_number': personal_day,
        'personal_year_number': personal_year,
        'personal_month_number': personal_month,
        'weekday': target_date.strftime('%A'),
        'insight': service._generate_reasoning(personal_day, 8, target_date.weekday())
    }
    
    return Response(insight, status=status.HTTP_200_OK)
