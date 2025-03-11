import logging
import json
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        # Log request details
        logger.info(f"Auth token request received - headers: {request.headers}")
        
        # Extract fields
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            logger.warning("Missing username or password in token request")
            return Response(
                {"detail": "Both username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        if user:
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Token {'created' if created else 'retrieved'} for user {username}")
            return Response({'token': token.key})
        else:
            logger.warning(f"Failed authentication attempt for username {username}")
            return Response(
                {"detail": "Unable to log in with provided credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

class RegenerateAuthToken(APIView):
    """
    Regenerate auth token for the current user.
    This will invalidate the existing token and create a new one.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Delete existing token
        Token.objects.filter(user=request.user).delete()
        
        # Create new token
        token = Token.objects.create(user=request.user)
        
        return Response({'token': token.key}) 