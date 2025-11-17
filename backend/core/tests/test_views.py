"""
Unit tests for new API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, datetime
from core.models import (
    NumerologyProfile, CompatibilityCheck, Remedy, Expert, Consultation
)

User = get_user_model()


class NewAPIViewTests(TestCase):
    """Test cases for new API views."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User'
        )
        self.user.is_verified = True
        self.user.save()
        
        # Create user profile with birth date
        self.user.profile.date_of_birth = date(1990, 5, 15)
        self.user.profile.save()
        
        # Create numerology profile
        self.numerology_profile = NumerologyProfile.objects.create(
            user=self.user,
            life_path_number=1,
            destiny_number=2,
            soul_urge_number=3,
            personality_number=4,
            attitude_number=5,
            maturity_number=6,
            balance_number=7,
            personal_year_number=8,
            personal_month_number=9
        )
        
        # Create test expert
        self.expert = Expert.objects.create(
            name='Test Expert',
            email='expert@example.com',
            specialty='general',
            experience_years=5,
            bio='Test expert bio'
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_get_life_path_analysis(self):
        """Test getting life path analysis."""
        url = reverse('core:life-path-analysis')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('number', response.data)
        self.assertIn('title', response.data)
        self.assertIn('description', response.data)
    
    def test_get_life_path_analysis_without_profile(self):
        """Test getting life path analysis without numerology profile."""
        # Delete numerology profile
        self.numerology_profile.delete()
        
        url = reverse('core:life-path-analysis')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_check_compatibility(self):
        """Test compatibility check."""
        url = reverse('core:compatibility-check')
        data = {
            'partner_name': 'Test Partner',
            'partner_birth_date': '1995-03-20',
            'relationship_type': 'romantic'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertIn('compatibility_score', response.data)
        self.assertEqual(response.data['partner_name'], 'Test Partner')
    
    def test_check_compatibility_invalid_data(self):
        """Test compatibility check with invalid data."""
        url = reverse('core:compatibility-check')
        data = {
            'partner_name': '',  # Missing required field
            'partner_birth_date': 'invalid-date'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_compatibility_history(self):
        """Test getting compatibility check history."""
        # Create a compatibility check
        CompatibilityCheck.objects.create(
            user=self.user,
            partner_name='Test Partner',
            partner_birth_date=date(1995, 3, 20),
            relationship_type='romantic',
            compatibility_score=85,
            strengths=['Good communication'],
            challenges=['Different approaches'],
            advice='Focus on understanding each other'
        )
        
        url = reverse('core:compatibility-history')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
    
    def test_get_personalized_remedies(self):
        """Test getting personalized remedies."""
        url = reverse('core:personalized-remedies')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(response.data, list)
        self.assertGreater(len(response.data), 0)
    
    def test_get_personalized_remedies_existing(self):
        """Test getting existing personalized remedies."""
        # Create a remedy
        Remedy.objects.create(
            user=self.user,
            remedy_type='gemstone',
            title='Test Remedy',
            description='Test description',
            recommendation='Test recommendation'
        )
        
        url = reverse('core:personalized-remedies')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
    
    def test_track_remedy(self):
        """Test tracking remedy practice."""
        # Create a remedy
        remedy = Remedy.objects.create(
            user=self.user,
            remedy_type='gemstone',
            title='Test Remedy',
            description='Test description',
            recommendation='Test recommendation'
        )
        
        url = reverse('core:track-remedy', kwargs={'remedy_id': remedy.id})
        data = {
            'date': '2025-11-17',
            'is_completed': True,
            'notes': 'Test notes'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertTrue(response.data['is_completed'])
    
    def test_get_experts(self):
        """Test getting list of experts."""
        url = reverse('core:experts')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Expert')
    
    def test_get_expert(self):
        """Test getting specific expert details."""
        url = reverse('core:expert-detail', kwargs={'expert_id': self.expert.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertEqual(response.data['name'], 'Test Expert')
    
    def test_get_expert_not_found(self):
        """Test getting non-existent expert."""
        url = reverse('core:expert-detail', kwargs={'expert_id': '00000000-0000-0000-0000-000000000000'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_book_consultation(self):
        """Test booking a consultation."""
        url = reverse('core:book-consultation')
        data = {
            'expert': str(self.expert.id),
            'consultation_type': 'video',
            'scheduled_at': '2025-11-20T10:00:00',
            'duration_minutes': 30,
            'notes': 'Test consultation'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['status'], 'pending')
    
    def test_book_consultation_invalid_data(self):
        """Test booking a consultation with invalid data."""
        url = reverse('core:book-consultation')
        data = {
            'expert': '',  # Missing required field
            'consultation_type': 'video',
            'scheduled_at': 'invalid-date'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_upcoming_consultations(self):
        """Test getting upcoming consultations."""
        # Create a consultation
        Consultation.objects.create(
            user=self.user,
            expert=self.expert,
            consultation_type='video',
            scheduled_at=datetime(2025, 11, 20, 10, 0, 0),
            status='confirmed'
        )
        
        url = reverse('core:upcoming-consultations')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
    
    def test_get_past_consultations(self):
        """Test getting past consultations."""
        # Create a past consultation
        Consultation.objects.create(
            user=self.user,
            expert=self.expert,
            consultation_type='video',
            scheduled_at=datetime(2020, 11, 20, 10, 0, 0),
            status='completed'
        )
        
        url = reverse('core:past-consultations')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
    
    def test_get_full_numerology_report(self):
        """Test getting full numerology report."""
        url = reverse('core:full-numerology-report')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('full_name', response.data)
        self.assertIn('life_path_number', response.data)
        self.assertIn('destiny_number', response.data)