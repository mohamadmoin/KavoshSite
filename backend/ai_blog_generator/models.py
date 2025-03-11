from django.db import models
from django.contrib.auth.models import User
from blog.models import BlogPost, Category, Tag

class AIBlogBatchRequest(models.Model):
    """
    Model to store batch requests for multiple related AI-generated blog posts.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_blog_batch_requests')
    topic = models.CharField(max_length=200, help_text="The main topic for this series of blog posts")
    description = models.TextField(help_text="Description of what the series should cover")
    prompt = models.TextField(help_text="Common instructions for all generated posts")
    keywords = models.TextField(blank=True, help_text="Common keywords for SEO, comma separated")
    num_posts = models.IntegerField(default=5, help_text="Number of blog posts to generate")
    allow_web_search = models.BooleanField(default=False, help_text="Whether the AI is allowed to search the web")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    generated_ideas = models.TextField(blank=True, null=True, help_text="JSON list of generated blog post ideas")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    error_message = models.TextField(blank=True, null=True, help_text="Error message if generation failed")
    
    def __str__(self):
        return f"AI Blog Batch: {self.topic} ({self.status}) - {self.num_posts} posts"
    
    class Meta:
        ordering = ['-created_at']

class AIBlogRequest(models.Model):
    """
    Model to store requests for AI-generated blog posts.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_blog_requests')
    prompt = models.TextField(help_text="The prompt for the AI to generate a blog post")
    topic = models.CharField(max_length=200, help_text="The main topic of the blog post")
    keywords = models.TextField(blank=True, help_text="Keywords for SEO, comma separated")
    allow_web_search = models.BooleanField(default=False, help_text="Whether the AI is allowed to search the web")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    error_message = models.TextField(blank=True, null=True, help_text="Error message if generation failed")
    parent_batch = models.ForeignKey(AIBlogBatchRequest, on_delete=models.SET_NULL, 
                                   null=True, blank=True, related_name='child_requests')
    
    def __str__(self):
        return f"AI Blog Request: {self.topic} ({self.status})"
    
    class Meta:
        ordering = ['-created_at']

class AIBlogGeneration(models.Model):
    """
    Model to store the results of AI-generated blog posts.
    """
    request = models.OneToOneField(AIBlogRequest, on_delete=models.CASCADE, related_name='generation')
    blog_post = models.OneToOneField(BlogPost, on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_generation')
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    meta_title = models.CharField(max_length=100, blank=True)
    meta_description = models.TextField(blank=True)
    suggested_categories = models.ManyToManyField(Category, blank=True, related_name='ai_suggested_posts')
    suggested_tags = models.ManyToManyField(Tag, blank=True, related_name='ai_suggested_posts')
    focus_keywords = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"AI Generated: {self.title}"
    
    class Meta:
        ordering = ['-created_at']
