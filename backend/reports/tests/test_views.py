"""
Unit tests for reports API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from accounts.models import User, UserProfile
from reports.models import ReportTemplate, GeneratedReport
from numerology.models import NumerologyProfile

# User = get_user_model()


class ReportsAPIViewTests(TestCase):
    """Test cases for reports API views."""
    
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
        
        # Create test report template
        self.report_template = ReportTemplate.objects.create(
            name='Basic Birth Chart',
            description='A basic numerology birth chart report',
            report_type='basic',
            is_premium=False,
            is_active=True
        )
        
        self.client.force_authenticate(user=self.user)
    
    def test_list_report_templates(self):
        """Test listing report templates."""
        url = reverse('reports:report-templates-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_generate_report(self):
        """Test generating a report."""
        url = reverse('reports:generated-reports-list')
        data = {
            'template': str(self.report_template.id),
            'title': 'Test Report'
        }
        response = self.client.post(url, data)
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
    
    def test_get_report_history(self):
        """Test getting report history."""
        # Create a generated report
        GeneratedReport.objects.create(
            user=self.user,
            template=self.report_template,
            title='Test Report',
            content='Test report content'
        )
        
        url = reverse('reports:generated-reports-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)