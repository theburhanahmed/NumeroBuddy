"""Rewards API views."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reward, UserReward, Achievement, UserAchievement, PointsTransaction


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_points(request):
    """Get user points."""
    transactions = PointsTransaction.objects.filter(user=request.user)
    total_points = sum(t.points if t.transaction_type == 'earned' or t.transaction_type == 'bonus' else -t.points for t in transactions)
    return Response({'total_points': max(0, total_points)}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_achievements(request):
    """Get user achievements."""
    achievements = UserAchievement.objects.filter(user=request.user)
    return Response({'achievements': []}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reward_catalog(request):
    """Get reward catalog."""
    rewards = Reward.objects.filter(is_active=True)
    return Response({'rewards': []}, status=status.HTTP_200_OK)
