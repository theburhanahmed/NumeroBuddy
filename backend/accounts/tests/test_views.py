"""
Unit tests for accounts API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from accounts.models import User, UserProfile

# User = get_user_model()


class AccountsAPIViewTests(TestCase):
    """Test cases for accounts API views."""
    
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
            date_of_birth=date(1990, 5, 15),
            gender='male',
            timezone='Asia/Kolkata',
            location='Mumbai, India',
            bio='Test bio'
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_user_profile_retrieval(self):
        """Test retrieving user profile."""
        url = reverse('accounts:user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response.data)
        self.assertIn('full_name', response.data)
        self.assertIn('date_of_birth', response.data)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['full_name'], self.user.full_name)
    
    def test_user_profile_update_bio(self):
        """Test updating user profile bio."""
        url = reverse('accounts:user-profile')
        data = {
            'bio': 'Updated bio'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify database persistence
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.bio, 'Updated bio')
    
    def test_user_profile_update_full_name(self):
        """Test updating user full_name through profile endpoint."""
        url = reverse('accounts:user-profile')
        data = {
            'full_name': 'Updated Full Name'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'Updated Full Name')
        
        # Verify database persistence on User model
        self.user.refresh_from_db()
        self.assertEqual(self.user.full_name, 'Updated Full Name')
    
    def test_user_profile_update_all_fields(self):
        """Test updating all profile fields including full_name."""
        url = reverse('accounts:user-profile')
        data = {
            'full_name': 'John Doe',
            'date_of_birth': '1985-03-20',
            'gender': 'female',
            'timezone': 'America/New_York',
            'location': 'New York, USA',
            'bio': 'My updated bio'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify User model update
        self.user.refresh_from_db()
        self.assertEqual(self.user.full_name, 'John Doe')
        
        # Verify UserProfile model updates
        self.user_profile.refresh_from_db()
        self.assertEqual(str(self.user_profile.date_of_birth), '1985-03-20')
        self.assertEqual(self.user_profile.gender, 'female')
        self.assertEqual(self.user_profile.timezone, 'America/New_York')
        self.assertEqual(self.user_profile.location, 'New York, USA')
        self.assertEqual(self.user_profile.bio, 'My updated bio')
    
    def test_user_profile_partial_update(self):
        """Test partial update (PATCH) of profile fields."""
        url = reverse('accounts:user-profile')
        data = {
            'timezone': 'Europe/London'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify only timezone was updated
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user_profile.timezone, 'Europe/London')
        
        # Verify other fields remain unchanged
        self.assertEqual(self.user_profile.gender, 'male')
        self.assertEqual(self.user_profile.location, 'Mumbai, India')
    
    def test_user_profile_update_invalid_gender(self):
        """Test validation error for invalid gender value."""
        url = reverse('accounts:user-profile')
        data = {
            'gender': 'invalid_gender'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('field_errors', response.data or {})
    
    def test_user_profile_update_empty_full_name(self):
        """Test that empty full_name is rejected."""
        url = reverse('accounts:user-profile')
        data = {
            'full_name': ''
        }
        response = self.client.patch(url, data, format='json')
        
        # Should return validation error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_profile_requires_authentication(self):
        """Test that profile endpoint requires authentication."""
        self.client.force_authenticate(user=None)
        url = reverse('accounts:user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_user_profile_concurrent_updates(self):
        """Test concurrent updates - last write wins."""
        url = reverse('accounts:user-profile')
        
        # First update
        data1 = {'full_name': 'First Update'}
        response1 = self.client.patch(url, data1, format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        
        # Second update (simulating concurrent update)
        data2 = {'full_name': 'Second Update', 'bio': 'Concurrent bio'}
        response2 = self.client.patch(url, data2, format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        # Verify last write wins
        self.user.refresh_from_db()
        self.user_profile.refresh_from_db()
        self.assertEqual(self.user.full_name, 'Second Update')
        self.assertEqual(self.user_profile.bio, 'Concurrent bio')
    
    def test_user_profile_date_of_birth_validation(self):
        """Test date_of_birth field validation."""
        url = reverse('accounts:user-profile')
        
        # Valid date
        data = {'date_of_birth': '1990-01-01'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Invalid date format
        data = {'date_of_birth': 'invalid-date'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)