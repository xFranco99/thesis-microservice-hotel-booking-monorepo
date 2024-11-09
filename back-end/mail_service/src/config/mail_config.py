from fastapi_mail import ConnectionConfig
from config.env_var import EnvVar

conf = ConnectionConfig(
    MAIL_USERNAME=EnvVar.MAIL_USERNAME,
    MAIL_PASSWORD=EnvVar.MAIL_PASSWORD,
    MAIL_FROM=EnvVar.MAIL_FROM,
    MAIL_PORT=EnvVar.MAIL_PORT,
    MAIL_SERVER=EnvVar.MAIL_SERVER,
    MAIL_FROM_NAME=EnvVar.MAIL_FROM_NAME,
    MAIL_SSL_TLS=True,
    MAIL_STARTTLS=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=r'G:\fork\thesis-microservice-hotel-booking-monorepo\back-end\mail_service\templates\email'
)