#!/usr/bin/env python
"""
This script tests token authentication and the Groq API.
Run this script from the backend directory with:
python test_auth.py <token>
"""

import sys
import os
import django
import json
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cmsbackend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

def test_token(token_key):
    """Test if the token is valid and get the associated user."""
    print(f"\n----- Testing Token: {token_key[:5]}... -----")
    
    try:
        token = Token.objects.get(key=token_key)
        print(f"✓ Token exists in database")
        print(f"✓ Associated user: {token.user.username} (ID: {token.user.id})")
        print(f"✓ Token created: {token.created}")
        return token.user
    except Token.DoesNotExist:
        print("✗ Token does not exist in database")
        
        # Check if any tokens exist
        all_tokens = Token.objects.all()
        if all_tokens.exists():
            print(f"  Info: {all_tokens.count()} tokens exist in the database")
            for t in all_tokens:
                print(f"  - Token: {t.key[:5]}... for user: {t.user.username}")
        else:
            print("  Info: No tokens exist in the database")
        return None

def test_groq_api():
    """Test if the Groq API is working."""
    print("\n----- Testing Groq API -----")
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("✗ GROQ_API_KEY not found in environment variables")
        return False
    
    print(f"✓ GROQ_API_KEY found (starts with {groq_api_key[:5]}...)")
    
    # Test the API connection
    url = "https://api.groq.com/openai/v1/models"
    headers = {
        "Authorization": f"Bearer {groq_api_key}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            models = response.json()
            print(f"✓ Connected to Groq API successfully")
            print(f"✓ Available models: {[model['id'] for model in models['data']]}")
            return True
        else:
            print(f"✗ Failed to connect to Groq API: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error connecting to Groq API: {str(e)}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_auth.py <token>")
        return
    
    token_key = sys.argv[1]
    
    # Test 1: Check token
    user = test_token(token_key)
    
    # Test 2: Check Groq API
    groq_working = test_groq_api()
    
    # Print summary
    print("\n----- Summary -----")
    if user:
        print("✓ Token is valid")
    else:
        print("✗ Token is not valid")
    
    if groq_working:
        print("✓ Groq API is working")
    else:
        print("✗ Groq API is not working")
    
    # Overall status
    if user and groq_working:
        print("\n✅ All systems are working correctly! Authentication and Groq API are functional.")
    else:
        issues = []
        if not user:
            issues.append("token authentication")
        if not groq_working:
            issues.append("Groq API access")
        
        print(f"\n❌ There are issues with: {', '.join(issues)}")
        print("Please check the detailed output above for more information.")

if __name__ == "__main__":
    main() 