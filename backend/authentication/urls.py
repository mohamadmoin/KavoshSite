from django.urls import path
from .views import RegisterView
from cmsbackend.views import CustomObtainAuthToken, RegenerateAuthToken

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('token/regenerate/', RegenerateAuthToken.as_view(), name='token_regenerate'),
] 