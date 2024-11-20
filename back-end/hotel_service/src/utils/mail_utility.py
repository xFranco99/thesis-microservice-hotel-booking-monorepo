from datetime import datetime

from schemas.mail_schema import MailInput
from schemas.user_schema import UserOutput


def generate_base_mail_info(user_info: UserOutput):

    mail_info = MailInput()
    mail_info.subject = "Refund confirmed - Hotel"
    mail_info.mail_to = user_info.email
    mail_info.username = user_info.username
    mail_info.call_date = datetime.now()
    mail_info.caller_service = "hotel_service"

    return mail_info