from django.contrib import admin
from .models import UserProfile, ResearchProject, ResearchData, AIAnalysis, Comment

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'position', 'created_at')
    search_fields = ('user__username', 'user__email', 'institution')
    list_filter = ('created_at', 'institution')

@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'is_public', 'created_at')
    list_filter = ('status', 'is_public', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('collaborators',)
    date_hierarchy = 'created_at'

@admin.register(ResearchData)
class ResearchDataAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'data_type', 'uploaded_by', 'created_at')
    list_filter = ('data_type', 'created_at')
    search_fields = ('title', 'description', 'project__title')
    date_hierarchy = 'created_at'

@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'analysis_type', 'status', 'requested_by', 'created_at')
    list_filter = ('status', 'analysis_type', 'created_at')
    search_fields = ('title', 'description', 'project__title')
    date_hierarchy = 'created_at'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'project', 'parent', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('content', 'author__username', 'project__title') 