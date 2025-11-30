"""Social Graph API views."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Connection, SocialGroup


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def connections(request):
    """Get or create connections."""
    if request.method == 'GET':
        connections = Connection.objects.filter(
            models.Q(user1=request.user) | models.Q(user2=request.user)
        )
        return Response({'connections': []}, status=status.HTTP_200_OK)
    return Response({'message': 'Not implemented'}, status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def social_groups(request):
    """Get numerology-based groups."""
    groups = SocialGroup.objects.filter(members=request.user)
    return Response({'groups': []}, status=status.HTTP_200_OK)
