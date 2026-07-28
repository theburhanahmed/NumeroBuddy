from datetime import date, timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from accounts.models import User, UserProfile
from meus.models import AssetProfile, CrossProfileAnalysisCache, EntityProfile, EntityRelationship
from numerology.models import NumerologyProfile
from payments.models import Subscription


class MEUSAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='meus@example.com',
            full_name='Universe Owner',
            password='testpass123',
            is_verified=True,
        )
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        profile.date_of_birth = date(1990, 5, 15)
        profile.save(update_fields=['date_of_birth'])
        self.owner_profile = NumerologyProfile.objects.get(user=self.user)
        self.owner_profile.life_path_number = 3
        self.owner_profile.destiny_number = 8
        self.owner_profile.soul_urge_number = 6
        self.owner_profile.personality_number = 2
        self.owner_profile.attitude_number = 2
        self.owner_profile.maturity_number = 11
        self.owner_profile.balance_number = 3
        self.owner_profile.personal_year_number = 5
        self.owner_profile.personal_month_number = 7
        self.owner_profile.save()
        self.client.force_authenticate(self.user)

    def subscribe(self, plan='premium'):
        return Subscription.objects.create(
            user=self.user,
            plan=plan,
            status='active',
            current_period_end=timezone.now() + timedelta(days=30),
        )

    def create_person(self, name, birth_date):
        return self.client.post('/api/v1/entity/', {
            'entity_type': 'person',
            'name': name,
            'date_of_birth': birth_date,
            'relationship_type': 'friend',
        }, format='json')

    def test_free_user_cannot_access_entities(self):
        response = self.client.get('/api/v1/entity/')
        self.assertEqual(response.status_code, 403)

    def test_person_creation_calculates_independent_profile(self):
        self.subscribe()
        response = self.create_person('Jane Example', '1992-08-21')

        self.assertEqual(response.status_code, 201)
        entity = EntityProfile.objects.get(id=response.data['id'])
        self.assertTrue(entity.numerology_data['life_path_number'])
        self.assertEqual(entity.numerology_data['destiny_number'], response.data['numerology_data']['destiny_number'])
        self.owner_profile.refresh_from_db()
        self.assertEqual(self.owner_profile.life_path_number, 3)
        self.assertEqual(self.owner_profile.destiny_number, 8)

    def test_person_requires_birth_date(self):
        self.subscribe()
        response = self.client.post('/api/v1/entity/', {
            'entity_type': 'person',
            'name': 'Missing Birthday',
        }, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('date_of_birth', response.data['error']['details'])

    def test_asset_profile_is_calculated_and_owner_scoped(self):
        self.subscribe()
        entity = EntityProfile.objects.create(user=self.user, entity_type='asset', name='My Vehicle')

        response = self.client.post('/api/v1/universe/assets/', {
            'entity': str(entity.id),
            'asset_type': 'vehicle',
            'asset_number': 'ABC-1234',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        asset = AssetProfile.objects.get(entity=entity)
        self.assertGreater(asset.numerology_vibration, 0)
        self.assertIsNotNone(asset.safety_score)
        self.assertIsNotNone(asset.compatibility_with_owner)

    def test_cross_entity_analysis_persists_relationship_and_cache(self):
        self.subscribe()
        first = self.create_person('First Person', '1988-01-10').data
        second = self.create_person('Second Person', '1991-03-12').data
        payload = {'entity_ids': [first['id'], second['id']], 'analysis_type': 'full'}

        response = self.client.post('/api/v1/analysis/cross-entity/', payload, format='json')
        cached_response = self.client.post('/api/v1/analysis/cross-entity/', payload, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['compatibility_matrix']), 1)
        self.assertEqual(EntityRelationship.objects.count(), 1)
        self.assertEqual(CrossProfileAnalysisCache.objects.count(), 1)
        self.assertTrue(cached_response.data['cached'])

    def test_event_creation_calculates_insight_and_restricts_related_entities(self):
        self.subscribe()
        entity = EntityProfile.objects.create(user=self.user, entity_type='asset', name='Home')
        response = self.client.post('/api/v1/universe/events/', {
            'event_type': 'purchase',
            'event_date': '2026-10-10',
            'title': 'Property Purchase',
            'related_entities': [str(entity.id)],
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertIn('alignment_score', response.data['numerology_insight'])
        self.assertEqual(response.data['related_entity_names'], ['Home'])

        other = User.objects.create_user(email='other@example.com', full_name='Other', password='testpass123')
        foreign_entity = EntityProfile.objects.create(user=other, entity_type='asset', name='Foreign Asset')
        denied = self.client.post('/api/v1/universe/events/', {
            'event_type': 'purchase',
            'event_date': '2026-11-11',
            'title': 'Invalid Event',
            'related_entities': [str(foreign_entity.id)],
        }, format='json')
        self.assertEqual(denied.status_code, 400)

    def test_dashboard_and_influence_map_return_graph_data(self):
        self.subscribe()
        self.create_person('First Person', '1988-01-10')
        self.create_person('Second Person', '1991-03-12')
        entities = list(EntityProfile.objects.filter(user=self.user))
        self.client.post('/api/v1/analysis/cross-entity/', {
            'entity_ids': [str(entity.id) for entity in entities],
            'analysis_type': 'full',
        }, format='json')

        dashboard = self.client.get('/api/v1/universe/dashboard/')
        influence = self.client.get('/api/v1/universe/influence-map/')
        cycles = self.client.get(f'/api/v1/universe/cycles/?entity_id={entities[0].id}')

        self.assertEqual(dashboard.status_code, 200)
        self.assertEqual(dashboard.data['summary']['total_entities'], 2)
        self.assertEqual(len(dashboard.data['network_graph']['edges']), 2)
        self.assertEqual(influence.status_code, 200)
        self.assertEqual(len(influence.data['nodes']), 3)
        self.assertEqual(cycles.status_code, 200)
        self.assertTrue(cycles.data['synchronized'])
        self.assertIn('optimal_dates', cycles.data)

    def test_elite_recommendations_and_report(self):
        self.subscribe('elite')
        self.create_person('Important Person', '1988-01-10')

        recommendations = self.client.get('/api/v1/recommendations/next-actions/')
        report = self.client.get('/api/v1/universe/report/')

        self.assertEqual(recommendations.status_code, 200)
        self.assertIn('recommendations', recommendations.data)
        self.assertEqual(report.status_code, 200)
        self.assertEqual(len(report.data['entities']), 1)
