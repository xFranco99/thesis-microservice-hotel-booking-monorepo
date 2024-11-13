from datetime import datetime

from sqlalchemy.orm import Session
from models.user_auth import UserAuth, Role, State
from schemas.user_auth_schema import UserInput, UserOutput, UserAuthComplete
from typing import List, Optional
import utils.password_util as psw_util
from pydantic import UUID4
from sqlalchemy import or_, and_

class UserAuthRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data: UserInput) -> UserOutput:
        user = UserAuth(**data.model_dump(exclude_none=True))

        user.password = psw_util.get_password_hash(user.password)

        user.insert_date = datetime.now()
        user.update_date = user.insert_date

        user.state = State.CREATED if str(Role.USER) == str(user.role) else State.ACTIVE

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return UserOutput(**user.__dict__)

    def update_password(self, id_user: UUID4, new_password: str):
        new_password_hashed = psw_util.get_password_hash(new_password)

        row_updated = (
            self.session.query(UserAuth)
            .filter_by(id_user=id_user)
            .update(dict(
                    password=new_password_hashed,
                    update_date=datetime.now()
                )
            )
        )

        if row_updated == 1:
            self.session.commit()
        else:
            self.session.close()

        return row_updated

    def update_otp(self, data: UserAuthComplete):
        row_updated = (self.session.query(UserAuth)
            .filter_by(id_user=data.id_user)
            .update(
               dict(
                   tmp_access_code=data.tmp_access_code,
                   tmp_access_code_expiration=data.tmp_access_code_expiration
               )
           )
        )

        if row_updated == 1:
            self.session.commit()
        else:
            self.session.close()

        return row_updated

    def update_state(self, id_user: UUID4):
        row_updated = self.session.query(UserAuth).filter_by(id_user=id_user).update(dict(state=State.ACTIVE))

        if row_updated == 1:
            self.session.commit()
        else:
            self.session.close()

        return row_updated

    def remove_by_id(self, id_user: UUID4):
        self.session.query(UserAuth).filter_by(id_user=id_user).delete()
        self.session.commit()

    def get_all(self) -> List[Optional[UserOutput]]:
        users = self.session.query(UserAuth).all()
        return [UserOutput(**user.__dict__) for user in users]

    def find_by_id(self, id: UUID4) -> UserAuthComplete:
        user = self.session.query(UserAuth).filter(UserAuth.id_user == id).first()
        return UserAuthComplete(**user.__dict__)

    def find_by_username_or_email(self, logic_id: str) -> Optional[UserAuthComplete]:
        user = (
            self.session.query(UserAuth)
            .filter(
                or_(
                    UserAuth.username == logic_id,
                    UserAuth.email == logic_id
                )
            )
            .filter(
                and_(
                    UserAuth.state != State.DELETED,
                    UserAuth.state != State.CREATED
                )
            )
            .first()
        )

        return UserAuthComplete(**user.__dict__) if user else None