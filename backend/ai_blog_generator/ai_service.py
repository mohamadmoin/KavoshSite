import os
import json
import logging
import re
from typing import Dict, List, Optional, Tuple, Any

import aiohttp
import requests
from django.conf import settings
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.db import IntegrityError
from groq import Groq

from blog.models import BlogPost, Category, Tag
from blog.services import BlogLinkEnhancer
from .models import AIBlogRequest, AIBlogGeneration, AIBlogBatchRequest

# Set up logger
logger = logging.getLogger(__name__)

class AIBlogGeneratorService:
    """
    Service for generating blog posts using AI.
    """
    def __init__(self, api_key: Optional[str] = None, auto_publish: bool = False):
        """
        Initialize the AI service with API key.
        
        Args:
            api_key: Optional API key for LLM service
            auto_publish: Whether to automatically publish generated posts (default: False)
        """
        # Try to use GROQ_API_KEY first, fallback to OPENAI_API_KEY
        self.api_key = api_key or os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
        
        # Option to auto-publish generated posts
        self.auto_publish = auto_publish or getattr(settings, 'AI_AUTO_PUBLISH_POSTS', False)
        
        if self.auto_publish:
            logger.info("Auto-publish mode is enabled for generated blog posts")
        
        # Determine which API to use based on the available key
        if os.getenv("GROQ_API_KEY"):
            logger.info("Using Groq API with deepseek model")
            self.use_groq = True
            # Keep the direct API URL for reference, though we'll use the Groq client
            self.api_url = "https://api.groq.com/openai/v1/chat/completions"
            self.model = "deepseek-r1-distill-llama-70b"
        else:
            logger.info("Using OpenAI API")
            self.use_groq = False
            self.api_url = "https://api.openai.com/v1/chat/completions"
            self.model = "gpt-4o"
        
        # Set up API headers for direct HTTP requests (only used for OpenAI now)
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        logger.info(f"AI service initialized with model: {self.model}")
    
    def search_web(self, query: str) -> List[Dict[str, str]]:
        """
        Search the web for information related to the query.
        
        Args:
            query: The search query
            
        Returns:
            List of search results with title, url, and snippet
        """
        # This is a placeholder for actual web search implementation
        # In a real implementation, you would use a search API like Google Custom Search, Bing, etc.
        
        # Simulated search results
        return [
            {
                "title": f"Search result for: {query}",
                "url": "https://example.com/result1",
                "snippet": f"This is a snippet of information about {query}."
            },
            {
                "title": f"Another result for: {query}",
                "url": "https://example.com/result2",
                "snippet": f"More information about {query} and related topics."
            }
        ]
    
    def call_ai_service(self, prompt: str, topic: str, keywords: str = "", allow_web_search: bool = False) -> Dict[str, Any]:
        """
        Call the AI service to generate a blog post.
        
        Args:
            prompt: The prompt for generating the blog post
            topic: The main topic of the blog post
            keywords: Optional keywords for SEO
            allow_web_search: Whether to search the web for additional context
            
        Returns:
            Dictionary containing the generated blog post data
        """
        try:
            # Prepare context for AI
            context = {
                "prompt": prompt,
                "topic": topic,
                "keywords": keywords,
                "search_results": []
            }
            
            # If web search is allowed, get search results
            if allow_web_search:
                search_results = self.search_web(topic)
                context["search_results"] = search_results
            
            # Call the AI API
            generation_data = self._call_ai_api(context)
            
            if not generation_data:
                raise Exception("Failed to generate blog post content")
            
            return generation_data
            
        except Exception as e:
            logger.error(f"Error in call_ai_service: {e}")
            raise
    
    def generate_blog_post(self, request_id):
        """
        Generate a blog post for the given request ID.
        """
        try:
            # Get the request object
            request = AIBlogRequest.objects.get(id=request_id)
            
            # Update request status to processing
            request.status = 'processing'
            request.save()
            
            # Generate the blog post
            generation_data = self.call_ai_service(request.prompt, request.topic, request.keywords, request.allow_web_search)
            
            # Process the result
            if not generation_data:
                raise Exception("Failed to generate blog post content")
            
            # Process and save the generated content
            return self.process_generation_result(request_id, generation_data)
            
        except Exception as e:
            logger.error(f"Error generating blog post: {e}")
            
            # Update request status to failed
            try:
                request = AIBlogRequest.objects.get(id=request_id)
                request.status = 'failed'
                request.error_message = str(e)
                request.save()
            except Exception as inner_e:
                logger.error(f"Error updating request status: {inner_e}")
            
            # Re-raise the exception
            raise
    
    def _call_ai_api(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call the AI API to generate a blog post.
        
        Args:
            context: The context for the AI to use
            
        Returns:
            Dictionary containing the generated blog post
        """
        # Different prompts for different models
        if self.use_groq:
            # Special prompt for deepseek model to avoid thinking sections
            system_message = """
            You are an expert SEO content writer tasked with creating a high-quality blog post optimized for search engines.
            
            VERY IMPORTANT: Your response MUST be a valid JSON object WITHOUT any <think> tags, markdown code blocks, or explanations.
            
            The blog post should include:
            1. An engaging title
            2. Well-structured content with proper HTML styling:
               - Use heading tags (<h2>, <h3>) for section titles
               - Use paragraph tags (<p>) for text blocks
               - Use <strong> and <em> for emphasis
               - Create styled lists with <ul> and <ol> with proper <li> items
               - Include styled blockquotes using <blockquote> for important quotes
               - Add proper spacing between sections
               - Use <div class="info-box"> for important information
               - Use <div class="highlight-box"> for highlighting key points
               - Include <figure> with <img> and <figcaption> for images
               - Use <code> tags for code examples where relevant
            3. A compelling meta description
            4. Relevant keywords naturally incorporated throughout the text
            5. Include 3-5 potential internal linking opportunities by emphasizing key topic phrases
               - Identify important topical phrases that could link to other blog posts
               - Don't create actual links, just identify good candidates for linking
               - The system will automatically create links post-generation
            
            Respond ONLY with the following JSON format and nothing else:
            {
                "title": "The blog post title",
                "content": "The full HTML content of the blog post with proper styling",
                "excerpt": "A brief summary of the blog post (150-160 characters)",
                "meta_title": "SEO-optimized title (50-60 characters)",
                "meta_description": "SEO-optimized description (150-160 characters)",
                "focus_keywords": "Primary keywords for the post, comma separated",
                "categories": ["Category1", "Category2"],
                "tags": ["Tag1", "Tag2", "Tag3"]
            }
            """
        else:
            # Standard prompt for other models
            system_message = """
            You are an expert SEO content writer. Your task is to create a high-quality blog post that is optimized for search engines.
            The blog post should include:
            1. An engaging title
            2. Well-structured content with proper HTML styling:
               - Use heading tags (<h2>, <h3>) for section titles
               - Use paragraph tags (<p>) for text blocks
               - Use <strong> and <em> for emphasis
               - Create styled lists with <ul> and <ol> with proper <li> items
               - Include styled blockquotes using <blockquote> for important quotes
               - Add proper spacing between sections
               - Use <div class="info-box"> for important information
               - Use <div class="highlight-box"> for highlighting key points
               - Include <figure> with <img> and <figcaption> for images
               - Use <code> tags for code examples where relevant
            3. A compelling meta description
            4. Relevant keywords naturally incorporated throughout the text
            5. Include 3-5 potential internal linking opportunities by emphasizing key topic phrases
               - Identify important topical phrases that could link to other blog posts
               - Don't create actual links, just identify good candidates for linking
               - The system will automatically create links post-generation
            
            IMPORTANT: Your response must be ONLY a valid JSON object with the following fields:
            {
                "title": "The blog post title",
                "content": "The full HTML content of the blog post with proper styling",
                "excerpt": "A brief summary of the blog post (150-160 characters)",
                "meta_title": "SEO-optimized title (50-60 characters)",
                "meta_description": "SEO-optimized description (150-160 characters)",
                "focus_keywords": "Primary keywords for the post, comma separated",
                "categories": ["Category1", "Category2"],
                "tags": ["Tag1", "Tag2", "Tag3"]
            }
            
            DO NOT include any explanations, thinking process, or markdown code blocks before or after the JSON. 
            Just return the raw JSON object.
            """
        
        # Construct the user message based on the context
        user_message = f"Please write a blog post about: {context['topic']}\n\n"
        
        if context.get('prompt'):
            user_message += f"Additional instructions: {context['prompt']}\n\n"
        
        if context.get('keywords'):
            user_message += f"Please incorporate these keywords: {context['keywords']}\n\n"
        
        if context.get('search_results'):
            user_message += "Here are some search results you can use as references:\n\n"
            for result in context['search_results']:
                user_message += f"Title: {result['title']}\nURL: {result['url']}\nSnippet: {result['snippet']}\n\n"
        
        # Log which API we're using
        logger.info(f"Calling {'Groq' if self.use_groq else 'OpenAI'} API with model {self.model}")
        
        try:
            if self.use_groq:
                # Use the Groq client library for deepseek model
                client = Groq(api_key=self.api_key)
                
                # Prepare messages
                messages = [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ]
                
                # Call the API with the correct parameters
                completion = client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_completion_tokens=4000,
                    top_p=0.95,
                    stream=False
                )
                
                # Extract content from the response
                content = completion.choices[0].message.content
                
                # Log a sample of the content for debugging
                content_preview = content[:100] + '...' if len(content) > 100 else content
                logger.info(f"Received response from Groq API. Preview: {content_preview}")
                
            else:
                # Use the requests library for OpenAI
                # Prepare the API request
                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4000
                }
                
                response = requests.post(self.api_url, headers=self.headers, json=payload)
                if response.status_code != 200:
                    logger.error(f"API error: {response.text}")
                    return {}
                
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Log a sample of the content for debugging
                content_preview = content[:100] + '...' if len(content) > 100 else content
                logger.info(f"Received response from API. Preview: {content_preview}")
            
            # Process the content
            if '<think>' in content:
                logger.info("Detected <think> tags in response. Extracting actual content.")
                
                try:
                    # Find the position where </think> ends
                    think_end_match = re.search(r'</think>\s*', content)
                    if think_end_match:
                        think_end_pos = think_end_match.end()
                        json_content = content[think_end_pos:].strip()
                        
                        # If the remaining content starts with ```json and ends with ```, extract just the JSON
                        if json_content.startswith('```json') and '```' in json_content[7:]:
                            json_content = json_content[7:].split('```')[0].strip()
                        
                        logger.info(f"Extracted content after </think>. Preview: {json_content[:100]}...")
                        return json.loads(json_content)
                    else:
                        logger.error("Found <think> tag but couldn't locate closing </think> tag")
                except Exception as e:
                    logger.error(f"Error processing <think> tags: {str(e)}")
                    logger.error(f"Raw content: {content}")
            
            # If no think tags or extraction failed, try to parse the whole response
            try:
                # Check if the content is wrapped in ```json and ``` markers
                if content.strip().startswith('```json') and content.strip().endswith('```'):
                    # Extract the JSON part between the markers
                    json_content = content.strip()[7:-3].strip()
                    return json.loads(json_content)
                
                # Otherwise try to parse the entire content as JSON
                return json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response: {e}")
                logger.error(f"Content (first 200 chars): {content[:200]}")
                
                # Last resort: try to find any JSON object in the response using regex
                try:
                    json_pattern = r'\{[\s\S]*\}'
                    matches = re.findall(json_pattern, content)
                    if matches:
                        # Try each match until one parses successfully
                        for match in matches:
                            try:
                                return json.loads(match)
                            except:
                                continue
                
                    logger.error("Could not find valid JSON in the response using regex")
                except Exception as e:
                    logger.error(f"Error during regex extraction: {str(e)}")
                
                return {}
                        
        except Exception as e:
            logger.error(f"Error calling AI API: {str(e)}")
            return {}

    def process_generation_result(self, request_id, generation_data):
        """
        Process the AI-generated blog post result and save it to the database.
        """
        try:
            # Get the request object
            request = AIBlogRequest.objects.get(id=request_id)
            
            # Extract fields from the generation data
            title = generation_data.get('title', 'Untitled Blog Post')
            content = generation_data.get('content', '')
            excerpt = generation_data.get('excerpt', '')
            meta_title = generation_data.get('meta_title', title)
            meta_description = generation_data.get('meta_description', excerpt[:155] if excerpt else '')
            focus_keywords = generation_data.get('focus_keywords', '')
            
            # Get suggested categories and tags
            suggested_categories = generation_data.get('categories', [])
            suggested_tags = generation_data.get('tags', [])
            
            # Create a blog post if auto-publish is enabled
            blog_post = None
            if self.auto_publish:
                blog_post = BlogPost.objects.create(
                    title=title,
                    content=content,
                    excerpt=excerpt,
                    author=request.user,
                    status='draft',
                    meta_title=meta_title,
                    meta_description=meta_description,
                    focus_keywords=focus_keywords,
                    content_format='html'
                )
            
            # Create an AIBlogGeneration object
            generation = AIBlogGeneration.objects.create(
                request=request,
                blog_post=blog_post,
                title=title,
                content=content,
                excerpt=excerpt,
                meta_title=meta_title,
                meta_description=meta_description,
                focus_keywords=focus_keywords
            )
            
            # Add suggested categories and tags
            if suggested_categories:
                for category_name in suggested_categories:
                    category = self._get_or_create_category(category_name)
                    if category:
                        generation.suggested_categories.add(category)
                        
                        if blog_post:
                            blog_post.categories.add(category)
            
            if suggested_tags:
                for tag_name in suggested_tags:
                    tag = self._get_or_create_tag(tag_name)
                    if tag:
                        generation.suggested_tags.add(tag)
                        
                        if blog_post:
                            blog_post.tags.add(tag)
            
            # Enhance the blog post with internal links if it was created
            if blog_post:
                try:
                    # Create a link enhancer instance
                    link_enhancer = BlogLinkEnhancer()
                    
                    # First, rebuild the keyword index to include this new post
                    link_enhancer.rebuild_keyword_index()
                    
                    # Enhance this post with links to other posts
                    logger.info(f"Enhancing AI-generated blog post {blog_post.id} with internal links")
                    link_enhancer.enhance_post_links(blog_post.id, max_links=5)
                    
                    # Add a related posts section to the end of the content
                    related_posts_html = link_enhancer.generate_related_posts_html(blog_post.id)
                    if related_posts_html:
                        blog_post.content += "\n\n" + related_posts_html
                        blog_post.save(update_fields=['content'])
                        logger.info(f"Added related posts section to blog post {blog_post.id}")
                except Exception as e:
                    logger.error(f"Error enhancing blog post with links: {e}")
                    # Continue processing even if link enhancement fails
                
                # Now let's add a featured image using Pexels
                try:
                    from blog.services.image_service import PexelsImageService, AltTextGenerator
                    import os
                    from django.conf import settings
                    from django.core.files.base import ContentFile
                    from django.utils.text import slugify
                    
                    # Get API key from environment or settings
                    pexels_api_key = os.getenv("PEXELS_API_KEY") or getattr(settings, "PEXELS_API_KEY", "bzgxOI3o5rkIqWOyL8DDUEP2YALMxrMTBdGZdwdyGgPwlSzkYuRvF2gs")
                    
                    # Initialize services
                    image_service = PexelsImageService(api_key=pexels_api_key)
                    alt_text_generator = AltTextGenerator()
                    
                    # Generate search terms from keywords, title, and categories
                    search_terms = []
                    if focus_keywords:
                        search_terms.extend([k.strip() for k in focus_keywords.split(',') if k.strip()])
                    
                    # Add the most relevant category as a search term if available
                    if suggested_categories:
                        search_terms.append(suggested_categories[0])
                    
                    # Add words from title if we don't have enough terms
                    if len(search_terms) < 2:
                        title_words = [word for word in title.split() if len(word) > 4]
                        search_terms.extend(title_words[:2])
                    
                    # Use the first search term, or fall back to the title
                    primary_search_term = search_terms[0] if search_terms else title
                    
                    logger.info(f"Searching for image with term: {primary_search_term}")
                    
                    # Get an image related to the primary search term
                    image_data = image_service.get_random_image(primary_search_term)
                    
                    if image_data and image_data.get('src'):
                        # Generate alt text for the image based on the blog topic
                        alt_text_context = f"Blog post titled '{title}' about {focus_keywords or primary_search_term}"
                        alt_text = image_data.get('alt') or alt_text_generator.generate_alt_text(alt_text_context)
                        
                        # Download the image
                        image_bytes = image_service.download_image(image_data, size='large')
                        
                        if image_bytes:
                            # Create a name for the image file
                            image_filename = f"{slugify(primary_search_term)}-{image_data.get('id')}.jpg"
                            
                            # Save the image to the blog post
                            blog_post.featured_image.save(
                                image_filename,
                                ContentFile(image_bytes),
                                save=False  # Don't save yet, we'll do it with other changes
                            )
                            
                            # Generate attribution HTML
                            attribution_html = image_service.generate_attribution_html(image_data)
                            
                            # Add attribution to the end of the post content
                            if attribution_html and attribution_html not in blog_post.content:
                                blog_post.content += f"\n\n{attribution_html}"
                            
                            # Save all changes
                            blog_post.save()
                            
                            logger.info(f"Added featured image to blog post {blog_post.id} with alt text: {alt_text}")
                except Exception as e:
                    logger.error(f"Error adding featured image to blog post: {e}")
                    # Continue even if image addition fails
            
            # Update request status
            request.status = 'completed'
            request.save()
            
            return generation
            
        except Exception as e:
            logger.error(f"Error processing generation result: {e}")
            try:
                request = AIBlogRequest.objects.get(id=request_id)
                request.status = 'failed'
                request.error_message = str(e)
                request.save()
            except Exception as inner_e:
                logger.error(f"Error updating request status: {inner_e}")
            raise
    
    def _get_or_create_tag(self, tag_name):
        """
        Get or create a tag with the given name.
        """
        from blog.models import Tag
        
        tag_name = tag_name.strip()
        if not tag_name:
            return None
            
        # Try to find existing tag first
        tag_slug = slugify(tag_name)
        
        tag = Tag.objects.filter(slug=tag_slug).first()
        
        if tag:
            return tag
            
        # If it doesn't exist, create a new one with unique slug
        try:
            return Tag.objects.create(name=tag_name, slug=tag_slug)
        except IntegrityError:
            # Handle slug collision by adding a suffix
            base_slug = tag_slug
            counter = 1
            
            while counter <= 10:  # Prevent infinite loops
                try:
                    new_slug = f"{base_slug}-{counter}"
                    return Tag.objects.create(name=tag_name, slug=new_slug)
                except IntegrityError:
                    counter += 1
            
            # If we couldn't create a unique slug after several attempts, find an existing tag
            logger.warning(f"Failed to create unique slug for tag '{tag_name}' after 10 attempts")
            return Tag.objects.filter(name__iexact=tag_name).first() or Tag.objects.first()
                            
    def _get_or_create_category(self, category_name):
        """
        Get or create a category with the given name.
        """
        from blog.models import Category
        
        category_name = category_name.strip()
        if not category_name:
            return None
            
        # Try to find existing category first
        category_slug = slugify(category_name)
        
        category = Category.objects.filter(slug=category_slug).first()
        
        if category:
            return category
            
        # If it doesn't exist, create a new one with unique slug
        try:
            return Category.objects.create(name=category_name, slug=category_slug)
        except IntegrityError:
            # Handle slug collision by adding a suffix
            base_slug = category_slug
            counter = 1
            
            while counter <= 10:  # Prevent infinite loops
                try:
                    new_slug = f"{base_slug}-{counter}"
                    return Category.objects.create(name=category_name, slug=new_slug)
                except IntegrityError:
                    counter += 1
            
            # If we couldn't create a unique slug after several attempts, find an existing category
            logger.warning(f"Failed to create unique slug for category '{category_name}' after 10 attempts")
            return Category.objects.filter(name__iexact=category_name).first() or Category.objects.first()

    def generate_batch_blog_posts(self, batch_request_id):
        """
        Generate multiple related blog posts for the given batch request ID.
        """
        try:
            # Get the batch request object
            batch_request = AIBlogBatchRequest.objects.get(id=batch_request_id)
            
            # Update batch request status to processing
            batch_request.status = 'processing'
            batch_request.save()
            
            # First, generate a list of blog post ideas
            blog_ideas = self.generate_blog_post_ideas(
                batch_request.topic, 
                batch_request.description, 
                batch_request.num_posts
            )
            
            # Save the generated ideas to the batch request
            batch_request.generated_ideas = json.dumps(blog_ideas)
            batch_request.save()
            
            # Track successful and failed generations
            successful_generations = 0
            failed_generations = 0
            
            # Generate each blog post from the ideas
            for idea in blog_ideas:
                try:
                    # Create an individual request for this idea
                    blog_request = AIBlogRequest.objects.create(
                        user=batch_request.user,
                        topic=idea['title'],
                        prompt=f"{batch_request.prompt}\n\nThis post is part of a series about {batch_request.topic}.\n\nPost description: {idea['description']}",
                        keywords=batch_request.keywords,
                        allow_web_search=batch_request.allow_web_search,
                        parent_batch=batch_request
                    )
                    
                    # Generate the blog post
                    self.generate_blog_post(blog_request.id)
                    successful_generations += 1
                    
                except Exception as e:
                    logger.error(f"Error generating individual blog post for batch: {e}")
                    failed_generations += 1
            
            # Update batch request status based on results
            if failed_generations == len(blog_ideas):
                batch_request.status = 'failed'
                batch_request.error_message = f"All {len(blog_ideas)} blog post generations failed."
            elif successful_generations > 0:
                batch_request.status = 'completed'
                if failed_generations > 0:
                    batch_request.error_message = f"{failed_generations} out of {len(blog_ideas)} blog post generations failed."
            else:
                batch_request.status = 'failed'
                batch_request.error_message = "Failed to generate blog post ideas."
            
            batch_request.save()
            return batch_request
            
        except Exception as e:
            logger.error(f"Error in batch blog post generation: {e}")
            
            # Update batch request status to failed
            try:
                batch_request = AIBlogBatchRequest.objects.get(id=batch_request_id)
                batch_request.status = 'failed'
                batch_request.error_message = str(e)
                batch_request.save()
            except Exception as inner_e:
                logger.error(f"Error updating batch request status: {inner_e}")
            
            # Re-raise the exception
            raise
    
    def generate_blog_post_ideas(self, topic, description, num_posts=5):
        """
        Generate a list of blog post ideas related to a central topic.
        
        Args:
            topic: The main topic for the series of blog posts
            description: Description of what the series should cover
            num_posts: Number of blog post ideas to generate (default: 5)
            
        Returns:
            List of dictionaries with blog post titles and descriptions
        """
        try:
            # Prepare system prompt for idea generation
            system_message = """
            You are an expert content strategist specializing in creating cohesive series of blog posts.
            Your task is to create a list of related blog post ideas on a given topic.
            
            Each blog post idea should:
            1. Have a compelling, SEO-friendly title
            2. Include a brief description (2-3 sentences) of what the post will cover
            3. Be closely related to the main topic while covering different aspects
            4. Together form a comprehensive series that builds reader knowledge
            
            IMPORTANT: Your response must be ONLY a valid JSON array of objects with the following structure:
            [
                {
                    "title": "Compelling Blog Post Title",
                    "description": "Brief description of what this post will cover and why it's valuable."
                },
                // more post ideas...
            ]
            
            DO NOT include any explanations, thinking process, or markdown outside the JSON.
            Just return the raw JSON array.
            """
            
            # Construct the user message
            user_message = f"Please create {num_posts} blog post ideas for a series about: {topic}\n\n"
            
            if description:
                user_message += f"Series description: {description}\n\n"
            
            user_message += f"These posts should form a cohesive series that thoroughly covers different aspects of {topic}."
            
            # Log which API we're using
            logger.info(f"Generating blog post ideas using {'Groq' if self.use_groq else 'OpenAI'} API")
            
            # Call the AI API using the existing pattern
            if self.use_groq:
                client = Groq(api_key=self.api_key)
                
                # Prepare messages
                messages = [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ]
                
                # Call the API
                completion = client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_completion_tokens=4000,
                    top_p=0.95,
                    stream=False
                )
                
                # Extract content from the response
                content = completion.choices[0].message.content
                
            else:
                # Use the requests library for OpenAI
                payload = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": user_message}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4000
                }
                
                response = requests.post(self.api_url, headers=self.headers, json=payload)
                if response.status_code != 200:
                    logger.error(f"API error: {response.text}")
                    return []
                
                result = response.json()
                content = result['choices'][0]['message']['content']
            
            # Log a sample of the content for debugging
            content_preview = content[:100] + '...' if len(content) > 100 else content
            logger.info(f"Received blog ideas response. Preview: {content_preview}")
            
            # Process the content - similar to existing pattern but expecting an array
            try:
                # Check if the content is wrapped in ```json and ``` markers
                if content.strip().startswith('```json') and content.strip().endswith('```'):
                    # Extract the JSON part between the markers
                    json_content = content.strip()[7:-3].strip()
                    return json.loads(json_content)
                
                # Otherwise try to parse the entire content as JSON
                return json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON response for blog ideas: {e}")
                logger.error(f"Content (first 200 chars): {content[:200]}")
                
                # Last resort: try to find any JSON array in the response using regex
                try:
                    json_pattern = r'\[[\s\S]*\]'
                    matches = re.findall(json_pattern, content)
                    if matches:
                        # Try each match until one parses successfully
                        for match in matches:
                            try:
                                ideas = json.loads(match)
                                if isinstance(ideas, list) and len(ideas) > 0:
                                    return ideas
                            except:
                                continue
                
                    logger.error("Could not find valid JSON array in the response using regex")
                except Exception as e:
                    logger.error(f"Error during regex extraction: {str(e)}")
                
                return []
                        
        except Exception as e:
            logger.error(f"Error generating blog post ideas: {str(e)}")
            return []

# Create a singleton instance
ai_service = AIBlogGeneratorService(auto_publish=True)  # Enable auto-publishing by default 