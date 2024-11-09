import os

class EnvVar:
    # Database Settings
    DATABASE_URL = os.environ['DB_URL']

    # JWT token Settings
    SECRET_KEY = os.environ['SECRET_KEY']  # openssl rand -hex 32
    ALGORITHM = os.environ['ALGORITHM']