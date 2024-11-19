from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class MailInput(BaseModel):
    subject: Optional[str] = None
    mail_to: Optional[str] = None
    username: Optional[str] = None
    otp_code: Optional[str] = None
    token: Optional[str] = None
    caller_service: Optional[str] = None
    call_date: Optional[datetime] = None

class RefundMailInput(MailInput):
    refund_amount: Optional[Decimal] = None
    booking_id: Optional[int] = None