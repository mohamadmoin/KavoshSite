import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cmsbackend.settings')
django.setup()

from admin_panel.models import SEOSettings

def update_analytics_settings():
    """Update the SEO settings with Google Analytics and Google Tag Manager IDs."""
    try:
        # Get the first SEO settings instance or create one if it doesn't exist
        seo_settings, created = SEOSettings.objects.get_or_create(
            pk=1,
            defaults={
                'default_meta_title': 'KavoshSite Blog',
                'default_meta_description': 'Discover insightful tech articles generated with AI, covering programming, technology, and software development.',
                'default_meta_keywords': 'AI, blog, technology, programming',
                'enable_structured_data': True,
                'robots_txt': 'User-agent: *\nAllow: /'
            }
        )
        
        # Update the Google Analytics and Google Tag Manager IDs
        seo_settings.google_analytics_id = 'G-BEBHH24NZP'
        seo_settings.google_tag_manager_id = 'GTM-PWP4Z4FG'
        seo_settings.save()
        
        print(f"SEO settings updated successfully!")
        print(f"Google Analytics ID: {seo_settings.google_analytics_id}")
        print(f"Google Tag Manager ID: {seo_settings.google_tag_manager_id}")
        
    except Exception as e:
        print(f"Error updating SEO settings: {e}")

if __name__ == "__main__":
    update_analytics_settings() 