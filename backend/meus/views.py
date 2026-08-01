"""
API views for MEUS (Multi-Entity Universe System).
"""
import hashlib
import json
from datetime import date, timedelta

from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserProfile
from feature_flags.services import FeatureFlagService
from numerology.numerology import NumerologyCalculator
from .models import (
    AssetProfile,
    CrossProfileAnalysisCache,
    EntityInfluence,
    EntityProfile,
    EntityRelationship,
    UniverseEvent,
)
from .serializers import (
    AssetProfileSerializer,
    CrossEntityAnalysisSerializer,
    EntityProfileSerializer,
    EntityRelationshipSerializer,
    UniverseEventSerializer,
)
from .services import CompatibilityEngine, CycleSynchronizationService, GraphGeneratorService, InfluenceScoringService, RecommendationEngine


def require_meus_feature(user, feature_name):
    if not FeatureFlagService.can_access(user, feature_name):
        raise PermissionDenied(f'{feature_name.replace("_", " ").title()} is not available for your plan.')


def calculate_entity_numerology(entity):
    if not entity.date_of_birth:
        return {}
    return NumerologyCalculator().calculate_all(entity.name, entity.date_of_birth)


def calculate_event_insight(user, event_date):
    birth_date = UserProfile.objects.filter(user=user).values_list('date_of_birth', flat=True).first()
    if not birth_date:
        return {}
    calculator = NumerologyCalculator()
    personal_day = calculator.calculate_personal_day_number(birth_date, event_date)
    universal_day = calculator._reduce_to_single_digit(
        event_date.year + event_date.month + event_date.day,
        preserve_master=False,
    )
    score = max(20, 100 - abs(personal_day - universal_day) * 10)
    return {
        'personal_day_number': personal_day,
        'universal_day_number': universal_day,
        'alignment_score': score,
        'favorable': score >= 70,
    }


class FeatureProtectedMixin:
    feature_name = None

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        require_meus_feature(request.user, self.feature_name)


class EntityProfileListCreateView(FeatureProtectedMixin, ListCreateAPIView):
    serializer_class = EntityProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_entities'

    def get_queryset(self):
        queryset = EntityProfile.objects.filter(user=self.request.user, is_active=True)
        entity_type = self.request.query_params.get('entity_type')
        relationship_type = self.request.query_params.get('relationship_type')
        if entity_type:
            queryset = queryset.filter(entity_type=entity_type)
        if relationship_type:
            queryset = queryset.filter(relationship_type=relationship_type)
        return queryset.order_by('-created_at')

    @transaction.atomic
    def perform_create(self, serializer):
        entity = serializer.save(user=self.request.user)
        entity.numerology_data = calculate_entity_numerology(entity)
        entity.save(update_fields=['numerology_data'])


class EntityProfileDetailView(FeatureProtectedMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = EntityProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_entities'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return EntityProfile.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_update(self, serializer):
        entity = serializer.save()
        entity.numerology_data = calculate_entity_numerology(entity)
        entity.save(update_fields=['numerology_data'])
        entity.relationships_as_entity_1.all().delete()
        entity.relationships_as_entity_2.all().delete()
        CrossProfileAnalysisCache.objects.filter(user=self.request.user).delete()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])
        CrossProfileAnalysisCache.objects.filter(user=self.request.user).delete()


class UniverseDashboardView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_dashboard'

    def get(self, request):
        entities = EntityProfile.objects.filter(user=request.user, is_active=True)
        graph_service = GraphGeneratorService()
        network_graph = graph_service.generate_network_graph(request.user)
        now = timezone.now()
        current_month = f'{now.year}-{now.month:02d}'
        influences = InfluenceScoringService().calculate_all_influences(
            request.user,
            period=current_month,
            cycle_period='month',
        )
        conflicts = graph_service.find_conflicts(request.user)
        harmonious = graph_service.find_harmonious_connections(request.user)
        return Response({
            'summary': {
                'total_entities': entities.count(),
                'people_count': entities.filter(entity_type='person').count(),
                'assets_count': entities.filter(entity_type='asset').count(),
                'events_count': entities.filter(entity_type='event').count(),
            },
            'network_graph': network_graph,
            'influence_heatmap': {
                'current_month': current_month,
                'influences': influences,
            },
            'alerts': [
                {
                    'type': 'conflict_warning',
                    'message': f"Potential conflict between {item['entity_1_name']} and {item['entity_2_name']}",
                    **item,
                }
                for item in conflicts
            ],
            'opportunities': harmonious[:5],
        })


