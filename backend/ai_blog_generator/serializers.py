from rest_framework import serializers
from .models import AIBlogRequest, AIBlogGeneration, AIBlogBatchRequest
from blog.serializers import BlogPostDetailSerializer, CategorySerializer, TagSerializer
import json

class AIBlogRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and viewing AI blog post requests.
    """
    class Meta:
        model = AIBlogRequest
        fields = [
            'id', 'user', 'prompt', 'topic', 'keywords', 
            'allow_web_search', 'status', 'created_at', 
            'updated_at', 'error_message'
        ]
        read_only_fields = ['user', 'status', 'created_at', 'updated_at', 'error_message']

class AIBlogGenerationSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing AI-generated blog posts.
    """
    blog_post = BlogPostDetailSerializer(read_only=True)
    suggested_categories = CategorySerializer(many=True, read_only=True)
    suggested_tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = AIBlogGeneration
        fields = [
            'id', 'request', 'blog_post', 'title', 'content', 
            'excerpt', 'meta_title', 'meta_description',
            'suggested_categories', 'suggested_tags', 
            'focus_keywords', 'created_at'
        ]
        read_only_fields = ['request', 'created_at']

class AIBlogRequestListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing AI blog post requests.
    """
    class Meta:
        model = AIBlogRequest
        fields = ['id', 'topic', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']

class AIBlogBatchRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for batch blog requests.
    """
    child_requests_count = serializers.SerializerMethodField()
    
    class Meta:
        model = AIBlogBatchRequest
        fields = ['id', 'topic', 'description', 'prompt', 'keywords', 'num_posts', 
                  'allow_web_search', 'status', 'created_at', 'updated_at', 
                  'error_message', 'child_requests_count']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'error_message']
    
    def get_child_requests_count(self, obj):
        return obj.child_requests.count()

class AIBlogBatchRequestDetailSerializer(AIBlogBatchRequestSerializer):
    """
    Detailed serializer for batch blog requests including child requests.
    """
    child_requests = AIBlogRequestListSerializer(many=True, read_only=True)
    generated_ideas = serializers.SerializerMethodField()
    
    class Meta(AIBlogBatchRequestSerializer.Meta):
        fields = AIBlogBatchRequestSerializer.Meta.fields + ['child_requests', 'generated_ideas']
    
    def get_generated_ideas(self, obj):
        if not obj.generated_ideas:
            return []
        try:
            return json.loads(obj.generated_ideas)
        except:
            return [] 