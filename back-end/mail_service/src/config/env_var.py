import os

class EnvVar:
    # Database Settings
    DATABASE_URL = os.environ['DB_URL']

    # Services Base Urls
    AUTH_SERVICE_BASE_URL = os.environ['AUTH_SERVICE_BASE_URL']
    FRONT_END_LOG_IN_URL = os.environ['FRONT_END_LOG_IN_URL']

    # Mail Settings
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIN_FROM_NAME')