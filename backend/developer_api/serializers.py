"""
Serializers for developer_api app.
"""
from rest_framework import serializers
from .models import APIKey, APIUsage


class APIKeySerializer(serializers.ModelSerializer):
    """Serializer for API keys."""
    
    class Meta:
        model = APIKey
        fields = [
            'id', 'user', 'key_name', 'api_key', 'is_active',
            'rate_limit', 'created_at', 'last_used_at'
        ]
        read_only_fields = ['id', 'api_key', 'created_at', 'last_used_at']


class APIUsageSerializer(serializers.ModelSerializer):
    """Serializer for API usage."""
    
    class Meta:
        model = APIUsage
        fields = [
            'id', 'api_key', 'endpoint', 'method',
            'response_status', 'response_time_ms', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

