from django.core.management.base import BaseCommand
from django.db.models import Count
from ai_blog_generator.models import AIBlogGeneration
from blog.models import BlogPost

class Command(BaseCommand):
    help = 'Publish all AI-generated blog posts that are currently in draft status'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be published without actually changing anything',
        )
    
    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        
        # Get all AI-generated blog posts that are in draft status
        generations = AIBlogGeneration.objects.filter(
            blog_post__isnull=False,
            blog_post__status='draft'
        ).select_related('blog_post', 'request__user')
        
        count = generations.count()
        
        self.stdout.write(self.style.SUCCESS(f'Found {count} AI-generated blog posts in draft status'))
        
        if dry_run:
            # Just show information about what would be published
            for gen in generations:
                self.stdout.write(
                    f'Would publish: #{gen.blog_post.id} "{gen.blog_post.title}" '
                    f'by {gen.request.user.username} (created: {gen.blog_post.created_at})'
                )
            self.stdout.write(self.style.WARNING('DRY RUN: No changes were made'))
            return
        
        # Actually publish the posts
        for gen in generations:
            try:
                blog_post = gen.blog_post
                blog_post.status = 'published'
                blog_post.save()
                self.stdout.write(
                    self.style.SUCCESS(f'Published: "{blog_post.title}" (ID: {blog_post.id})')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error publishing post {gen.blog_post.id}: {str(e)}')
                )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully published {count} blog posts')) 