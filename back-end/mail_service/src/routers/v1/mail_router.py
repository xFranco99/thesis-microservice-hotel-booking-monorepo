from http import HTTPStatus

from fastapi import APIRouter, BackgroundTasks
from starlette.responses import Response
from websockets.legacy.server import HTTPResponse

import services.mail_service as _services
from schemas.mail_schema import MailInput

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

OTP_LOGIN = ""

@router.get("/hello-world")
def hello_world():
    return "Hello World!"

@router.post("/otp-login-mail")
def otp_login_mail(background_tasks: BackgroundTasks, mail_info: MailInput) -> Response:

    _services.send_email_background(
        background_tasks,
        mail_info.subject,
        mail_info.email_to,
        {'username': mail_info.username, 'code': mail_info.otp_code, 'url': OTP_LOGIN}
    )

    return Response(status_code=HTTPStatus.OK)