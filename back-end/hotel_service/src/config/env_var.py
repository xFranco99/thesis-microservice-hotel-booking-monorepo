import os

class EnvVar:
    # Database Settings
    DATABASE_URL = os.environ['DB_URL']

    # Services base URLs
    MAIL_SERVICE_BASE_URL = os.environ['MAIL_SERVICE_BASE_URL']
    AUTH_SERVICE_BASE_URL = os.environ['AUTH_SERVICE_BASE_URL']