from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
import logging

# Set up logger
logger = logging.getLogger(__name__)

from .models import BlogPost, Category, Tag
from .serializers import (
    BlogPostListSerializer,
    BlogPostDetailSerializer,
    BlogPostCreateUpdateSerializer,
    CategorySerializer,
    TagSerializer
)

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        category = self.get_object()
        posts = category.posts.filter(status='published', published_at__lte=timezone.now())
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        tag = self.get_object()
        posts = tag.posts.filter(status='published', published_at__lte=timezone.now())
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)

class BlogPostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'meta_title', 'meta_description']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at']
    lookup_field = 'slug'
    
    def list(self, request, *args, **kwargs):
        logger.info(f"Received list request from: {request.META.get('REMOTE_ADDR')} - {request.META.get('HTTP_USER_AGENT')}")
        logger.info(f"Request headers: {request.headers}")
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        logger.info(f"Received retrieve request for slug: {kwargs.get('slug')} from: {request.META.get('REMOTE_ADDR')}")
        return super().retrieve(request, *args, **kwargs)
    
    def get_queryset(self):
        # For unauthorized users, show only published posts
        if not self.request.user.is_authenticated:
            return BlogPost.objects.filter(
                status='published',
                published_at__lte=timezone.now()
            )
        
        # For authenticated users (admin), show all posts
        if self.request.user.is_staff:
            return BlogPost.objects.all()
            
        # For regular authenticated users, show their own drafts plus published posts
        return BlogPost.objects.filter(
            Q(author=self.request.user) | 
            Q(status='published', published_at__lte=timezone.now())
        )
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateUpdateSerializer
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False)
    def featured(self, request):
        featured_posts = BlogPost.objects.filter(
            is_featured=True,
            status='published',
            published_at__lte=timezone.now()
        )
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False)
    def recent(self, request):
        recent_posts = BlogPost.objects.filter(
            status='published',
            published_at__lte=timezone.now()
        ).order_by('-published_at')[:5]
        serializer = BlogPostListSerializer(recent_posts, many=True)
        return Response(serializer.data)
