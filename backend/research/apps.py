from django.apps import AppConfig

class ResearchConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'research'

    def ready(self):
        import research.signals  # Register signals 