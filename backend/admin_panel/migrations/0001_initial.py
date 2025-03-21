# Generated by Django 5.1.7 on 2025-03-07 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SEOSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('default_meta_title', models.CharField(max_length=100)),
                ('default_meta_description', models.TextField()),
                ('default_meta_keywords', models.CharField(blank=True, max_length=255)),
                ('og_image', models.ImageField(blank=True, null=True, upload_to='seo/')),
                ('google_analytics_id', models.CharField(blank=True, max_length=50)),
                ('google_tag_manager_id', models.CharField(blank=True, max_length=50)),
                ('google_site_verification', models.CharField(blank=True, max_length=100)),
                ('bing_site_verification', models.CharField(blank=True, max_length=100)),
                ('robots_txt', models.TextField(blank=True, help_text='Content for robots.txt file')),
                ('enable_structured_data', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'SEO Settings',
                'verbose_name_plural': 'SEO Settings',
            },
        ),
        migrations.CreateModel(
            name='SiteSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('site_name', models.CharField(max_length=100)),
                ('site_description', models.TextField(blank=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='site/')),
                ('favicon', models.ImageField(blank=True, null=True, upload_to='site/')),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('address', models.TextField(blank=True)),
                ('facebook', models.URLField(blank=True)),
                ('twitter', models.URLField(blank=True)),
                ('instagram', models.URLField(blank=True)),
                ('linkedin', models.URLField(blank=True)),
                ('footer_text', models.TextField(blank=True)),
                ('copyright_text', models.CharField(blank=True, max_length=255)),
            ],
            options={
                'verbose_name': 'Site Settings',
                'verbose_name_plural': 'Site Settings',
            },
        ),
    ]
