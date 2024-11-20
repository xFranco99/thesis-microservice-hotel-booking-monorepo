import json

import httpx
from fastapi.encoders import jsonable_encoder

from config.env_var import EnvVar
from schemas.mail_schema import RefundMailInput, ReservationMailInfo
from schemas.user_schema import UserOutput


def send_refund_mail(mail_input: RefundMailInput):
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/send-confirmed-refund-mail"
    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))

    return response

def get_user_from_id(id_user: int):
    callback_url = EnvVar.AUTH_SERVICE_BASE_URL + "/api/v1/auth/get-info-from-id"
    params = {'user_id': id_user}
    response = httpx.get(callback_url, params=params)

    content = json.loads(response.content)

    return UserOutput(**content)

def send_reservation_mail(mail_input: ReservationMailInfo):
    callback_url = EnvVar.MAIL_SERVICE_BASE_URL + "/api/v1/mail/send-reservation-mail"
    response = httpx.post(callback_url, json=jsonable_encoder(mail_input))

    return response
