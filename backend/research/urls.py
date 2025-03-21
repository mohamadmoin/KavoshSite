from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet)
router.register(r'projects', views.ResearchProjectViewSet)
router.register(r'data', views.ResearchDataViewSet)
router.register(r'analyses', views.AIAnalysisViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 