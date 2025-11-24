"""
Unit tests for numerology API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from accounts.models import User, UserProfile
from numerology.models import NumerologyProfile, DailyReading, CompatibilityCheck, Remedy

# User = get_user_model()


class NumerologyAPIViewTests(TestCase):
    """Test cases for numerology API views."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create(
            email='test@example.com',
            full_name='Test User'
        )
        self.user.set_password('testpass123')
        self.user.is_verified = True
        self.user.save()
        
        # Create user profile
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            date_of_birth=date(1990, 5, 15)
        )
        
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
        
        self.client.force_authenticate(user=self.user)
    
    def test_get_daily_reading(self):
        """Test getting daily reading."""
        url = reverse('numerology:daily-reading')
        response = self.client.get(url)
        
        # Should return 200 OK or 201 CREATED depending on implementation
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
    
    def test_get_life_path_analysis(self):
        """Test getting life path analysis."""
        url = reverse('numerology:life-path-analysis')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_check_compatibility(self):
        """Test compatibility check."""
        url = reverse('numerology:compatibility-check')
        data = {
            'partner_name': 'Test Partner',
            'partner_birth_date': '1995-03-20',
            'relationship_type': 'romantic'
        }
        response = self.client.post(url, data)
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
    
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
        
        url = reverse('numerology:compatibility-history')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_personalized_remedies(self):
        """Test getting personalized remedies."""
        url = reverse('numerology:personalized-remedies')
        response = self.client.get(url)
        
        # Should return 200 OK or 201 CREATED depending on implementation
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])