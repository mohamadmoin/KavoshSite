from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AIBlogRequestViewSet, AIBlogGenerationViewSet, AIBlogBatchRequestViewSet

router = DefaultRouter()
router.register('requests', AIBlogRequestViewSet, basename='ai-blog-request')
router.register('generations', AIBlogGenerationViewSet, basename='ai-blog-generation')
router.register('batch-requests', AIBlogBatchRequestViewSet, basename='ai-blog-batch-request')

urlpatterns = [
    path('', include(router.urls)),
] 