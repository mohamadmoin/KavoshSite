from bs4 import BeautifulSoup
from django.db.models import Q
from blog.models import BlogPost

class BlogLinkEnhancer:
    def __init__(self):
        self.posts = BlogPost.objects.filter(status='published')

    def enhance_post_links(self, post_content, current_post_id=None):
        """
        Enhance blog post content by adding internal links to other relevant posts.
        Uses BeautifulSoup for reliable HTML parsing.
        """
        soup = BeautifulSoup(post_content, 'html.parser')
        text_nodes = soup.find_all(text=True)
        
        # Get all published posts except the current one
        other_posts = self.posts
        if current_post_id:
            other_posts = other_posts.exclude(id=current_post_id)

        # Process each text node
        for text_node in text_nodes:
            if text_node.parent.name == 'a':  # Skip if already in a link
                continue

            text = str(text_node)
            modified_text = text

            # Try to find matches with other post titles
            for post in other_posts:
                if post.title.lower() in text.lower():
                    # Create a new link element
                    new_link = soup.new_tag('a', href=f'/blog/{post.slug}')
                    new_link.string = text
                    text_node.replace_with(new_link)
                    break

        return str(soup) 