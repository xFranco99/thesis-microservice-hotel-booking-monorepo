from typing import List
from fastapi import HTTPException
from pydantic import UUID4
from sqlalchemy.orm import Session
from repository.user_auth_repository import UserAuthRepository
from schemas.user_auth_schema import UserInput, UserOutput

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

    def find_by_username_or_mail(self, user_or_mail: str):
        return self.repository.find_by_username_or_mail(user_or_mail)