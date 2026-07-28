"""
Serializers for MEUS API.
"""
from rest_framework import serializers
from .models import (
    EntityProfile,
    EntityRelationship,
    EntityInfluence,
    UniverseEvent,
    AssetProfile,
    CrossProfileAnalysisCache
)


class EntityProfileSerializer(serializers.ModelSerializer):
    """Serializer for EntityProfile."""
    
    numerology_profile_data = serializers.SerializerMethodField()
    compatibility_with_user = serializers.SerializerMethodField()
    influence_on_user = serializers.SerializerMethodField()
    
    class Meta:
        model = EntityProfile
        fields = [
            'id', 'entity_type', 'name', 'date_of_birth', 'relationship_type',
            'metadata', 'numerology_data', 'numerology_profile_data',
            'compatibility_with_user', 'influence_on_user', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'numerology_data']

    def validate(self, attrs):
        entity_type = attrs.get('entity_type', getattr(self.instance, 'entity_type', None))
        date_of_birth = attrs.get('date_of_birth', getattr(self.instance, 'date_of_birth', None))
        if entity_type == 'person' and not date_of_birth:
            raise serializers.ValidationError({'date_of_birth': 'Date of birth is required for a person.'})
        return attrs
    
    def get_numerology_profile_data(self, obj):
        """Get numerology profile data if available."""
        if obj.numerology_data:
            return {
                key: obj.numerology_data.get(key)
                for key in ('life_path_number', 'destiny_number', 'soul_urge_number', 'personality_number')
            }
        return None
    
    def get_compatibility_with_user(self, obj):
        """Get compatibility with user."""
        request = self.context.get('request')
        if not request or not request.user:
            return None
        
        from .services.compatibility_engine import CompatibilityEngine
        engine = CompatibilityEngine()
        
        try:
            return engine.calculate_entity_to_user_compatibility(obj, request.user)
        except Exception:
            return None
    
    def get_influence_on_user(self, obj):
        """Get influence on user."""
        request = self.context.get('request')
        if not request or not request.user:
            return None
        
        from .services.influence_scoring import InfluenceScoringService
        service = InfluenceScoringService()
        
        try:
            influence = service.calculate_influence(obj, request.user)
            return influence
        except Exception:
            return None


class EntityRelationshipSerializer(serializers.ModelSerializer):
    """Serializer for EntityRelationship."""
    
    entity_1_name = serializers.CharField(source='entity_1.name', read_only=True)
    entity_2_name = serializers.CharField(source='entity_2.name', read_only=True)
    
    class Meta:
        model = EntityRelationship
        fields = [
            'id', 'entity_1', 'entity_1_name', 'entity_2', 'entity_2_name',
            'relationship_type', 'compatibility_score', 'influence_score',
            'analysis_data', 'calculated_at', 'expires_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'relationship_type', 'compatibility_score', 'influence_score', 'analysis_data', 'calculated_at', 'created_at', 'updated_at']

    def validate(self, attrs):
        entity_1 = attrs.get('entity_1', getattr(self.instance, 'entity_1', None))
        entity_2 = attrs.get('entity_2', getattr(self.instance, 'entity_2', None))
        request = self.context.get('request')
        if entity_1 == entity_2:
            raise serializers.ValidationError('An entity cannot be related to itself.')
        if request and (entity_1.user_id != request.user.id or entity_2.user_id != request.user.id):
            raise serializers.ValidationError('Both entities must belong to the current user.')
        return attrs


class EntityInfluenceSerializer(serializers.ModelSerializer):
    """Serializer for EntityInfluence."""
    
    entity_name = serializers.CharField(source='entity.name', read_only=True)
    
    class Meta:
        model = EntityInfluence
        fields = [
            'id', 'user', 'entity', 'entity_name', 'influence_strength',
            'impact_type', 'impact_areas', 'cycle_period', 'cycle_value',
            'calculated_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'calculated_at', 'created_at', 'updated_at']


class UniverseEventSerializer(serializers.ModelSerializer):
    """Serializer for UniverseEvent."""
    
    related_entity_names = serializers.SerializerMethodField()
    
    class Meta:
        model = UniverseEvent
        fields = [
            'id', 'user', 'event_type', 'event_date', 'title', 'description',
            'related_entities', 'related_entity_names', 'numerology_insight',
            'is_completed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'numerology_insight', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request:
            queryset = EntityProfile.objects.filter(user=request.user, is_active=True)
            self.fields['related_entities'].child_relation.queryset = queryset
    
    def get_related_entity_names(self, obj):
        """Get names of related entities."""
        return [entity.name for entity in obj.related_entities.all()]


class AssetProfileSerializer(serializers.ModelSerializer):
    """Serializer for AssetProfile."""
    
    entity_name = serializers.CharField(source='entity.name', read_only=True)
    
    class Meta:
        model = AssetProfile
        fields = [
            'id', 'entity', 'entity_name', 'asset_type', 'asset_number',
            'numerology_vibration', 'safety_score', 'compatibility_with_owner',
            'additional_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'numerology_vibration', 'safety_score', 'compatibility_with_owner', 'created_at', 'updated_at']

    def validate_entity(self, entity):
        request = self.context.get('request')
        if entity.entity_type != 'asset':
            raise serializers.ValidationError('Asset profile requires an asset entity.')
        if request and entity.user_id != request.user.id:
            raise serializers.ValidationError('Asset entity must belong to the current user.')
        return entity


class CrossEntityAnalysisSerializer(serializers.Serializer):
    """Serializer for cross-entity analysis request."""
    
    entity_ids = serializers.ListField(
        child=serializers.UUIDField(),
        min_length=2,
        help_text="List of entity IDs to analyze"
    )
    analysis_type = serializers.ChoiceField(
        choices=['compatibility', 'influence', 'full'],
        default='full'
    )


class NextActionRecommendationSerializer(serializers.Serializer):
    """Serializer for next action recommendations."""
    
    id = serializers.UUIDField()
    type = serializers.CharField()
    priority = serializers.CharField()
    title = serializers.CharField()
    message = serializers.CharField()
    entity_id = serializers.UUIDField(required=False)
    entity_name = serializers.CharField(required=False)
    reasoning = serializers.CharField()
    action_items = serializers.ListField(child=serializers.CharField())
    timing = serializers.DictField()

