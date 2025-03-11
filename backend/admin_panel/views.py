from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SiteSettings, SEOSettings
from .serializers import SiteSettingsSerializer, SEOSettingsSerializer

# Create your views here.

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # For all users, we only want to retrieve settings, not list them all
        return SiteSettings.objects.all()[:1]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        settings = SiteSettings.objects.first()
        if not settings:
            # Create default settings if none exist
            settings = SiteSettings.objects.create(site_name="My Website")
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.IsAdminUser])
    def update_settings(self, request):
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create(site_name="My Website")
        
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class SEOSettingsViewSet(viewsets.ModelViewSet):
    queryset = SEOSettings.objects.all()
    serializer_class = SEOSettingsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        # For all users, we only want to retrieve settings, not list them all
        return SEOSettings.objects.all()[:1]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        settings = SEOSettings.objects.first()
        if not settings:
            # Create default settings if none exist
            settings = SEOSettings.objects.create(
                default_meta_title="My Website",
                default_meta_description="Welcome to my website"
            )
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.IsAdminUser])
    def update_settings(self, request):
        settings = SEOSettings.objects.first()
        if not settings:
            settings = SEOSettings.objects.create(
                default_meta_title="My Website",
                default_meta_description="Welcome to my website"
            )
        
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
