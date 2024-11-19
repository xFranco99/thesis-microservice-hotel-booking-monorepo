import httpx
from fastapi.encoders import jsonable_encoder

from config.env_var import EnvVar

#def send_refund_mail(mail_input: MailInput):
#    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/otp-mail"
#    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))
#
#    return response
