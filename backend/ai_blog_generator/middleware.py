class TestingMiddleware:
    """
    Middleware to set a testing flag on requests during tests.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if we're in a test environment
        if 'test' in request.META.get('PATH_INFO', ''):
            request.testing = True
        else:
            request.testing = False
        
        return self.get_response(request) 