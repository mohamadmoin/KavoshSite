from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'

class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class BlogPost(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    
    CONTENT_FORMAT_CHOICES = (
        ('html', 'HTML'),
        ('rich_text', 'Rich Text JSON'),
        ('markdown', 'Markdown'),
    )
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    content = models.TextField()
    content_format = models.CharField(max_length=10, choices=CONTENT_FORMAT_CHOICES, default='html', 
                                       help_text="Format of the content field")
    featured_image = models.ImageField(upload_to='blog/images/', blank=True, null=True)
    excerpt = models.TextField(blank=True, help_text="A short description of the post for SEO and previews")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(default=timezone.now)
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    categories = models.ManyToManyField(Category, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    
    # SEO fields
    meta_title = models.CharField(max_length=100, blank=True, help_text="Custom title tag for SEO (optional)")
    meta_description = models.TextField(blank=True, help_text="Custom meta description for SEO (optional)")
    canonical_url = models.URLField(blank=True, help_text="Canonical URL if this content exists elsewhere")
    focus_keywords = models.CharField(max_length=200, blank=True, help_text="Main keywords for this post, comma separated")
    
    # Link tracking fields
    internal_links_count = models.PositiveIntegerField(default=0, help_text="Number of internal links in content")
    external_links_count = models.PositiveIntegerField(default=0, help_text="Number of external links in content")
    
    # For featured posts
    is_featured = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        if not self.meta_title:
            self.meta_title = self.title
            
        if not self.meta_description and self.excerpt:
            self.meta_description = self.excerpt
        
        # Count links if content is in HTML format
        if self.content_format == 'html':
            from bs4 import BeautifulSoup
            import re
            
            soup = BeautifulSoup(self.content, 'html.parser')
            links = soup.find_all('a', href=True)
            
            domain_pattern = re.compile(r'^https?://(?:www\.)?kavoshai\.com')
            self.internal_links_count = sum(1 for link in links if domain_pattern.match(link['href']) or link['href'].startswith('/'))
            self.external_links_count = len(links) - self.internal_links_count
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-published_at']
