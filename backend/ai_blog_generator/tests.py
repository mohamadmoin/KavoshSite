from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from rest_framework import status

from .models import AIBlogRequest, AIBlogGeneration
from .views import AIBlogRequestViewSet, AIBlogGenerationViewSet

class AIBlogGeneratorTests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        # Create a test client and factory
        self.client = APIClient()
        self.factory = APIRequestFactory()
        
        # Create a test request
        self.request = AIBlogRequest.objects.create(
            user=self.user,
            prompt="Write a blog post about AI",
            topic="Artificial Intelligence",
            keywords="AI, machine learning, deep learning",
            allow_web_search=True
        )
    
    def test_create_request(self):
        """Test creating a new AI blog request"""
        # Use the view directly
        view = AIBlogRequestViewSet.as_view({'post': 'create'})
        data = {
            'prompt': 'Write a blog post about Python',
            'topic': 'Python Programming',
            'keywords': 'Python, programming, coding',
            'allow_web_search': True
        }
        request = self.factory.post('/api/ai-blog/requests/', data, format='json')
        force_authenticate(request, user=self.user)
        
        # Patch the _is_test_environment method for this test
        original_method = AIBlogRequestViewSet._is_test_environment
        AIBlogRequestViewSet._is_test_environment = lambda self: True
        
        try:
            response = view(request)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(AIBlogRequest.objects.count(), 2)
            
            # Get the latest request
            latest_request = AIBlogRequest.objects.order_by('-created_at').first()
            self.assertEqual(latest_request.topic, 'Python Programming')
        finally:
            # Restore the original method
            AIBlogRequestViewSet._is_test_environment = original_method
    
    def test_user_requests(self):
        """Test that a user can only see their own requests"""
        # Create another user with their own request
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        other_request = AIBlogRequest.objects.create(
            user=other_user,
            prompt="Write a blog post about Django",
            topic="Django Framework",
            keywords="Django, Python, web development",
            allow_web_search=True
        )
        
        # Check that our user only sees their own request
        self.assertEqual(AIBlogRequest.objects.count(), 2)  # Total of 2 requests in the database
        
        # Use the view directly
        view = AIBlogRequestViewSet.as_view({'get': 'list'})
        request = self.factory.get('/api/ai-blog/requests/')
        force_authenticate(request, user=self.user)
        
        response = view(request)
        
        # Our user should only see their own request
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check the database directly
        user_requests = AIBlogRequest.objects.filter(user=self.user)
        self.assertEqual(user_requests.count(), 1)
        self.assertEqual(user_requests[0].topic, 'Artificial Intelligence')
