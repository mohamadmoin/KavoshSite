"""
URL configuration for cmsbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from blog.views import BlogPostViewSet, CategoryViewSet, TagViewSet
from admin_panel.views import SiteSettingsViewSet, SEOSettingsViewSet
from .views import CustomObtainAuthToken, RegenerateAuthToken

# Set up the API router
router = DefaultRouter()
router.register('posts', BlogPostViewSet, basename='post')
router.register('categories', CategoryViewSet, basename='category')
router.register('tags', TagViewSet, basename='tag')
router.register('site-settings', SiteSettingsViewSet, basename='site-settings')
router.register('seo-settings', SEOSettingsViewSet, basename='seo-settings')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/ai-blog/', include('ai_blog_generator.urls')),
    path('api/auth-token/', CustomObtainAuthToken.as_view(), name='api_token_auth'),  # Use class-based token view
    path('api/auth/token/regenerate/', RegenerateAuthToken.as_view(), name='regenerate_token'),
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
