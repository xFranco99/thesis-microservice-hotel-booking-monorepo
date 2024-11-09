from datetime import datetime
from typing import List, Annotated, Tuple, Optional
from fastapi import HTTPException, Depends
from pydantic import UUID4
from sqlalchemy.orm import Session
from starlette import status
from exceptions.unauthorized_exception import UnauthorizedException
from repository.user_auth_repository import UserAuthRepository
from schemas.user_auth_schema import UserInput, UserOutput, UserAuthComplete
from utils.password_util import get_password_hash
import bcrypt

_get_password_hash = Annotated[str, Depends(get_password_hash)]

class UserAuthService:
    def __init__(self, session: Session):
        self.repository = UserAuthRepository(session)

    def create(self, data: UserInput) -> UserOutput:
        try:
            return self.repository.create(data)
        except:
            raise HTTPException(status_code=400, detail="user already exist")

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

        return UserOutput(**user.__dict__)
