import httpx
import json

from fastapi.encoders import jsonable_encoder
from schemas.user_auth_schema import MailInput
from config.env_var import EnvVar

def mail_client(mail_input: MailInput):
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/auth/otp-login-mail"
    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))

    return response