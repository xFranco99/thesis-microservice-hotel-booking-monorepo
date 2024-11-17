import json
from http import HTTPStatus

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from starlette.responses import Response

from config.database import get_db
from schemas.mail_schema import MailInput, TemplateInput
from services.mail_service import TemplateService

router = APIRouter(
    prefix="/mail",
    tags=["mail"]
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

@router.post("/otp-mail")
def otp_login_mail(
        background_tasks: BackgroundTasks,
        mail_info: MailInput,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.send_email_otp_background(
        background_tasks,
        mail_info
    )

    return Response(status_code=HTTPStatus.OK)

@router.post("/send-confirmation-mail")
def send_confirmation_mail(
        background_tasks: BackgroundTasks,
        mail_info: MailInput,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.send_email_confirm_mail_background(
        background_tasks,
        mail_info
    )

    return Response(status_code=HTTPStatus.OK)

@router.get("/get-template-by-name/{template_name}")
def get_template_by_name(
        template_name: str,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    html = _template_service.find_template_by_name(template_name)

    return Response(
        content=json.dumps({"html": html}),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )