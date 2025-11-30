"""
Serializers for matchmaking app.
"""
from rest_framework import serializers
from .models import Match, MatchPreference


class MatchSerializer(serializers.ModelSerializer):
    """Serializer for matches."""
    
    user1_email = serializers.CharField(source='user1.email', read_only=True)
    user2_email = serializers.CharField(source='user2.email', read_only=True)
    
    class Meta:
        model = Match
        fields = [
            'id', 'user1', 'user1_email', 'user2', 'user2_email',
            'match_score', 'match_details', 'is_mutual', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class MatchPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for match preferences."""
    
    class Meta:
        model = MatchPreference
        fields = [
            'id', 'preferred_life_paths', 'min_compatibility_score',
            'age_range_min', 'age_range_max', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

