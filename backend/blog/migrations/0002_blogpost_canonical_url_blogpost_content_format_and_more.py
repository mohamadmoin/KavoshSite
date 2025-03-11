# Generated by Django 5.1.7 on 2025-03-09 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='canonical_url',
            field=models.URLField(blank=True, help_text='Canonical URL if this content exists elsewhere'),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='content_format',
            field=models.CharField(choices=[('html', 'HTML'), ('rich_text', 'Rich Text JSON'), ('markdown', 'Markdown')], default='html', help_text='Format of the content field', max_length=10),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='external_links_count',
            field=models.PositiveIntegerField(default=0, help_text='Number of external links in content'),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='focus_keywords',
            field=models.CharField(blank=True, help_text='Main keywords for this post, comma separated', max_length=200),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='internal_links_count',
            field=models.PositiveIntegerField(default=0, help_text='Number of internal links in content'),
        ),
    ]
