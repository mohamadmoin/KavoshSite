#!/usr/bin/env python
"""
Test script to verify JSON extraction from deepseek responses.
This can be used to check that our extraction logic works correctly.
Run with: python test_deepseek_extraction.py
"""

import json
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Sample deepseek responses with different formats
sample_responses = [
    # Sample 1: Thinking section followed by JSON
    """<think>
    This is the thinking process of the AI model.
    It shouldn't be part of the output.
    Just some internal reasoning.
    </think>
    
    ```json
    {
        "title": "Sample Blog Post",
        "content": "<p>This is a sample blog post.</p>",
        "excerpt": "A brief summary",
        "meta_title": "Sample Blog Post Title",
        "meta_description": "This is a sample blog post description",
        "focus_keywords": "sample, test",
        "categories": ["Test", "Sample"],
        "tags": ["API", "Testing"]
    }
    ```""",
    
    # Sample 2: Thinking section followed by direct JSON
    """<think>
    Another thinking process.
    </think>
    {
        "title": "Another Sample",
        "content": "<p>Another sample content.</p>",
        "excerpt": "Another summary",
        "meta_title": "Another Title",
        "meta_description": "Another description",
        "focus_keywords": "another, test",
        "categories": ["Another"],
        "tags": ["Test"]
    }""",
    
    # Sample 3: Just JSON
    """{
        "title": "Simple JSON",
        "content": "<p>Simple content.</p>",
        "excerpt": "Simple summary",
        "meta_title": "Simple Title",
        "meta_description": "Simple description",
        "focus_keywords": "simple, test",
        "categories": ["Simple"],
        "tags": ["Test"]
    }"""
]

def extract_json_from_response(content):
    """
    Extract JSON from various response formats.
    Replicates the logic in our AI service.
    """
    # Check if the response has a <think> section
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
                
                logger.info(f"Extracted content after </think>. Preview: {json_content[:50]}...")
                return json.loads(json_content)
            else:
                logger.error("Found <think> tag but couldn't locate closing </think> tag")
        except Exception as e:
            logger.error(f"Error processing <think> tags: {str(e)}")
    
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

def main():
    print("Testing JSON extraction from deepseek responses\n")
    
    for i, sample in enumerate(sample_responses):
        print(f"\n=== Sample {i+1} ===")
        print(f"Original (first 100 chars): {sample[:100]}...")
        
        try:
            result = extract_json_from_response(sample)
            if result:
                print(f"Successfully extracted JSON: {json.dumps(result, indent=2)[:100]}...")
                print(f"Title: {result.get('title')}")
                print(f"Number of fields: {len(result)}")
            else:
                print("Failed to extract JSON")
        except Exception as e:
            print(f"Error during extraction: {str(e)}")

if __name__ == "__main__":
    main() 