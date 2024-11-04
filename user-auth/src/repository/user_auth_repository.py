from datetime import datetime

from sqlalchemy.orm import Session
from models.user_auth import UserAuth, Role, State
from schemas.user_auth_schema import UserInput, UserOutput, UserAuthComplete
from typing import List, Optional, Type
import utils.password_util as psw_util
from pydantic import UUID4

class UserAuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data: UserInput) -> UserOutput:
        user = UserAuth(**data.model_dump(exclude_none=True))

        user.password = psw_util.get_password_hash(user.password)

        user.insert_date = datetime.now()
        user.update_date = user.insert_date

        user.state = State.CREATED if Role.USER == user.role else State.ACTIVE

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return UserOutput(**user.__dict__)

    def get_all(self) -> List[Optional[UserOutput]]:
        users = self.session.query(UserAuth).all()
        return [UserOutput(**user.__dict__) for user in users]

    def find_by_username_or_mail(self, user_or_mail: str) -> UserAuthComplete:
        user = (self.session.query(UserAuth)
                .filter(UserAuth.username == user_or_mail | UserAuth.email == user_or_mail)
                .first())

        return UserAuthComplete(**user.__dict__)