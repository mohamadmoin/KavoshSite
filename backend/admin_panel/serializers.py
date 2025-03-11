from rest_framework import serializers
from .models import SiteSettings, SEOSettings

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'site_description', 'logo', 'favicon',
            'email', 'phone', 'address',
            'facebook', 'twitter', 'instagram', 'linkedin',
            'footer_text', 'copyright_text'
        ]

class SEOSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOSettings
        fields = [
            'id', 'default_meta_title', 'default_meta_description', 'default_meta_keywords',
            'og_image', 'google_analytics_id', 'google_tag_manager_id',
            'google_site_verification', 'bing_site_verification',
            'robots_txt', 'enable_structured_data'
        ] 