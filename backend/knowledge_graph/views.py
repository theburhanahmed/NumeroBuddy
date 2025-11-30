"""
Knowledge Graph API views.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import NumberRelationship, NumerologyPattern, NumerologyRule
from .serializers import (
    NumberRelationshipSerializer, NumerologyPatternSerializer,
    NumerologyRuleSerializer
)
from .services import KnowledgeGraphService


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def discover_patterns(request):
    """Discover patterns in user's numbers."""
    user = request.user
    service = KnowledgeGraphService()
    
    patterns = service.discover_user_patterns(user)
    
    # Save patterns to database
    saved_patterns = []
    for pattern_data in patterns:
        pattern, created = NumerologyPattern.objects.update_or_create(
            user=user,
            pattern_type=pattern_data['type'],
            defaults={
                'pattern_data': pattern_data['pattern_data'],
                'description': pattern_data['description'],
                'significance': pattern_data['significance'],
                'confidence_score': pattern_data['confidence_score']
            }
        )
        saved_patterns.append(pattern)
    
    serializer = NumerologyPatternSerializer(saved_patterns, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def find_connections(request):
    """Find connections between numbers."""
    number = request.query_params.get('number')
    
    if not number:
        return Response(
            {'error': 'number parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        number = int(number)
    except ValueError:
        return Response(
            {'error': 'number must be an integer'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    service = KnowledgeGraphService()
    connections = service.find_number_connections(number)
    
    return Response(connections, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_insights(request):
    """Generate insights from graph data."""
    user = request.user
    service = KnowledgeGraphService()
    
    insights = service.generate_insights(user)
    
    return Response(insights, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def query_graph(request):
    """Execute custom graph queries."""
    query_type = request.data.get('query_type')
    params = request.data.get('params', {})
    
    if not query_type:
        return Response(
            {'error': 'query_type is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    service = KnowledgeGraphService()
    result = service.query_graph(query_type, params)
    
    return Response(result, status=status.HTTP_200_OK)
