"""
Service for fetching and managing images from Pexels API.
"""
import requests
import random
import logging
from typing import List, Dict, Any, Optional
import os
from django.conf import settings
from django.utils.text import slugify

logger = logging.getLogger(__name__)

class PexelsImageService:
    """Service for fetching relevant images from Pexels API"""
    
    def __init__(self, api_key: str = None):
        """
        Initialize the Pexels API service
        
        Args:
            api_key: Pexels API key, will use env var if not provided
        """
        self.api_key = api_key or os.getenv("PEXELS_API_KEY") or getattr(settings, "PEXELS_API_KEY", "")
        self.base_url = "https://api.pexels.com/v1"
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Log initialization but without exposing the API key
        has_key = bool(self.api_key)
        logger.info(f"PexelsImageService initialized with API key: {'Present' if has_key else 'Missing'}")
    
    def search_images(self, query: str, count: int = 5, orientation: str = "landscape") -> List[Dict[str, Any]]:
        """
        Search for images related to the query
        
        Args:
            query: Search term
            count: Number of images to return
            orientation: Image orientation (landscape, portrait, square)
            
        Returns:
            List of image data dictionaries with urls and attribution info
        """
        try:
            response = requests.get(
                f"{self.base_url}/search",
                headers=self.headers,
                params={
                    "query": query,
                    "per_page": count,
                    "orientation": orientation
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Pexels API error: {response.status_code} - {response.text}")
                return []
            
            data = response.json()
            
            # Get the rate limit info for logging
            limit = response.headers.get('X-Ratelimit-Limit')
            remaining = response.headers.get('X-Ratelimit-Remaining')
            reset = response.headers.get('X-Ratelimit-Reset')
            
            logger.info(f"Pexels API rate limits - Limit: {limit}, Remaining: {remaining}, Reset: {reset}")
            
            # Transform the response into our simplified format
            images = []
            for photo in data.get("photos", []):
                images.append({
                    "id": photo.get("id"),
                    "width": photo.get("width"),
                    "height": photo.get("height"),
                    "url": photo.get("url"),  # Original Pexels page URL
                    "alt": photo.get("alt", query),  # Alt text or default to query
                    "photographer": {
                        "name": photo.get("photographer"),
                        "url": photo.get("photographer_url"),
                    },
                    "src": {
                        "original": photo.get("src", {}).get("original"),
                        "large": photo.get("src", {}).get("large"),
                        "medium": photo.get("src", {}).get("medium"),
                        "small": photo.get("src", {}).get("small"),
                        "portrait": photo.get("src", {}).get("portrait"),
                        "landscape": photo.get("src", {}).get("landscape"),
                        "tiny": photo.get("src", {}).get("tiny"),
                    }
                })
            
            return images
        
        except Exception as e:
            logger.error(f"Error searching Pexels images: {str(e)}")
            return []
    
    def get_random_image(self, query: Optional[str] = None, orientation: str = "landscape") -> Dict[str, Any]:
        """
        Get a random image, optionally related to a query
        
        Args:
            query: Optional search term
            orientation: Image orientation preference
            
        Returns:
            Image data dictionary or empty dict if none found
        """
        if query:
            images = self.search_images(query, count=10, orientation=orientation)
            if images:
                return random.choice(images)
        
        # If no query or no results from search, use curated photos
        try:
            response = requests.get(
                f"{self.base_url}/curated",
                headers=self.headers,
                params={"per_page": 15}
            )
            
            if response.status_code != 200:
                logger.error(f"Pexels curated API error: {response.status_code}")
                return {}
            
            data = response.json()
            photos = data.get("photos", [])
            
            if not photos:
                return {}
                
            photo = random.choice(photos)
            
            return {
                "id": photo.get("id"),
                "width": photo.get("width"),
                "height": photo.get("height"),
                "url": photo.get("url"),
                "alt": photo.get("alt", "Featured image"),
                "photographer": {
                    "name": photo.get("photographer"),
                    "url": photo.get("photographer_url"),
                },
                "src": {
                    "original": photo.get("src", {}).get("original"),
                    "large": photo.get("src", {}).get("large"),
                    "medium": photo.get("src", {}).get("medium"),
                    "small": photo.get("src", {}).get("small"),
                    "portrait": photo.get("src", {}).get("portrait"),
                    "landscape": photo.get("src", {}).get("landscape"),
                    "tiny": photo.get("src", {}).get("tiny"),
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting random Pexels image: {str(e)}")
            return {}
    
    def generate_attribution_html(self, image_data: Dict[str, Any]) -> str:
        """
        Generate proper HTML attribution for Pexels as required by their guidelines
        
        Args:
            image_data: Image data from Pexels API
            
        Returns:
            HTML string with proper attribution
        """
        if not image_data:
            return ""
            
        photographer = image_data.get("photographer", {})
        photographer_name = photographer.get("name", "")
        photographer_url = photographer.get("url", "")
        image_url = image_data.get("url", "")
        
        # Generate attribution HTML
        attribution = '<div class="image-attribution">'
        
        # If we have photographer info
        if photographer_name and photographer_url:
            attribution += f'Photo by <a href="{photographer_url}" target="_blank" rel="noopener">{photographer_name}</a> '
        
        # Add Pexels attribution (required)
        attribution += f'on <a href="{image_url}" target="_blank" rel="noopener">Pexels</a>'
        attribution += '</div>'
        
        return attribution
    
    def download_image(self, image_data: Dict[str, Any], size: str = "medium") -> Optional[bytes]:
        """
        Download image data from Pexels
        
        Args:
            image_data: Image data from Pexels API
            size: Image size to download (original, large, medium, small, etc.)
            
        Returns:
            Image data as bytes or None if download failed
        """
        if not image_data or not image_data.get("src"):
            return None
            
        # Get URL for requested size
        url = image_data.get("src", {}).get(size)
        
        # Fall back to other sizes if requested size is not available
        if not url:
            for fallback_size in ["large", "medium", "small", "original"]:
                url = image_data.get("src", {}).get(fallback_size)
                if url:
                    break
        
        if not url:
            logger.error("No image URL available to download")
            return None
            
        try:
            response = requests.get(url, stream=True)
            
            if response.status_code != 200:
                logger.error(f"Error downloading image: {response.status_code}")
                return None
                
            return response.content
            
        except Exception as e:
            logger.error(f"Error downloading image: {str(e)}")
            return None


class AltTextGenerator:
    """Service for generating alt text for images using OpenAI"""
    
    def __init__(self):
        """Initialize the AltTextGenerator with OpenAI API key."""
        self.api_key = getattr(settings, 'OPENAI_API_KEY', '')
        if not self.api_key:
            logger.warning("No OpenAI API key provided. Alt text generation will use default text.")
            self.client = None
            return

        try:
            from openai import OpenAI
            # Simple initialization without additional parameters
            self.client = OpenAI()
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            self.client = None
    
    def generate_alt_text(self, blog_content, title, keywords=None):
        """Generate alt text for an image based on blog content."""
        if not self.client:
            logger.warning("OpenAI client not initialized. Using default alt text.")
            return f"Featured image for {title}"

        try:
            prompt = self._create_alt_text_prompt(blog_content, title, keywords)
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that generates concise, descriptive alt text for blog post featured images."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Error generating alt text: {e}")
            return f"Featured image for {title}"

    def _create_alt_text_prompt(self, blog_content, title, keywords=None):
        """Create a prompt for generating alt text."""
        prompt = f"Generate a concise, descriptive alt text for a blog post titled '{title}'. "
        if keywords:
            prompt += f"The main keywords are: {', '.join(keywords)}. "
        prompt += "The alt text should be clear, informative, and SEO-friendly, but not too long."
        return prompt

    def generate_image_description(self, blog_content: str, max_length: int = 300) -> str:
        """
        Generate a detailed image description based on blog content
        
        Args:
            blog_content: The content of the blog post
            max_length: Maximum length of the description
            
        Returns:
            Detailed image description for AI image generation
        """
        if not self.client:
            # Return basic description if OpenAI is not available
            truncated_content = blog_content[:500] + "..." if len(blog_content) > 500 else blog_content
            return f"Create an image showing concepts from: {truncated_content}"
            
        try:
            # Create a prompt for image description generation
            prompt = f"""
            Based on the following blog content, generate a detailed description for an image that would be perfect as the featured image.
            The description should be detailed enough for an AI image generator to create a compelling, relevant image.
            
            Blog content (excerpt):
            {blog_content[:3000]}...
            
            Create a detailed description that:
            - Captures the main theme of the blog
            - Includes specific visual elements to include
            - Specifies style (photorealistic, illustration, etc.)
            - Mentions colors, lighting, and mood
            - Is under {max_length} characters
            
            Return ONLY the image description with no additional commentary.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a specialized AI that creates detailed image descriptions for generating blog featured images."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            # Get description from response
            description = response.choices[0].message.content.strip()
            
            # Ensure it's not too long
            if len(description) > max_length:
                description = description[:max_length-3] + "..."
                
            return description
            
        except Exception as e:
            logger.error(f"Error generating image description: {str(e)}")
            # Return basic description as fallback
            truncated_content = blog_content[:500] + "..." if len(blog_content) > 500 else blog_content
            return f"Create an image showing concepts from: {truncated_content}" 