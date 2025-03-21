from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a UserProfile for every new user."""
    if created:
        try:
            UserProfile.objects.create(user=instance)
            logger.info(f"Created research profile for user: {instance.username}")
        except Exception as e:
            logger.error(f"Error creating research profile for user {instance.username}: {str(e)}")

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Ensure UserProfile is saved when User is saved."""
    try:
        if not hasattr(instance, 'research_profile'):
            UserProfile.objects.create(user=instance)
            logger.info(f"Created missing research profile for user: {instance.username}")
        instance.research_profile.save()
    except Exception as e:
        logger.error(f"Error saving research profile for user {instance.username}: {str(e)}") 