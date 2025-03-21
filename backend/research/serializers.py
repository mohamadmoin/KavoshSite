from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, ResearchProject, ResearchData, AIAnalysis, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'institution', 'position', 'research_interests', 
                 'website', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ResearchProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    collaborators = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = ResearchProject
        fields = ['id', 'title', 'slug', 'description', 'owner', 'collaborators', 
                 'status', 'is_public', 'start_date', 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class ResearchDataSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ResearchData
        fields = ['id', 'project', 'title', 'description', 'data_type', 'file', 
                 'uploaded_by', 'version', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)

class AIAnalysisSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AIAnalysis
        fields = ['id', 'project', 'data', 'title', 'description', 'analysis_type', 
                 'parameters', 'results', 'status', 'error_message', 'requested_by', 
                 'created_at', 'updated_at']
        read_only_fields = ['results', 'status', 'error_message', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'project', 'author', 'content', 'parent', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data) 