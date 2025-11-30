"""Developer API views."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import APIKey, APIUsage


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_api_key(request):
    """Register a new API key."""
    key_name = request.data.get('key_name')
    
    if not key_name:
        return Response(
            {'error': 'key_name is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    api_key = APIKey.objects.create(
        user=request.user,
        key_name=key_name
    )
    
    return Response({
        'api_key': api_key.api_key,
        'key_name': api_key.key_name,
        'created_at': api_key.created_at
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_api_keys(request):
    """List user's API keys."""
    keys = APIKey.objects.filter(user=request.user)
    return Response({
        'keys': [{
            'id': str(k.id),
            'key_name': k.key_name,
            'is_active': k.is_active,
            'rate_limit': k.rate_limit,
            'created_at': k.created_at,
            'last_used_at': k.last_used_at
        } for k in keys]
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_usage_stats(request, key_id):
    """Get API usage statistics."""
    try:
        api_key = APIKey.objects.get(id=key_id, user=request.user)
    except APIKey.DoesNotExist:
        return Response(
            {'error': 'API key not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    usage = APIUsage.objects.filter(api_key=api_key)
    total_requests = usage.count()
    
    return Response({
        'total_requests': total_requests,
        'last_used': api_key.last_used_at
    }, status=status.HTTP_200_OK)
