from django.contrib import admin
from .models import SiteSettings, SEOSettings

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'site_description', 'logo', 'favicon')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Social Media', {
            'fields': ('facebook', 'twitter', 'instagram', 'linkedin')
        }),
        ('Footer', {
            'fields': ('footer_text', 'copyright_text')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance of SiteSettings
        return not SiteSettings.objects.exists()

@admin.register(SEOSettings)
class SEOSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Default SEO', {
            'fields': ('default_meta_title', 'default_meta_description', 'default_meta_keywords', 'og_image')
        }),
        ('Analytics', {
            'fields': ('google_analytics_id', 'google_tag_manager_id')
        }),
        ('Verification', {
            'fields': ('google_site_verification', 'bing_site_verification')
        }),
        ('Advanced', {
            'fields': ('robots_txt', 'enable_structured_data')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance of SEOSettings
        return not SEOSettings.objects.exists()
