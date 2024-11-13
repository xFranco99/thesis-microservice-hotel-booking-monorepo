from datetime import datetime

from sqlalchemy.orm import Session

from models.mail_model import MailHistory
from schemas.mail_schema import MailInput


class MailHistoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_history(self, mail_info: MailInput, id_template: int) -> bool:
        mail = MailHistory(**mail_info.model_dump(exclude_none=True, exclude={"username", "otp_code", "token"}))

        mail.id_template = id_template
        mail.send_date = datetime.now()

        self.session.add(mail)
        self.session.commit()
        self.session.refresh(mail)

        return True