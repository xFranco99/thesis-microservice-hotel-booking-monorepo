import jinja2
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from sqlalchemy.orm import Session

from config.env_var import EnvVar
from config.mail_config import conf
from costants.costant import MAIL_OTP_TEMPLATE_NAME, MAIL_CONFIRMATION_TEMPLATE_NAME, URL_CONFIRM_MAIL, \
    MAIL_CONFIRMED_REFUND, MAIL_CONFIRMED_RESERVATION
from exceptions.mail_history_exception import CanNotStoreHistoryException
from repositories.mail_hisory_repository import MailHistoryRepository
from repositories.template_repository import TemplateRepository
from schemas.mail_schema import TemplateInput, MailInput, RefundMailInput, ReservationMailInfo


async def send_email_async(subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype='html',
    )

    fm = FastMail(conf)
    await fm.send_message(message, template_name='email.html')

class TemplateService:
    def __init__(self, session: Session):
        self.template_repository = TemplateRepository(session)
        self.mail_history_repository = MailHistoryRepository(session)

    def create_template(self, template_input: TemplateInput):
        self.template_repository.create_template(template_input)

    def send_background_email(
            self,
            background_tasks: BackgroundTasks,
            mail_info: MailInput,
            template_data: dict,
            template_name: str
    ):
        template = self.template_repository.find_by_template_name(template_name)

        html_body = jinja2.Template(template.template)
        email_body = html_body.render(**template_data)

        message = MessageSchema(
            subject=mail_info.subject,
            recipients=[mail_info.mail_to],
            body=email_body,
            subtype='html',
        )

        fm = FastMail(conf)

        is_saved = self.mail_history_repository.create_history(mail_info, template.id)

        if not is_saved:
            raise CanNotStoreHistoryException

        background_tasks.add_task(
            fm.send_message, message, None)

    def send_email_otp_background(
            self,
            background_tasks: BackgroundTasks,
            mail_info: MailInput
    ):
        template_data = {'username': mail_info.username, 'code': mail_info.otp_code}

        self.send_background_email(background_tasks, mail_info, template_data, MAIL_OTP_TEMPLATE_NAME)


    def send_email_confirm_mail_background(
            self,
            background_tasks: BackgroundTasks,
            mail_info: MailInput
    ):
        url = URL_CONFIRM_MAIL + mail_info.token
        template_data = {'username': mail_info.username, 'url': url}

        self.send_background_email(background_tasks, mail_info, template_data, MAIL_CONFIRMATION_TEMPLATE_NAME)

    def send_confirmed_refund_mail(
            self,
            background_tasks: BackgroundTasks,
            mail_info: RefundMailInput
    ):
        template_data = {
            'booking_id': mail_info.booking_id,
            'refund_amount': mail_info.refund_amount
        }

        mail_info_fixed = MailInput(**mail_info.__dict__)

        self.send_background_email(background_tasks, mail_info_fixed, template_data, MAIL_CONFIRMED_REFUND)

    def send_reservation_mail(
            self,
            background_tasks: BackgroundTasks,
            mail_info: ReservationMailInfo
    ):
        template_data = {
            'guest_name': mail_info.guest_name,
            'hotel_name': mail_info.hotel_name,
            'check_in': mail_info.check_in,
            'check_out': mail_info.check_out,
            'adults_no': mail_info.adults_no,
            'childs_no': mail_info.childs_no,
            'room_type': mail_info.room_type,
            'booking_id': mail_info.booking_id,
            'hotel_address': mail_info.hotel_address,
            'url': EnvVar.FRONT_END_LOG_IN_URL
        }

        mail_info_fixed = MailInput(**mail_info.__dict__)

        self.send_background_email(background_tasks, mail_info_fixed, template_data, MAIL_CONFIRMED_RESERVATION)

    def find_template_by_name(self, template_name: str) -> str:
        template = self.template_repository.find_by_template_name(template_name)

        html_body = jinja2.Template(template.template)
        template_data = {'url': EnvVar.FRONT_END_LOG_IN_URL}

        email_body = html_body.render(**template_data)

        return email_body