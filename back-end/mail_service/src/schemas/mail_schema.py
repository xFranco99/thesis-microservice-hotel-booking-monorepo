from pydantic import BaseModel
from enum import Enum
from datetime import datetime

class SendTypeEnum(str, Enum):
    SYNC = 'SYNC'
    ASYNC = 'ASYNC'

class MailInput(BaseModel):
    subject: str
    email_to: str
    username: str
    otp_code: str
    caller: str
    call_date: datetime

