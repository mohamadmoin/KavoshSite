from django.core.management.base import BaseCommand
from django.db.models import Q
from blog.models import BlogPost
from blog.services import BlogLinkEnhancer
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Enhance existing blog posts with internal links and related posts sections'

    def add_arguments(self, parser):
        parser.add_argument(
            '--max-links',
            type=int,
            default=5,
            help='Maximum number of internal links to add per post'
        )
        parser.add_argument(
            '--post-id',
            type=int,
            help='Enhance a specific post by ID'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )

    def handle(self, *args, **options):
        max_links = options['max_links']
        post_id = options.get('post_id')
        dry_run = options['dry_run']

        # Create link enhancer
        link_enhancer = BlogLinkEnhancer()
        
        # Get posts to process
        if post_id:
            posts = BlogPost.objects.filter(id=post_id)
            if not posts.exists():
                self.stdout.write(self.style.ERROR(f'Post with ID {post_id} not found'))
                return
        else:
            # Get all published posts with less than max_links internal links
            posts = BlogPost.objects.filter(
                Q(status='published'),
                Q(internal_links_count__lt=max_links) | Q(internal_links_count__isnull=True)
            )

        total_posts = posts.count()
        enhanced_count = 0
        skipped_count = 0
        error_count = 0

        self.stdout.write(f'Found {total_posts} posts to process')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - No changes will be made'))

        # Process each post
        for post in posts:
            try:
                self.stdout.write(f'Processing post {post.id}: {post.title}')
                
                if not dry_run:
                    # Try to enhance with internal links
                    enhanced = link_enhancer.enhance_post_links(post.id, max_links=max_links)
                    
                    # Generate and add related posts section if it doesn't exist
                    if 'class="related-posts"' not in post.content:
                        related_posts_html = link_enhancer.generate_related_posts_html(post.id)
                        if related_posts_html:
                            post.content += "\n\n" + related_posts_html
                            post.save(update_fields=['content'])
                            self.stdout.write(f'  Added related posts section')
                    
                    if enhanced:
                        enhanced_count += 1
                        self.stdout.write(self.style.SUCCESS(f'  Enhanced with internal links'))
                    else:
                        skipped_count += 1
                        self.stdout.write(self.style.WARNING(f'  No new links added'))
                else:
                    self.stdout.write(self.style.WARNING(f'  Would process (dry run)'))
                    
            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'  Error processing post {post.id}: {str(e)}'))
                logger.error(f'Error enhancing post {post.id}: {str(e)}')

        # Print summary
        self.stdout.write('\nSummary:')
        self.stdout.write(f'Total posts processed: {total_posts}')
        if not dry_run:
            self.stdout.write(self.style.SUCCESS(f'Posts enhanced: {enhanced_count}'))
            self.stdout.write(self.style.WARNING(f'Posts skipped: {skipped_count}'))
            self.stdout.write(self.style.ERROR(f'Errors: {error_count}'))
        else:
            self.stdout.write(self.style.WARNING('Dry run completed - no changes made')) 