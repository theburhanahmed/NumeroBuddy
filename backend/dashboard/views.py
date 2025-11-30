"""
Dashboard API views for NumerAI OS.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import models
from datetime import timedelta
from .models import DashboardWidget, UserActivity, QuickInsight
from .serializers import (
    DashboardWidgetSerializer, UserActivitySerializer,
    QuickInsightSerializer, DashboardOverviewSerializer
)
from numerology.models import NumerologyProfile, DailyReading
from numerology.serializers import NumerologyProfileSerializer, DailyReadingSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_overview(request):
    """Get unified dashboard data."""
    user = request.user
    
    # Get user's widgets
    widgets = DashboardWidget.objects.filter(
        user=user,
        is_visible=True
    ).order_by('position')
    widget_serializer = DashboardWidgetSerializer(widgets, many=True)
    
    # Get unread insights
    insights = QuickInsight.objects.filter(
        user=user,
        is_read=False
    ).filter(
        models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=timezone.now())
    ).order_by('-priority', '-created_at')[:5]
    insight_serializer = QuickInsightSerializer(insights, many=True)
    
    # Get recent activities
    recent_activities = UserActivity.objects.filter(
        user=user
    ).order_by('-created_at')[:10]
    activity_serializer = UserActivitySerializer(recent_activities, many=True)
    
    # Get today's daily reading
    daily_reading_data = None
    try:
        today_reading = DailyReading.objects.get(
            user=user,
            reading_date=timezone.now().date()
        )
        daily_reading_data = DailyReadingSerializer(today_reading).data
    except DailyReading.DoesNotExist:
        pass
    
    # Get numerology profile
    numerology_profile_data = None
    try:
        profile = NumerologyProfile.objects.get(user=user)
        numerology_profile_data = NumerologyProfileSerializer(profile).data
    except NumerologyProfile.DoesNotExist:
        pass
    
    # Get upcoming events from calendar
    upcoming_events = []
    try:
        from smart_calendar.models import NumerologyEvent
        from smart_calendar.services import CalendarService
        from datetime import timedelta
        
        end_date = timezone.now().date() + timedelta(days=30)
        events = NumerologyEvent.objects.filter(
            user=user,
            event_date__gte=timezone.now().date(),
            event_date__lte=end_date
        ).order_by('event_date')[:5]
        
        upcoming_events = [{
            'id': str(e.id),
            'title': e.title,
            'date': e.event_date.isoformat(),
            'type': e.event_type,
            'importance': e.importance
        } for e in events]
    except Exception:
        pass
    
    # Get stats
    stats = {
        'total_readings': DailyReading.objects.filter(user=user).count(),
        'profile_calculated': numerology_profile_data is not None,
        'unread_insights': QuickInsight.objects.filter(user=user, is_read=False).count(),
    }
    
    # Build overview data
    overview_data = {
        'widgets': widget_serializer.data,
        'insights': insight_serializer.data,
        'recent_activities': activity_serializer.data,
        'daily_reading': daily_reading_data,
        'numerology_profile': numerology_profile_data,
        'upcoming_events': upcoming_events,
        'stats': stats,
    }
    
    serializer = DashboardOverviewSerializer(overview_data)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard_widgets(request):
    """Get or create dashboard widgets."""
    user = request.user
    
    if request.method == 'GET':
        widgets = DashboardWidget.objects.filter(user=user).order_by('position')
        serializer = DashboardWidgetSerializer(widgets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        widget_type = request.data.get('widget_type')
        position = request.data.get('position', 0)
        config = request.data.get('config', {})
        
        if not widget_type:
            return Response(
                {'error': 'widget_type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        widget, created = DashboardWidget.objects.update_or_create(
            user=user,
            widget_type=widget_type,
            defaults={
                'position': position,
                'config': config,
                'is_visible': True
            }
        )
        
        serializer = DashboardWidgetSerializer(widget)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def dashboard_widget_detail(request, widget_id):
    """Update or delete a dashboard widget."""
    try:
        widget = DashboardWidget.objects.get(id=widget_id, user=request.user)
    except DashboardWidget.DoesNotExist:
        return Response(
            {'error': 'Widget not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'PUT':
        serializer = DashboardWidgetSerializer(widget, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        widget.delete()
        return Response({'message': 'Widget deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dashboard_widgets_reorder(request):
    """Reorder dashboard widgets."""
    widget_positions = request.data.get('widget_positions', [])
    
    if not widget_positions:
        return Response(
            {'error': 'widget_positions is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    updated_widgets = []
    for item in widget_positions:
        widget_id = item.get('id')
        position = item.get('position')
        
        if widget_id and position is not None:
            try:
                widget = DashboardWidget.objects.get(id=widget_id, user=request.user)
                widget.position = position
                widget.save()
                updated_widgets.append(widget)
            except DashboardWidget.DoesNotExist:
                continue
    
    serializer = DashboardWidgetSerializer(updated_widgets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_insights(request):
    """Get AI-generated insights."""
    user = request.user
    limit = int(request.query_params.get('limit', 10))
    unread_only = request.query_params.get('unread_only', 'false').lower() == 'true'
    
    queryset = QuickInsight.objects.filter(user=user)
    
    if unread_only:
        queryset = queryset.filter(is_read=False)
    
    # Filter out expired insights
    queryset = queryset.filter(
        models.Q(expires_at__isnull=True) | models.Q(expires_at__gt=timezone.now())
    )
    
    insights = queryset.order_by('-priority', '-created_at')[:limit]
    serializer = QuickInsightSerializer(insights, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dashboard_insight_mark_read(request, insight_id):
    """Mark an insight as read."""
    try:
        insight = QuickInsight.objects.get(id=insight_id, user=request.user)
        insight.is_read = True
        insight.save()
        serializer = QuickInsightSerializer(insight)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except QuickInsight.DoesNotExist:
        return Response(
            {'error': 'Insight not found'},
            status=status.HTTP_404_NOT_FOUND
        )
