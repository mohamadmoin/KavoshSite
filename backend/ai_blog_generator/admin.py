from django.contrib import admin
from django.utils.html import format_html
from .models import AIBlogRequest, AIBlogGeneration

class AIBlogGenerationInline(admin.StackedInline):
    model = AIBlogGeneration
    readonly_fields = ('title', 'content', 'excerpt', 'meta_title', 'meta_description', 'focus_keywords', 'blog_post')
    extra = 0
    max_num = 1
    can_delete = False

@admin.register(AIBlogRequest)
class AIBlogRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'user', 'status', 'created_at', 'updated_at', 'has_generation')
    list_filter = ('status', 'user', 'created_at')
    search_fields = ('topic', 'prompt', 'keywords')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [AIBlogGenerationInline]
    
    def has_generation(self, obj):
        has_gen = hasattr(obj, 'generation')
        if has_gen:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    
    has_generation.short_description = 'Has Generation'
    
    actions = ['publish_blog_posts']
    
    def publish_blog_posts(self, request, queryset):
        """Publish all selected AI blog posts in one action."""
        published_count = 0
        for ai_request in queryset:
            try:
                # Check if the request has a generation and blog post
                if hasattr(ai_request, 'generation') and ai_request.generation.blog_post:
                    blog_post = ai_request.generation.blog_post
                    # Only update if it's not already published
                    if blog_post.status != 'published':
                        blog_post.status = 'published'
                        blog_post.save()
                        published_count += 1
            except Exception as e:
                self.message_user(request, f"Error publishing post for request #{ai_request.id}: {str(e)}")
        
        self.message_user(request, f"Successfully published {published_count} blog posts.")
    
    publish_blog_posts.short_description = "Publish selected AI blog posts"

@admin.register(AIBlogGeneration)
class AIBlogGenerationAdmin(admin.ModelAdmin):
    list_display = ('id', 'request', 'title', 'has_blog_post', 'created_at')
    search_fields = ('title', 'content', 'request__topic')
    readonly_fields = ('created_at',)
    
    def has_blog_post(self, obj):
        if obj.blog_post:
            status = obj.blog_post.status
            color = 'green' if status == 'published' else 'orange'
            return format_html(f'<span style="color: {color};">{status.title()}</span>')
        return format_html('<span style="color: red;">✗</span>')
    
    has_blog_post.short_description = 'Blog Post Status'
    
    actions = ['publish_blog_posts']
    
    def publish_blog_posts(self, request, queryset):
        """Publish all selected blog posts from AI generations."""
        published_count = 0
        for generation in queryset:
            if generation.blog_post and generation.blog_post.status != 'published':
                generation.blog_post.status = 'published'
                generation.blog_post.save()
                published_count += 1
        
        self.message_user(request, f"Successfully published {published_count} blog posts.")
    
    publish_blog_posts.short_description = "Publish selected blog posts"
