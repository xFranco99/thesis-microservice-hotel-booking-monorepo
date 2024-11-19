from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

from typing_extensions import Optional


class MailInput(BaseModel):
    subject: str
    mail_to: str
    username: str
    otp_code: str | None = None
    token: str | None = None
    caller_service: str
    call_date: datetime

class TemplateInput(BaseModel):
    description: str
    template_name: str
    template: str

class TemplateComplete(BaseModel):
    id: int
    description: str
    template_name: str
    template: str
    insert_date: datetime
    update_date: datetime
    delete: bool

class RefundMailInput(MailInput):
    refund_amount: Optional[Decimal]
    booking_id: int

