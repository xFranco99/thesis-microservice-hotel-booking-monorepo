import json
from http import HTTPStatus

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette.responses import Response

from config.database import get_db
from schemas.mail_schema import MailInput, TemplateInput, RefundMailInput, ReservationMailInfo, TemplatePatchInput
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

@router.post("/send-confirmed-refund-mail")
def send_confirmed_refund_mail(
        mail_info: RefundMailInput,
        background_tasks: BackgroundTasks,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.send_confirmed_refund_mail(
        background_tasks,
        mail_info
    )

    return Response(status_code=HTTPStatus.OK)

@router.post("/send-reservation-mail")
def send_reservation_mail(
        mail_info: ReservationMailInfo,
        background_tasks: BackgroundTasks,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.send_reservation_mail(
        background_tasks,
        mail_info
    )

    return Response(status_code=HTTPStatus.OK)

@router.delete("/delete-mail-template/{template_id}")
def delete_template(template_id: int, session: Session = Depends(get_db)) -> Response:
    _template_service = TemplateService(session)

    _template_service.delete_template_by_id(template_id)

    return Response(status_code=HTTPStatus.OK)

@router.patch("/update-mail-template/{template_id}")
def update_template(
        template_id: int,
        data: TemplatePatchInput,
        session: Session = Depends(get_db)
) -> Response:
    _template_service = TemplateService(session)

    _template_service.update_template_by_id(template_id, data)

    return Response(status_code=HTTPStatus.OK)

@router.get("/get-all-mail-template")
def get_all_template(session: Session = Depends(get_db)) -> Response:
    _template_service = TemplateService(session)

    templates = _template_service.get_all_template()

    return Response(
        content=json.dumps(jsonable_encoder(templates)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )