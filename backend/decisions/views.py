"""
Decision Engine API views.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from .models import Decision, DecisionOutcome
from .serializers import DecisionSerializer, DecisionOutcomeSerializer
from .services import DecisionEngineService


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_decision(request):
    """Analyze decision with numerology."""
    decision_text = request.data.get('decision_text')
    decision_category = request.data.get('decision_category', 'personal')
    decision_date_str = request.data.get('decision_date')
    
    if not decision_text:
        return Response(
            {'error': 'decision_text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    decision_date = None
    if decision_date_str:
        try:
            decision_date = datetime.strptime(decision_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    service = DecisionEngineService()
    result = service.analyze_decision(
        request.user,
        decision_text,
        decision_category,
        decision_date
    )
    
    if 'error' in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def decision_history(request):
    """Get decision history."""
    limit = int(request.query_params.get('limit', 10))
    
    service = DecisionEngineService()
    history = service.get_decision_history(request.user, limit)
    
    return Response(history, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_outcome(request, decision_id):
    """Record decision outcome."""
    outcome_data = request.data
    
    if not outcome_data.get('outcome_type'):
        return Response(
            {'error': 'outcome_type is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if outcome_data.get('actual_date'):
        try:
            outcome_data['actual_date'] = datetime.strptime(
                outcome_data['actual_date'], '%Y-%m-%d'
            ).date()
        except ValueError:
            return Response(
                {'error': 'Invalid actual_date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    service = DecisionEngineService()
    result = service.record_outcome(decision_id, request.user, outcome_data)
    
    if 'error' in result:
        return Response(result, status=status.HTTP_404_NOT_FOUND)
    
    return Response(result, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    """Get decision recommendations."""
    decision_category = request.query_params.get('category')
    
    service = DecisionEngineService()
    recommendations = service.get_recommendations(request.user, decision_category)
    
    return Response(recommendations, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def success_rate(request):
    """Get decision success rate analytics."""
    service = DecisionEngineService()
    stats = service.get_success_rate(request.user)
    
    return Response(stats, status=status.HTTP_200_OK)
