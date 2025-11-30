"""
Analytics API views.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AnalyticsInsight, GrowthMetric
from .serializers import AnalyticsInsightSerializer, GrowthMetricSerializer
from .services import AnalyticsService


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def personal_analytics(request):
    """Get personal analytics."""
    days = int(request.query_params.get('days', 30))
    
    service = AnalyticsService()
    analytics = service.get_personal_analytics(request.user, days)
    
    return Response(analytics, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def behavioral_insights(request):
    """Get behavioral insights."""
    service = AnalyticsService()
    insights = service.generate_insights(request.user)
    
    # Get saved insights
    saved_insights = AnalyticsInsight.objects.filter(
        user=request.user,
        is_read=False
    ).order_by('-confidence_score', '-created_at')[:10]
    
    serializer = AnalyticsInsightSerializer(saved_insights, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def growth_metrics(request):
    """Get growth metrics."""
    period_days = int(request.query_params.get('period_days', 30))
    
    service = AnalyticsService()
    metrics = service.get_growth_metrics(request.user, period_days)
    
    # Get historical metrics
    historical = GrowthMetric.objects.filter(
        user=request.user
    ).order_by('-period_end')[:10]
    
    historical_serializer = GrowthMetricSerializer(historical, many=True)
    
    return Response({
        'current_metrics': metrics,
        'historical_metrics': historical_serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_behavior(request):
    """Track user behavior."""
    action_type = request.data.get('action_type')
    action_details = request.data.get('action_details', {})
    
    if not action_type:
        return Response(
            {'error': 'action_type is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    service = AnalyticsService()
    service.track_behavior(
        request.user,
        action_type,
        action_details,
        session_id=request.data.get('session_id', ''),
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({'message': 'Behavior tracked'}, status=status.HTTP_201_CREATED)
