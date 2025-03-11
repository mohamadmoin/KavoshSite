"""
Services for enhancing blog posts with internal links and SEO features.
"""
import re
import logging
from collections import defaultdict
from django.utils.text import slugify
from blog.models import BlogPost, Category, Tag
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class BlogLinkEnhancer:
    """
    Service to automatically enhance blog posts with internal links to other related posts.
    """
    def __init__(self):
        # Cache of existing posts by keyword
        self.keyword_post_map = defaultdict(list)
        self.rebuild_keyword_index()
    
    def rebuild_keyword_index(self):
        """Build an index of keywords to posts for quick matching"""
        self.keyword_post_map.clear()
        
        try:
            # Get all published posts to build the index
            for post in BlogPost.objects.filter(status='published'):
                # Extract keywords from focus_keywords
                if post.focus_keywords:
                    keywords = [k.strip().lower() for k in post.focus_keywords.split(',') if k.strip()]
                    
                    # Add categories and tags as keywords
                    keywords.extend([cat.name.lower() for cat in post.categories.all()])
                    keywords.extend([tag.name.lower() for tag in post.tags.all()])
                    
                    # Add title words as potential match points (only words longer than 4 chars)
                    keywords.extend([word.lower() for word in post.title.split() 
                                    if len(word) > 4 and word.lower() not in keywords])
                    
                    # Add to the keyword map
                    for keyword in keywords:
                        if keyword and len(keyword) > 4:  # Avoid short words
                            self.keyword_post_map[keyword].append({
                                'id': post.id,
                                'title': post.title,
                                'slug': post.slug
                            })
            
            logger.info(f"Blog link enhancer index rebuilt with {len(self.keyword_post_map)} keywords")
        except Exception as e:
            logger.error(f"Error rebuilding keyword index: {e}")
    
    def enhance_post_links(self, post_id, max_links=5):
        """
        Add internal links to a post based on keyword matching
        
        Args:
            post_id: The ID of the post to enhance
            max_links: Maximum number of links to add
            
        Returns:
            Bool: True if links were added, False otherwise
        """
        try:
            post = BlogPost.objects.get(id=post_id)
            
            # Skip if not published or already has sufficient internal links
            if post.status != 'published' or post.internal_links_count >= max_links:
                return False
            
            content = post.content
            original_content = content
            
            # Find potential matches in content
            links_added = 0
            
            # Simple HTML content check to avoid parsing errors
            if not content or '<html' in content or not content.strip():
                logger.warning(f"Post {post_id} has invalid content format for link enhancement")
                return False
            
            # For each keyword we have indexed
            for keyword, target_posts in self.keyword_post_map.items():
                # Skip linking to itself
                target_posts = [p for p in target_posts if p['id'] != post_id]
                if not target_posts:
                    continue
                
                # If we've added enough links, stop
                if links_added >= max_links:
                    break
                
                # Split content into HTML tags and text
                soup = BeautifulSoup(content, 'html.parser')
                
                # Function to process text nodes
                def process_text_node(text):
                    if not text.strip():
                        return text
                    
                    # Only process if the text contains our keyword
                    if keyword.lower() not in text.lower():
                        return text
                    
                    # Simple word boundary pattern
                    pattern = r'\b' + re.escape(keyword) + r'\b'
                    
                    # Case-insensitive replacement of first occurrence
                    def replace_first(match):
                        target = target_posts[0]
                        return f'<a href="/blog/{target["slug"]}" class="internal-link">{match.group(0)}</a>'
                    
                    # Replace only first occurrence
                    new_text = re.sub(pattern, replace_first, text, count=1, flags=re.IGNORECASE)
                    
                    # If we made a replacement, increment counter
                    if new_text != text:
                        nonlocal links_added
                        links_added += 1
                        logger.debug(f"Added link from post {post_id} to {target_posts[0]['id']} with keyword '{keyword}'")
                    
                    return new_text
                
                # Process all text nodes that aren't already in links
                for text in soup.find_all(text=True):
                    if not text.parent.name == 'a':  # Skip if parent is an anchor tag
                        new_text = process_text_node(text)
                        if new_text != text:
                            text.replace_with(BeautifulSoup(new_text, 'html.parser'))
                
                # If we've added enough links, stop
                if links_added >= max_links:
                    break
                
                # Update content with processed HTML
                content = str(soup)
            
            # Save the updated content if changes were made
            if links_added > 0 and content != original_content:
                post.content = content
                post.internal_links_count += links_added
                post.save(update_fields=['content', 'internal_links_count'])
                logger.info(f"Enhanced post {post_id} with {links_added} internal links")
                return True
                
            return False
                
        except BlogPost.DoesNotExist:
            logger.warning(f"Post {post_id} not found for link enhancement")
            return False
        except Exception as e:
            logger.error(f"Error enhancing post {post_id} links: {e}")
            return False
    
    def generate_related_posts_html(self, post_id, max_posts=3):
        """
        Generate HTML for related posts section based on shared categories and tags
        
        Args:
            post_id: The ID of the post to find related posts for
            max_posts: Maximum number of related posts to include
            
        Returns:
            str: HTML for the related posts section, or empty string if none found
        """
        try:
            post = BlogPost.objects.get(id=post_id)
            
            # Find posts with shared categories or tags
            categories = post.categories.all()
            tags = post.tags.all()
            
            if not categories and not tags:
                return ""
            
            # Find posts with shared categories or tags
            related_posts = BlogPost.objects.filter(status='published') \
                .exclude(id=post_id) \
                .filter(categories__in=categories) \
                .distinct()
                
            # If we don't have enough, add posts with shared tags
            if related_posts.count() < max_posts and tags:
                more_posts = BlogPost.objects.filter(status='published') \
                    .exclude(id=post_id) \
                    .exclude(id__in=related_posts.values_list('id', flat=True)) \
                    .filter(tags__in=tags) \
                    .distinct()
                
                related_posts = list(related_posts) + list(more_posts)
            
            # Limit to max_posts
            related_posts = related_posts[:max_posts]
            
            if not related_posts:
                return ""
            
            # Generate HTML
            html = '<div class="related-posts">\n'
            html += '  <h3>You Might Also Like</h3>\n'
            html += '  <ul class="related-posts-list">\n'
            
            for related_post in related_posts:
                html += f'    <li><a href="/blog/{related_post.slug}">{related_post.title}</a></li>\n'
            
            html += '  </ul>\n'
            html += '</div>'
            
            return html
            
        except BlogPost.DoesNotExist:
            logger.warning(f"Post {post_id} not found for generating related posts")
            return ""
        except Exception as e:
            logger.error(f"Error generating related posts for {post_id}: {e}")
            return "" 