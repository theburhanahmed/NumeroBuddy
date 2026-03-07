"""Social Graph API views."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Connection, SocialGroup
from .serializers import ConnectionSerializer, SocialGroupSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def connections(request):
    """List connections (GET) or create (POST). POST not implemented."""
    if request.method == 'POST':
        return Response(
            {'error': 'Creating connections is not implemented yet. Use GET to list connections.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
    qs = Connection.objects.filter(
        models.Q(user1=request.user) | models.Q(user2=request.user)
    ).select_related('user1', 'user2').order_by('-created_at')
    serializer = ConnectionSerializer(qs, many=True)
    return Response({'connections': serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def social_groups(request):
    """Get numerology-based groups."""
    groups = SocialGroup.objects.filter(members=request.user).prefetch_related('members')
    serializer = SocialGroupSerializer(groups, many=True)
    return Response({'groups': serializer.data}, status=status.HTTP_200_OK)
