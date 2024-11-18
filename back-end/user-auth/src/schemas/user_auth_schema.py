from datetime import datetime
from email.policy import default
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

class Role(str, Enum):
    USER = 'USER'
    ADMIN = 'ADMIN'
    MANAGER = 'MANAGER'

class State(str, Enum):
    CREATED = 'CREATED'
    ACTIVE = 'ACTIVE'
    SUSPEND = 'SUSPEND'
    DELETED = 'DELETED'

class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserInput(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserInputUpdate(BaseModel):
    username: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    phone_number: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    role:  Optional[Role] = Field(default=None)

class SignInInput(BaseModel):
    username: str
    password: str

class UserOutput(BaseModel):
    id_user: int
    username: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserOtpOutput(BaseModel):
    id_user: int
    email: str
    access: bool = False

class UserAuthComplete(BaseModel):
    id_user: int
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role
    insert_date: datetime
    update_date: datetime
    state: State
    tmp_access_code: str | None
    tmp_access_code_expiration: datetime | None
    suspend_end_date: datetime | None

class ResetPasswordInput(BaseModel):
    new_password: str

class VerifyCode(BaseModel):
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class MailInput(BaseModel):
    subject: str | None = None
    mail_to: str | None = None
    username: str | None = None
    otp_code: str | None = None
    token: str | None = None
    caller_service: str | None = None
    call_date: datetime = datetime.now()