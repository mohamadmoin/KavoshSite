"""
Initialize database with default settings.
Run this script after migrations to set up default settings.
"""
import os
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cmsbackend.settings')
django.setup()

# Import models after Django is configured
from django.contrib.auth.models import User
from admin_panel.models import SiteSettings, SEOSettings
from blog.models import Category, Tag

def create_default_superuser():
    """Create a default superuser if none exists."""
    if not User.objects.filter(is_superuser=True).exists():
        print("Creating default superuser...")
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword123'
        )
        print("Default superuser created. Username: admin, Password: adminpassword123")
        print("IMPORTANT: Change this password immediately after first login!")
    else:
        print("Superuser already exists, skipping creation.")

def create_default_site_settings():
    """Create default site settings if none exist."""
    if not SiteSettings.objects.exists():
        print("Creating default site settings...")
        SiteSettings.objects.create(
            site_name="My Blog",
            site_description="A modern blog platform built with Next.js and Django",
            footer_text="Thank you for visiting our website.",
            copyright_text="© 2024 My Blog. All rights reserved."
        )
        print("Default site settings created.")
    else:
        print("Site settings already exist, skipping creation.")

def create_default_seo_settings():
    """Create default SEO settings if none exist."""
    if not SEOSettings.objects.exists():
        print("Creating default SEO settings...")
        SEOSettings.objects.create(
            default_meta_title="My Blog",
            default_meta_description="A modern blog platform built with Next.js and Django",
            default_meta_keywords="blog, nextjs, django, react",
            enable_structured_data=True,
            robots_txt="User-agent: *\nAllow: /"
        )
        print("Default SEO settings created.")
    else:
        print("SEO settings already exist, skipping creation.")

def create_default_categories():
    """Create default categories if none exist."""
    if Category.objects.count() == 0:
        print("Creating default categories...")
        categories = [
            {"name": "Technology", "description": "Articles about technology and programming"},
            {"name": "Business", "description": "Business insights and tips"},
            {"name": "Lifestyle", "description": "Lifestyle articles and advice"},
            {"name": "Health", "description": "Health and wellness information"}
        ]
        for category_data in categories:
            Category.objects.create(**category_data)
        print(f"Created {len(categories)} default categories.")
    else:
        print("Categories already exist, skipping creation.")

def create_default_tags():
    """Create default tags if none exist."""
    if Tag.objects.count() == 0:
        print("Creating default tags...")
        tags = ["React", "Next.js", "Django", "JavaScript", "Python", "Web Development"]
        for tag_name in tags:
            Tag.objects.create(name=tag_name)
        print(f"Created {len(tags)} default tags.")
    else:
        print("Tags already exist, skipping creation.")

if __name__ == "__main__":
    print("Initializing database with default settings...")
    
    create_default_superuser()
    create_default_site_settings()
    create_default_seo_settings()
    create_default_categories()
    create_default_tags()
    
    print("\nInitialization complete! You can now start the server.")
    print("Run 'python manage.py runserver' to start the Django development server.") 