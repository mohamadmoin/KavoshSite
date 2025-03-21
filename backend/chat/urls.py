from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, ChatMessageViewSet

router = DefaultRouter()
router.register('sessions', ChatSessionViewSet, basename='chat-session')
router.register('messages', ChatMessageViewSet, basename='chat-message')

urlpatterns = router.urls 