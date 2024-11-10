from http import HTTPStatus

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from starlette.responses import Response

import services.mail_service as _services
from config.database import get_db
from schemas.mail_schema import MailInput, TemplateInput
from services.mail_service import TemplateService

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

OTP_LOGIN = ""

@router.post("/save-template")
def save_template(
        template_input: TemplateInput,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)
    _template_service.create_template(template_input)

    return Response(status_code=HTTPStatus.OK)

@router.post("/otp-login-mail")
def otp_login_mail(
        background_tasks: BackgroundTasks,
        mail_info: MailInput,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.send_email_background(
        background_tasks,
        mail_info
    )

    return Response(status_code=HTTPStatus.OK)