class CrossEntityAnalysisView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_analysis'

    @transaction.atomic
    def post(self, request):
        serializer = CrossEntityAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entity_ids = list(dict.fromkeys(serializer.validated_data['entity_ids']))
        analysis_type = serializer.validated_data.get('analysis_type', 'full')
        if len(entity_ids) < 2:
            return Response({'error': 'Select at least two unique entities.'}, status=status.HTTP_400_BAD_REQUEST)
        entities = list(EntityProfile.objects.filter(
            id__in=entity_ids,
            user=request.user,
            is_active=True,
        ))
        if len(entities) != len(entity_ids):
            return Response({'error': 'Some entities were not found.'}, status=status.HTTP_404_NOT_FOUND)

        combination = f'{analysis_type}:{":".join(sorted(str(entity_id) for entity_id in entity_ids))}'
        combination_hash = hashlib.sha256(combination.encode()).hexdigest()
        cached = CrossProfileAnalysisCache.objects.filter(
            user=request.user,
            entity_combination_hash=combination_hash,
            expires_at__gt=timezone.now(),
        ).first()
        if cached:
            return Response({**cached.analysis_result, 'cached': True})

        engine = CompatibilityEngine()
        relationships = []
        for index, entity_1 in enumerate(entities):
            for entity_2 in entities[index + 1:]:
                relationship, _ = engine.get_or_create_relationship(entity_1, entity_2, force_recalculate=True)
                relationships.append(EntityRelationshipSerializer(relationship).data)
        compatibility_matrix = engine.calculate_compatibility_matrix(entities)
        influence_analysis = []
        if analysis_type in ('influence', 'full'):
            influence_service = InfluenceScoringService()
            influence_analysis = [
                {
                    'entity_id': str(entity.id),
                    'entity_name': entity.name,
                    **influence_service.calculate_influence(entity, request.user),
                }
                for entity in entities
            ]
        result = {
            'compatibility_matrix': compatibility_matrix,
            'influence_analysis': influence_analysis,
            'relationships': relationships,
            'calculated_at': timezone.now().isoformat(),
            'cached': False,
        }
        cache_result = json.loads(json.dumps(result, cls=DjangoJSONEncoder))
        CrossProfileAnalysisCache.objects.update_or_create(
            user=request.user,
            entity_combination_hash=combination_hash,
            defaults={
                'analysis_result': cache_result,
                'expires_at': timezone.now() + timedelta(hours=1),
            },
        )
        return Response(result)


