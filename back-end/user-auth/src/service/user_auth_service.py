import random
import string
from datetime import datetime, timedelta
from http import HTTPStatus
from http.client import responses
from typing import List, Annotated

import bcrypt
from fastapi import HTTPException, Depends
from pydantic import UUID4
from sqlalchemy.orm import Session

import service.auth as _auth
import clients.client as _client
from exceptions.unauthorized_exception import UnauthorizedException
from repository.user_auth_repository import UserAuthRepository
from schemas.user_auth_schema import UserInput, UserOutput, UserAuthComplete, MailInput, UserOtpOutput
from utils.password_util import get_password_hash

_get_password_hash = Annotated[str, Depends(get_password_hash)]

class UserAuthService:
    def __init__(self, session: Session):
        self.repository = UserAuthRepository(session)

    def create(self, data: UserInput):
        try:
            user =  self.repository.create(data)
        except:
            raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="user already exist")

        user_otp_out = UserOtpOutput(**user.__dict__)
        token = _auth.generate_token(user_otp_out)

        mail_input = MailInput()
        mail_input.subject = "Confirm your e-mail"
        mail_input.mail_to = data.email
        mail_input.username = data.username
        mail_input.token = token.access_token
        mail_input.caller_service = "user_auth_sign_up"
        mail_input.call_date = datetime.now()

        response = _client.confirm_mail_client(mail_input)

        if response.status_code != HTTPStatus.OK:
            self.repository.remove_by_id(user.id_user)
            raise HTTPException(status_code=response.status_code, detail=response.text)

    def get_all(self) -> List[UserOutput]:
        return self.repository.get_all()

    def find_by_id(self, id: UUID4) -> UserAuthComplete:
        return self.repository.find_by_id(id)

    def find_by_username_and_password(
            self, username_or_email: str, password: str
    ) -> UserOutput:

        user = self.repository.find_by_username_or_email(username_or_email)

        if not user:
            raise UnauthorizedException("User not found")

        if user.suspend_end_date and user.suspend_end_date > datetime.now():
            raise UnauthorizedException("Account is suspended")

        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise UnauthorizedException("Invalid password")

        # generate a 6 char code like: U911K4
        code_generator = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(6))
        user.tmp_access_code = code_generator
        user.tmp_access_code_expiration = datetime.now() + timedelta(minutes=5)

        mail_input = MailInput()
        mail_input.subject = "OTP LogIn HotelBooking"
        mail_input.mail_to = user.email
        mail_input.username = user.username
        mail_input.otp_code = user.tmp_access_code
        mail_input.caller_service = "user_auth_sign_in"
        mail_input.call_date = datetime.now()


        response = _client.otp_mail_client(mail_input)

        if response.status_code != HTTPStatus.OK:
            raise HTTPException(status_code=response.status_code, detail="Mail Error")

        if self.repository.update_otp(user) != 1:
            raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail="Update failed")

        return UserOutput(**user.__dict__)
