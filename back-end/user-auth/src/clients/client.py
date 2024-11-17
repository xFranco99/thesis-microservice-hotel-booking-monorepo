import httpx
from fastapi.encoders import jsonable_encoder

from config.env_var import EnvVar
from costants.costant import CONFIRMED_TEMPLATE_NAME
from schemas.user_auth_schema import MailInput

def otp_mail_client(mail_input: MailInput):
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/otp-mail"
    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))

    return response

def confirm_mail_client(mail_input: MailInput):
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/send-confirmation-mail"
    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))

    return response

def get_confirmation_mail():
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/get-template-by-name/" + CONFIRMED_TEMPLATE_NAME
    response = httpx.get(callback_url)

    return response