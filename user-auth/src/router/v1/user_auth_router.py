from typing import List

from fastapi import APIRouter, Depends
from pydantic import UUID4
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user_auth_schema import UserOutput, UserInput
from service.user_auth_service import UserAuthService

router = APIRouter(
    prefix="/auth",
    tags=["location"]
)

@router.post("/sign-up", status_code=201, response_model=UserOutput)
def sign_up(
        data: UserInput,
        session: Session = Depends(get_db)
):
    _service = UserAuthService(session)
    return _service.create(data)

@router.get("")
def get_all_users(session: Session = Depends(get_db)) -> List[UserOutput]:
    _service = UserAuthService(session)
    return _service.get_all()