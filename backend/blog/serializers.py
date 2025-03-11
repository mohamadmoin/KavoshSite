from rest_framework import serializers
from .models import BlogPost, Category, Tag
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class BlogPostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author', 'excerpt', 
            'featured_image', 'published_at', 'status',
            'categories', 'tags', 'is_featured', 'meta_title',
            'meta_description', 'canonical_url', 'focus_keywords',
            'internal_links_count', 'external_links_count'
        ]

class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'author', 'content', 'content_format', 'excerpt', 
            'featured_image', 'created_at', 'updated_at', 'published_at', 
            'status', 'categories', 'tags', 'is_featured',
            'meta_title', 'meta_description', 'canonical_url', 'focus_keywords',
            'internal_links_count', 'external_links_count'
        ]

class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'title', 'content', 'content_format', 'excerpt', 'featured_image',
            'status', 'published_at', 'categories', 'tags',
            'is_featured', 'meta_title', 'meta_description',
            'canonical_url', 'focus_keywords'
        ]
        
    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        tags = validated_data.pop('tags', [])
        
        # Current user is set as the author in the view
        post = BlogPost.objects.create(**validated_data)
        
        # Add categories and tags
        post.categories.set(categories)
        post.tags.set(tags)
        
        return post 