"""
Unit tests for AI chat API views.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from accounts.models import User, UserProfile
from ai_chat.models import AIConversation

# User = get_user_model()


class AIChatAPIViewTests(TestCase):
    """Test cases for AI chat API views."""
    
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
        
        self.client.force_authenticate(user=self.user)
    
    def test_create_conversation(self):
        """Test creating a new conversation."""
        url = reverse('ai_chat:conversations-list')
        data = {
            'topic': 'Test Conversation'
        }
        response = self.client.post(url, data)
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
    
    def test_list_conversations(self):
        """Test listing conversations."""
        # Create a conversation
        AIConversation.objects.create(
            user=self.user,
            topic='Test Conversation'
        )
        
        url = reverse('ai_chat:conversations-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_send_message(self):
        """Test sending a message."""
        # Create a conversation first
        conversation = AIConversation.objects.create(
            user=self.user,
            topic='Test Conversation'
        )
        
        url = reverse('ai_chat:messages-list')
        data = {
            'conversation': str(conversation.id),
            'content': 'Hello, AI!',
            'role': 'user'
        }
        response = self.client.post(url, data)
        
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])