from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CategoryViewSet, TagViewSet

router = DefaultRouter()
router.register('posts', BlogPostViewSet, basename='blog-post')
router.register('categories', CategoryViewSet, basename='blog-category')
router.register('tags', TagViewSet, basename='blog-tag')

urlpatterns = router.urls 