from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    session_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Chat Session {self.session_id}"

class ChatMessage(models.Model):
    session_id = models.CharField(max_length=50)
    content = models.TextField()
    is_user_message = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{'User' if self.is_user_message else 'AI'} message at {self.timestamp}" 