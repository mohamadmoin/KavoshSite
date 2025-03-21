from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='research_profile')
    bio = models.TextField(max_length=500, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    position = models.CharField(max_length=100, blank=True)
    research_interests = models.TextField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"

class ResearchProject(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    collaborators = models.ManyToManyField(User, related_name='collaborated_projects', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_public = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class ResearchData(models.Model):
    DATA_TYPE_CHOICES = [
        ('raw', 'Raw Data'),
        ('processed', 'Processed Data'),
        ('analysis', 'Analysis Results'),
        ('visualization', 'Visualization'),
    ]

    project = models.ForeignKey(ResearchProject, on_delete=models.CASCADE, related_name='data_sets')
    title = models.CharField(max_length=200)
    description = models.TextField()
    data_type = models.CharField(max_length=20, choices=DATA_TYPE_CHOICES)
    file = models.FileField(upload_to='research_data/%Y/%m/%d/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_data')
    version = models.CharField(max_length=50, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Research Data'

    def __str__(self):
        return f"{self.title} - {self.project.title}"

class AIAnalysis(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    project = models.ForeignKey(ResearchProject, on_delete=models.CASCADE, related_name='ai_analyses')
    data = models.ForeignKey(ResearchData, on_delete=models.CASCADE, related_name='ai_analyses')
    title = models.CharField(max_length=200)
    description = models.TextField()
    analysis_type = models.CharField(max_length=100)
    parameters = models.JSONField(default=dict)
    results = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='requested_analyses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'AI Analyses'

    def __str__(self):
        return f"{self.title} - {self.project.title}"

class Comment(models.Model):
    project = models.ForeignKey(ResearchProject, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='research_comments')
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.project.title}" 