class NextActionsView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_recommendations'

    def get(self, request):
        try:
            limit = min(50, max(1, int(request.query_params.get('limit', 10))))
        except ValueError:
            return Response({'error': 'limit must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)
        priority = request.query_params.get('priority', 'all')
        recommendations = RecommendationEngine().generate_recommendations(
            request.user,
            timezone.now().date(),
            limit=limit,
        )
        if priority != 'all':
            recommendations = [item for item in recommendations if item.get('priority') == priority]
        return Response({'recommendations': recommendations, 'generated_at': timezone.now().isoformat()})


class InfluenceMapView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_dashboard'

    def get(self, request):
        period = request.query_params.get('period', 'month')
        if period not in ('month', 'year'):
            return Response({'error': 'period must be month or year.'}, status=status.HTTP_400_BAD_REQUEST)
        now = timezone.now()
        period_value = request.query_params.get('period_value') or (
            str(now.year) if period == 'year' else f'{now.year}-{now.month:02d}'
        )
        influences = InfluenceScoringService().calculate_all_influences(
            request.user,
            period=period_value,
            cycle_period=period,
        )
        graph = GraphGeneratorService().generate_influence_graph(request.user, period_value)
        return Response({
            'period': period_value,
            'influences': influences,
            'nodes': graph['nodes'],
            'edges': graph['edges'],
            'heatmap_data': {
                'positive_count': sum(1 for item in influences if item.get('impact_type') == 'positive'),
                'negative_count': sum(1 for item in influences if item.get('impact_type') == 'negative'),
                'neutral_count': sum(1 for item in influences if item.get('impact_type') == 'neutral'),
            },
        })


class CycleSynchronizationView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_analysis'

    def get(self, request):
        target_date = request.query_params.get('date')
        try:
            parsed_date = date.fromisoformat(target_date) if target_date else None
        except ValueError:
            return Response({'error': 'date must use YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
        service = CycleSynchronizationService()
        result = service.synchronize_cycles(request.user, parsed_date)
        entity_id = request.query_params.get('entity_id')
        if entity_id:
            entity = get_object_or_404(EntityProfile, id=entity_id, user=request.user, is_active=True)
            start_date = parsed_date or timezone.now().date()
            result['optimal_dates'] = service.find_optimal_timing(
                request.user,
                entity,
                start_date,
                start_date + timedelta(days=60),
            )
        return Response(result)


class UniverseEventListCreateView(FeatureProtectedMixin, ListCreateAPIView):
    serializer_class = UniverseEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_events'

    def get_queryset(self):
        return UniverseEvent.objects.filter(user=self.request.user).prefetch_related('related_entities').order_by('-event_date')

    def perform_create(self, serializer):
        event_date = serializer.validated_data['event_date']
        serializer.save(
            user=self.request.user,
            numerology_insight=calculate_event_insight(self.request.user, event_date),
        )


class UniverseEventDetailView(FeatureProtectedMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = UniverseEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_events'

    def get_queryset(self):
        return UniverseEvent.objects.filter(user=self.request.user).prefetch_related('related_entities')

    def perform_update(self, serializer):
        event_date = serializer.validated_data.get('event_date', serializer.instance.event_date)
        serializer.save(numerology_insight=calculate_event_insight(self.request.user, event_date))


def asset_calculation_values(user, asset_type, asset_number):
    calculator = NumerologyCalculator()
    asset_total = calculator._sum_name(asset_number) + sum(int(char) for char in asset_number if char.isdigit())
    vibration = calculator._reduce_to_single_digit(asset_total, preserve_master=True)
    owner_profile = getattr(user, 'numerology_profile', None)
    owner_number = getattr(owner_profile, 'life_path_number', vibration)
    compatibility = max(0, 100 - abs(owner_number - vibration) * 12)
    return {
        'numerology_vibration': vibration,
        'compatibility_with_owner': compatibility,
        'safety_score': compatibility if asset_type == 'vehicle' else None,
    }


class AssetProfileListCreateView(FeatureProtectedMixin, ListCreateAPIView):
    serializer_class = AssetProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_assets'

    def get_queryset(self):
        return AssetProfile.objects.filter(entity__user=self.request.user, entity__is_active=True).select_related('entity')

    def perform_create(self, serializer):
        serializer.save(**asset_calculation_values(
            self.request.user,
            serializer.validated_data['asset_type'],
            serializer.validated_data['asset_number'],
        ))


class AssetProfileDetailView(FeatureProtectedMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = AssetProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_assets'

    def get_queryset(self):
        return AssetProfile.objects.filter(entity__user=self.request.user).select_related('entity')

    def perform_update(self, serializer):
        asset_type = serializer.validated_data.get('asset_type', serializer.instance.asset_type)
        asset_number = serializer.validated_data.get('asset_number', serializer.instance.asset_number)
        serializer.save(**asset_calculation_values(self.request.user, asset_type, asset_number))


class EntityRelationshipListCreateView(FeatureProtectedMixin, ListCreateAPIView):
    serializer_class = EntityRelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_analysis'

    def get_queryset(self):
        return EntityRelationship.objects.filter(
            Q(entity_1__user=self.request.user) | Q(entity_2__user=self.request.user)
        ).select_related('entity_1', 'entity_2')

    def perform_create(self, serializer):
        relationship, _ = CompatibilityEngine().get_or_create_relationship(
            serializer.validated_data['entity_1'],
            serializer.validated_data['entity_2'],
            force_recalculate=True,
        )
        serializer.instance = relationship


class EntityRelationshipDetailView(FeatureProtectedMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = EntityRelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_analysis'

    def get_queryset(self):
        return EntityRelationship.objects.filter(
            entity_1__user=self.request.user,
            entity_2__user=self.request.user,
        ).select_related('entity_1', 'entity_2')


class UniverseReportView(FeatureProtectedMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]
    feature_name = 'meus_reports'

    def get(self, request):
        entities = EntityProfile.objects.filter(user=request.user, is_active=True)
        return Response({
            'generated_at': timezone.now().isoformat(),
            'entities': EntityProfileSerializer(entities, many=True, context={'request': request}).data,
            'relationships': EntityRelationshipSerializer(
                EntityRelationship.objects.filter(entity_1__user=request.user).select_related('entity_1', 'entity_2'),
                many=True,
            ).data,
            'events': UniverseEventSerializer(
                UniverseEvent.objects.filter(user=request.user).prefetch_related('related_entities'),
                many=True,
                context={'request': request},
            ).data,
            'recommendations': RecommendationEngine().generate_recommendations(request.user, limit=10),
        })
