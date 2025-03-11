from django.core.management.base import BaseCommand
from django.db.models import Q
from blog.models import BlogPost
from blog.services.image_service import PexelsImageService, AltTextGenerator
from django.core.files.base import ContentFile
from django.utils.text import slugify
import logging
import os
from django.conf import settings

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Add featured images to blog posts that do not have them'

    def add_arguments(self, parser):
        parser.add_argument(
            '--post-id',
            type=int,
            help='Process a specific post by ID'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Replace existing featured images'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )

    def handle(self, *args, **options):
        post_id = options.get('post_id')
        force = options.get('force')
        dry_run = options.get('dry_run')

        # Initialize Pexels API client
        pexels_api_key = os.getenv("PEXELS_API_KEY") or getattr(settings, "PEXELS_API_KEY", "")
        image_service = PexelsImageService(api_key=pexels_api_key)
        alt_text_generator = AltTextGenerator()
        
        if not pexels_api_key:
            self.stdout.write(self.style.ERROR("No Pexels API key found. Please set PEXELS_API_KEY in settings or environment."))
            return

        # Get posts to process
        if post_id:
            posts = BlogPost.objects.filter(id=post_id)
            if not posts.exists():
                self.stdout.write(self.style.ERROR(f'Post with ID {post_id} not found'))
                return
        else:
            # Get all published posts without featured images (or all if force=True)
            if force:
                posts = BlogPost.objects.filter(status='published')
            else:
                posts = BlogPost.objects.filter(
                    Q(status='published'),
                    Q(featured_image='') | Q(featured_image__isnull=True)
                )

        total_posts = posts.count()
        processed_count = 0
        skipped_count = 0
        error_count = 0

        self.stdout.write(f'Found {total_posts} posts to process')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN - No changes will be made'))

        # Process each post
        for post in posts:
            try:
                if post.featured_image and not force:
                    self.stdout.write(f'Skipping post {post.id}: {post.title} (already has image)')
                    skipped_count += 1
                    continue
                    
                self.stdout.write(f'Processing post {post.id}: {post.title}')
                
                # Generate search terms from keywords, title, and categories
                search_terms = []
                if post.focus_keywords:
                    search_terms.extend([k.strip() for k in post.focus_keywords.split(',') if k.strip()])
                
                # Add categories as search terms
                categories = post.categories.all()
                if categories:
                    search_terms.extend([c.name for c in categories[:2]])
                
                # Add words from title if we don't have enough terms
                if len(search_terms) < 2:
                    title_words = [word for word in post.title.split() if len(word) > 4]
                    search_terms.extend(title_words[:2])
                
                # Use the first search term, or fall back to the title
                primary_search_term = search_terms[0] if search_terms else post.title
                
                self.stdout.write(f'  Searching for image with term: {primary_search_term}')
                
                if not dry_run:
                    # Get an image related to the primary search term
                    image_data = image_service.get_random_image(primary_search_term)
                    
                    if image_data and image_data.get('src'):
                        # Generate alt text for the image based on the blog topic
                        alt_text_context = f"Blog post titled '{post.title}' about {post.focus_keywords or primary_search_term}"
                        alt_text = image_data.get('alt') or alt_text_generator.generate_alt_text(alt_text_context)
                        
                        # Download the image
                        image_bytes = image_service.download_image(image_data, size='large')
                        
                        if image_bytes:
                            # Create a name for the image file
                            image_filename = f"{slugify(primary_search_term)}-{image_data.get('id')}.jpg"
                            
                            # Save the image to the blog post
                            post.featured_image.save(
                                image_filename,
                                ContentFile(image_bytes),
                                save=False  # Don't save yet, we'll do it with other changes
                            )
                            
                            # Generate attribution HTML
                            attribution_html = image_service.generate_attribution_html(image_data)
                            
                            # Add attribution to the end of the post content if not already there
                            if attribution_html and attribution_html not in post.content:
                                post.content += f"\n\n{attribution_html}"
                            
                            # Save all changes
                            post.save()
                            
                            self.stdout.write(self.style.SUCCESS(f'  Added image: {image_filename} with alt text: {alt_text}'))
                            processed_count += 1
                        else:
                            self.stdout.write(self.style.ERROR(f'  Failed to download image'))
                            error_count += 1
                    else:
                        self.stdout.write(self.style.ERROR(f'  No image found for term: {primary_search_term}'))
                        error_count += 1
                else:
                    self.stdout.write(self.style.WARNING(f'  Would add image for term: {primary_search_term} (dry run)'))
                    processed_count += 1
                    
            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'  Error processing post {post.id}: {str(e)}'))
                logger.error(f'Error adding image to post {post.id}: {str(e)}')

        # Print summary
        self.stdout.write('\nSummary:')
        self.stdout.write(f'Total posts processed: {total_posts}')
        if not dry_run:
            self.stdout.write(self.style.SUCCESS(f'Posts updated with images: {processed_count}'))
            self.stdout.write(self.style.WARNING(f'Posts skipped: {skipped_count}'))
            self.stdout.write(self.style.ERROR(f'Errors: {error_count}'))
        else:
            self.stdout.write(self.style.WARNING('Dry run completed - no changes made')) 