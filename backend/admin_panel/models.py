from django.db import models

# Create your models here.

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100)
    site_description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='site/', blank=True, null=True)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True)
    
    # Contact info
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Social media links
    facebook = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    
    # Footer
    footer_text = models.TextField(blank=True)
    copyright_text = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SiteSettings.objects.exists():
            # Update existing instance instead of creating a new one
            self.pk = SiteSettings.objects.first().pk
        super().save(*args, **kwargs)

class SEOSettings(models.Model):
    # Default SEO settings
    default_meta_title = models.CharField(max_length=100)
    default_meta_description = models.TextField()
    default_meta_keywords = models.CharField(max_length=255, blank=True)
    
    # Open Graph
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True)
    
    # Google Analytics and Tag Manager
    google_analytics_id = models.CharField(max_length=50, blank=True)
    google_tag_manager_id = models.CharField(max_length=50, blank=True)
    
    # Verification codes
    google_site_verification = models.CharField(max_length=100, blank=True)
    bing_site_verification = models.CharField(max_length=100, blank=True)
    
    # Robots.txt content
    robots_txt = models.TextField(blank=True, help_text="Content for robots.txt file")
    
    # Structured data
    enable_structured_data = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'SEO Settings'
        verbose_name_plural = 'SEO Settings'
    
    def __str__(self):
        return "SEO Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if not self.pk and SEOSettings.objects.exists():
            # Update existing instance instead of creating a new one
            self.pk = SEOSettings.objects.first().pk
        super().save(*args, **kwargs)
