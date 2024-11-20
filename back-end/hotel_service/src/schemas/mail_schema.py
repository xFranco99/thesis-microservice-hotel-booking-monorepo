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

class ReservationMailInfo(MailInput):
    guest_name: Optional[str] = None
    hotel_name: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    adults_no: Optional[str] = None
    childs_no: Optional[str] = None
    room_type: Optional[str] = None
    booking_id: Optional[int] = None
    hotel_address: Optional[str] = None