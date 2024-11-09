from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user_auth_schema import UserOutput, UserInput, UserAuthComplete, Token
from service.auth import TokenService
from service.user_auth_service import UserAuthService
from fastapi.encoders import jsonable_encoder
import json

import service.auth as _auth

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/sign-up", status_code=201, response_model=UserOutput)
def sign_up(
        data: UserInput,
        session: Session = Depends(get_db)
) -> Response:
    user = UserAuthService(session).create(data)
    token = _auth.get_token_from_login(user)

    response = Response(
        content=json.dumps(token),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

    return response

@router.get("/sign-in")
def sign_in(session: Session = Depends(get_db), user: str = "", pswd: str = "") -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _service.find_by_username_and_password(user, pswd)

    token = _auth.get_token_from_login(user)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

@router.post("/get-info-from-token", response_model=UserOutput)
def get_info_from_token(
        token: Token,
        session: Session = Depends(get_db)
) -> Response:
    _token_service = TokenService(session)

    user_complete = _token_service.get_current_user(token.access_token)

    user_output = UserOutput(**user_complete.__dict__)

    return Response(
        content=json.dumps(jsonable_encoder(user_output)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )


