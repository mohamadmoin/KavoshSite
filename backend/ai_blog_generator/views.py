import logging
import traceback
from concurrent.futures import ThreadPoolExecutor
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

from blog.models import BlogPost

from .models import AIBlogRequest, AIBlogGeneration, AIBlogBatchRequest
from .serializers import (
    AIBlogRequestSerializer,
    AIBlogGenerationSerializer,
    AIBlogRequestListSerializer,
    AIBlogBatchRequestSerializer,
    AIBlogBatchRequestDetailSerializer
)
from .ai_service import ai_service

# Set up logger
logger = logging.getLogger(__name__)

# Thread pool for running background tasks
thread_pool = ThreadPoolExecutor(max_workers=5)

# Add CORS middleware for preflight requests
@method_decorator(csrf_exempt, name='dispatch')
class AIBlogRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AI blog post requests.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return requests for the current user.
        """
        # Debug authentication information
        logger.debug(f"Request user: {self.request.user}, authenticated: {self.request.user.is_authenticated}")
        logger.debug(f"Request auth: {self.request.auth}")
        
        # Debug auth header
        auth_header = self.request.META.get('HTTP_AUTHORIZATION', '')
        logger.debug(f"Auth header: {auth_header}")
        
        return AIBlogRequest.objects.filter(user=self.request.user).order_by('-created_at')
    
    def options(self, request, *args, **kwargs):
        """
        Handle OPTIONS requests for CORS.
        """
        response = HttpResponse()
        response['Allow'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response
    
    @action(detail=False, methods=['get'])
    def auth_test(self, request):
        """
        Test authentication.
        """
        # Get the token from the request
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_key = None
        
        if auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
        
        # Try to get the token from the database
        token = None
        if token_key:
            try:
                token = Token.objects.get(key=token_key)
            except Token.DoesNotExist:
                pass
        
        # Get the user from the token
        user = None
        if token:
            user = token.user
        
        # Return the authentication information
        return Response({
            'authenticated': request.user.is_authenticated,
            'user': request.user.username if request.user.is_authenticated else None,
            'token_key': token_key,
            'token_exists': token is not None,
            'token_user': user.username if user else None,
            'request_user': request.user.username if request.user.is_authenticated else None,
            'auth_header': auth_header,
        })
    
    def get_serializer_class(self):
        """
        Return the appropriate serializer class.
        """
        if self.action == 'list':
            return AIBlogRequestListSerializer
        return AIBlogRequestSerializer
    
    def perform_create(self, serializer):
        """
        Set the user when creating a request.
        """
        request = serializer.save(user=self.request.user)
        
        # Skip blog generation in test environment
        if not self._is_test_environment():
            # Start the blog generation process in a background thread
            def run_background_task():
                try:
                    ai_service.generate_blog_post(request.id)
                except Exception as e:
                    logger.error(f"Error in background task: {e}")
                    logger.error(traceback.format_exc())
            
            thread_pool.submit(run_background_task)
    
    def _is_test_environment(self):
        """
        Check if we're running in a test environment.
        """
        return getattr(settings, 'TESTING', False)
    
    @action(detail=True, methods=['get'])
    def generation(self, request, pk=None):
        """
        Get the generated blog post for a request.
        """
        try:
            # Get the request
            blog_request = self.get_object()
            
            # Check if the generation exists
            try:
                generation = blog_request.generation
                serializer = AIBlogGenerationSerializer(generation)
                return Response(serializer.data)
            except AIBlogGeneration.DoesNotExist:
                return Response({'error': 'Generation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting generation: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        """
        Regenerate a blog post.
        """
        try:
            # Get the request
            blog_request = self.get_object()
            
            # Check if the request is already completed
            if blog_request.status == 'completed':
                # Delete the existing generation
                try:
                    generation = blog_request.generation
                    
                    # Delete the blog post if it exists
                    if generation.blog_post:
                        generation.blog_post.delete()
                    
                    # Delete the generation
                    generation.delete()
                except AIBlogGeneration.DoesNotExist:
                    pass
            
            # Reset the request status
            blog_request.status = 'pending'
            blog_request.error_message = None
            blog_request.save()
            
            # Skip blog generation in test environment
            if not self._is_test_environment():
                # Start the blog generation process in a background thread
                def run_background_task():
                    try:
                        ai_service.generate_blog_post(blog_request.id)
                    except Exception as e:
                        logger.error(f"Error in background task: {e}")
                        logger.error(traceback.format_exc())
                
                thread_pool.submit(run_background_task)
            
            return Response({'status': 'regenerating'})
        except Exception as e:
            logger.error(f"Error regenerating blog post: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIBlogGenerationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing AI-generated blog posts.
    """
    serializer_class = AIBlogGenerationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return generations for the current user.
        """
        return AIBlogGeneration.objects.filter(request__user=self.request.user).order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """
        Publish a generated blog post.
        """
        try:
            # Get the generation
            generation = self.get_object()
            
            # Check if a blog post already exists
            if not generation.blog_post:
                # Create a new blog post
                blog_post = BlogPost.objects.create(
                    title=generation.title,
                    content=generation.content,
                    excerpt=generation.excerpt,
                    author=generation.request.user,
                    status='draft',
                    meta_title=generation.meta_title,
                    meta_description=generation.meta_description,
                    focus_keywords=generation.focus_keywords,
                    content_format='html'
                )
                
                # Add categories and tags
                for category in generation.suggested_categories.all():
                    blog_post.categories.add(category)
                
                for tag in generation.suggested_tags.all():
                    blog_post.tags.add(tag)
                
                # Update the generation with the blog post
                generation.blog_post = blog_post
                generation.save()
            
            # Publish the blog post
            blog_post = generation.blog_post
            blog_post.status = 'published'
            blog_post.save()
            
            return Response({'status': 'published', 'blog_post_id': blog_post.id})
        except Exception as e:
            logger.error(f"Error publishing blog post: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIBlogBatchRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing batch AI blog post requests.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return batch requests for the current user.
        """
        return AIBlogBatchRequest.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        """
        Return the appropriate serializer class.
        """
        if self.action == 'retrieve':
            return AIBlogBatchRequestDetailSerializer
        return AIBlogBatchRequestSerializer
    
    def perform_create(self, serializer):
        """
        Set the user when creating a batch request.
        """
        batch_request = serializer.save(user=self.request.user)
        
        # Skip blog generation in test environment
        if not self._is_test_environment():
            # Start the batch blog generation process in a background thread
            def run_background_task():
                try:
                    ai_service.generate_batch_blog_posts(batch_request.id)
                except Exception as e:
                    logger.error(f"Error in batch background task: {e}")
                    logger.error(traceback.format_exc())
            
            thread_pool.submit(run_background_task)
    
    def _is_test_environment(self):
        """
        Check if we're running in a test environment.
        """
        return getattr(settings, 'TESTING', False)
    
    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        """
        Regenerate a batch of blog posts.
        """
        try:
            # Get the batch request
            batch_request = self.get_object()
            
            # Delete the existing child requests and their generations
            for child_request in batch_request.child_requests.all():
                try:
                    # Delete the blog post if it exists
                    if hasattr(child_request, 'generation') and child_request.generation.blog_post:
                        child_request.generation.blog_post.delete()
                    
                    # Delete the generation
                    if hasattr(child_request, 'generation'):
                        child_request.generation.delete()
                    
                    # Delete the child request
                    child_request.delete()
                except Exception as e:
                    logger.error(f"Error deleting child request: {e}")
            
            # Reset the batch request status
            batch_request.status = 'pending'
            batch_request.error_message = None
            batch_request.save()
            
            # Skip blog generation in test environment
            if not self._is_test_environment():
                # Start the batch blog generation process in a background thread
                def run_background_task():
                    try:
                        ai_service.generate_batch_blog_posts(batch_request.id)
                    except Exception as e:
                        logger.error(f"Error in batch background task: {e}")
                        logger.error(traceback.format_exc())
                
                thread_pool.submit(run_background_task)
            
            return Response({'status': 'regenerating'})
        except Exception as e:
            logger.error(f"Error regenerating batch blog posts: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
