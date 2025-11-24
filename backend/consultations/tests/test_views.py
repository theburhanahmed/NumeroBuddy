"""
Unit tests for consultations API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, datetime, timedelta
from accounts.models import User, UserProfile
from consultations.models import Expert, Consultation

# User = get_user_model()


class ConsultationsAPIViewTests(TestCase):
    """Test cases for consultations API views."""
    
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
        
        # Create test expert
        self.expert = Expert.objects.create(
            name='Test Expert',
            email='expert@example.com',
            specialty='general',
            experience_years=5,
            bio='Test expert bio'
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_list_experts(self):
        """Test listing experts."""
        url = reverse('consultations:experts-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_book_consultation(self):
        """Test booking a consultation."""
        url = reverse('consultations:consultations-list')
        future_date = datetime.now() + timedelta(days=7)
        data = {
            'expert': str(self.expert.id),
            'scheduled_time': future_date.isoformat(),
            'notes': 'Test consultation notes'
        }
        response = self.client.post(url, data)
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
    
    def test_get_consultation_history(self):
        """Test getting consultation history."""
        # Create a consultation
        Consultation.objects.create(
            user=self.user,
            expert=self.expert,
            scheduled_time=datetime.now() + timedelta(days=1),
            status='scheduled'
        )
        
        url = reverse('consultations:consultations-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)