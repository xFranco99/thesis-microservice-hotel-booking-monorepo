from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pydantic.v1 import UUID4
from sqlalchemy.orm import Session

from config.env_var import EnvVar
from exceptions.unauthorized_exception import UnauthorizedException
from repository.user_auth_repository import UserAuthRepository
from schemas.user_auth_schema import Token
from utils.date_util import convert_datetime_to_timestamp

SECRET_KEY = EnvVar.SECRET_KEY
ALGORITHM = EnvVar.ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = convert_datetime_to_timestamp(data.copy())

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_token(data):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data=data.__dict__, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

class TokenService:
    def __init__(self, session: Session):
        self.repository = UserAuthRepository(session)

    def verify_code(self, code: str, token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]):
        credentials_exception = UnauthorizedException("Could not validate otp")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            id_user: UUID4 = payload.get("id_user")
            if id_user is None:
                raise credentials_exception
        except InvalidTokenError:
            raise credentials_exception

        user = self.repository.find_by_id(id_user)

        if user.tmp_access_code_expiration > datetime.now() and user.tmp_access_code == code:
            return user

        raise credentials_exception

    def get_current_user(self, token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]):
        credentials_exception = UnauthorizedException("Could not validate credentials")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            access: str = payload.get("access")
            if access is None or access == False:
                raise credentials_exception
            id_user: UUID4 = payload.get("id_user")
            if id_user is None:
                raise credentials_exception
        except InvalidTokenError:
            raise credentials_exception

        user = self.repository.find_by_id(id_user)

        if user is None:
            raise credentials_exception
        return user

    def activate_user(self, token: Annotated[str, Depends(OAuth2PasswordBearer(tokenUrl="token"))]):
        credentials_exception = UnauthorizedException("Could not validate credentials")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            id_user: UUID4 = payload.get("id_user")
            if id_user is None:
                raise credentials_exception
        except InvalidTokenError:
            raise credentials_exception

        self.repository.update_state(id_user)