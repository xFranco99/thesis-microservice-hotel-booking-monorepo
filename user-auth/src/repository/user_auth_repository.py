from sqlalchemy.orm import Session
from models.user_auth import UserAuth
from schemas.user_auth_schema import UserInput, UserOutput
from typing import List, Optional, Type
from pydantic import UUID4


class UserAuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data: UserInput) -> UserOutput:
        user = UserAuth(**data.model_dump(exclude_none=True))
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return UserOutput(**user.__dict__)

    def get_all(self) -> List[Optional[UserOutput]]:
        users = self.session.query(UserAuth).all()
        return [UserOutput(**user.__dict__) for user in users]