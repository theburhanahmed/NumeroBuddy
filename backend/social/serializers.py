"""
Serializers for social app.
"""
from rest_framework import serializers
from .models import Connection, Interaction, SocialGroup


class ConnectionSerializer(serializers.ModelSerializer):
    """Serializer for connections."""
    
    connection_type_display = serializers.CharField(source='get_connection_type_display', read_only=True)
    user1_email = serializers.CharField(source='user1.email', read_only=True)
    user2_email = serializers.CharField(source='user2.email', read_only=True)
    
    class Meta:
        model = Connection
        fields = [
            'id', 'user1', 'user1_email', 'user2', 'user2_email',
            'connection_type', 'connection_type_display', 'is_mutual', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class InteractionSerializer(serializers.ModelSerializer):
    """Serializer for interactions."""
    
    interaction_type_display = serializers.CharField(source='get_interaction_type_display', read_only=True)
    
    class Meta:
        model = Interaction
        fields = [
            'id', 'from_user', 'to_user', 'interaction_type',
            'interaction_type_display', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SocialGroupSerializer(serializers.ModelSerializer):
    """Serializer for social groups."""
    
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SocialGroup
        fields = [
            'id', 'name', 'description', 'group_type',
            'members', 'member_count', 'created_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_member_count(self, obj):
        return obj.members.count()

