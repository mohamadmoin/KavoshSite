from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import models
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from .models import UserProfile, ResearchProject, ResearchData, AIAnalysis, Comment
from .serializers import (
    UserProfileSerializer, ResearchProjectSerializer,
    ResearchDataSerializer, AIAnalysisSerializer, CommentSerializer
)

class IsOwnerOrCollaborator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS and obj.is_public:
            return True
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'project'):
            return (obj.project.owner == request.user or 
                   request.user in obj.project.collaborators.all())
        return False

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'institution', 'research_interests']

    def get_queryset(self):
        if self.action == 'list':
            return UserProfile.objects.filter(user=self.request.user)
        return UserProfile.objects.all()

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_public']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_queryset(self):
        user = self.request.user
        return ResearchProject.objects.filter(
            models.Q(owner=user) |
            models.Q(collaborators=user) |
            models.Q(is_public=True)
        ).distinct()

    @action(detail=True, methods=['post'])
    def add_collaborator(self, request, pk=None):
        project = self.get_object()
        if project.owner != request.user:
            return Response({'error': 'Only project owner can add collaborators'}, 
                          status=403)
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=400)
        try:
            user = User.objects.get(id=user_id)
            project.collaborators.add(user)
            return Response({'status': 'collaborator added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

class ResearchDataViewSet(viewsets.ModelViewSet):
    queryset = ResearchData.objects.all()
    serializer_class = ResearchDataSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['data_type', 'project']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        return ResearchData.objects.filter(
            models.Q(project__owner=user) |
            models.Q(project__collaborators=user) |
            models.Q(project__is_public=True)
        ).distinct()

class AIAnalysisViewSet(viewsets.ModelViewSet):
    queryset = AIAnalysis.objects.all()
    serializer_class = AIAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'analysis_type', 'project']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        return AIAnalysis.objects.filter(
            models.Q(project__owner=user) |
            models.Q(project__collaborators=user) |
            models.Q(project__is_public=True)
        ).distinct()

    @action(detail=True, methods=['post'])
    def retry_analysis(self, request, pk=None):
        analysis = self.get_object()
        if analysis.status != 'failed':
            return Response({'error': 'Only failed analyses can be retried'}, 
                          status=400)
        analysis.status = 'pending'
        analysis.error_message = ''
        analysis.save()
        # Here you would typically trigger your async analysis task
        return Response({'status': 'analysis queued'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']

    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(
            models.Q(project__owner=user) |
            models.Q(project__collaborators=user) |
            models.Q(project__is_public=True)
        ).distinct() 