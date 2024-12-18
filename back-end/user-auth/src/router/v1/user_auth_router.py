import json
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, Response, status, Header
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette.responses import HTMLResponse

import service.auth as _auth
from config.database import get_db
from schemas.user_auth_schema import UserOutput, UserInput, Token, VerifyCode, SignInInput, UserOtpOutput, \
    ResetPasswordInput, UserInputUpdate
from service.auth import TokenService
from service.user_auth_service import UserAuthService

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/sign-up", status_code=201, response_model=UserOutput)
def sign_up(
        data: UserInput,
        session: Session = Depends(get_db)
) -> Response:
    UserAuthService(session).create(data)

    response = Response(status_code=status.HTTP_201_CREATED)

    return response

@router.get("/confirm-mail/{token}", response_class=HTMLResponse)
async def confirm_mail(token: str, session: Session = Depends(get_db)):
    _token_service = TokenService(session)
    html = _token_service.activate_user(token)

    return html

@router.post("/sign-in")
def sign_in(log_in_form: SignInInput, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _service.find_by_username_and_password(log_in_form.username, log_in_form.password)
    token = _auth.generate_token(user)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

# FORGOT PASSWORD STEPS
# 1. generate the otp for reset password
@router.post("/access-with-code")
def access_with_code(email: str, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)

    user = _service.forgot_password(email)
    user_otp_out = UserOtpOutput(**user.__dict__)
    user_otp_out.id_user = None

    token = _auth.generate_token(user_otp_out)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

# 2. validate the otp
@router.post("/validate-otp")
def validate_otp(
        verify_code: VerifyCode,
        authorization: Annotated[str | None, Header()] = None,
        session: Session = Depends(get_db)
) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _token_service.verify_code(verify_code.otp.lstrip().upper(), authorization)

    user_output = UserOutput(**user.__dict__)

    token = _auth.generate_token(user_output)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

# 3. change password
@router.put("/reset-password")
def password_reset(
        data: ResetPasswordInput,
        authorization: Annotated[str | None, Header()] = None,
        session: Session = Depends(get_db)
) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _token_service.get_current_user(authorization)
    _service.reset_password(data, user.id_user)

    return Response(
        content=json.dumps({"message": "Password changed successfully"}),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-info-from-token", response_model=UserOutput)
def get_info_from_token(
        authorization: Annotated[str | None, Header()] = None,
        session: Session = Depends(get_db)
) -> Response:
    _token_service = TokenService(session)

    user_complete = _token_service.get_current_user(authorization)

    user_output = UserOutput(**user_complete.__dict__)

    return Response(
        content=json.dumps(jsonable_encoder(user_output)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

@router.get("/get-info-from-id", response_model=UserOutput)
def get_info_from_token(
        user_id: int,
        session: Session = Depends(get_db)
) -> Response:
    _token_service = TokenService(session)

    user_complete = _token_service.find_user_by_id(user_id)

    user_output = UserOutput(**user_complete.__dict__)

    return Response(
        content=json.dumps(jsonable_encoder(user_output)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

@router.patch("/edit-user")
def edit_user(
        data: UserInputUpdate,
        authorization: Annotated[str | None, Header()] = None,
        session: Session = Depends(get_db)
) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user_complete = _token_service.get_current_user(authorization)
    _service.update_user(user_complete.id_user, data)

    return Response(
        content=json.dumps({"message": "User updated successfully"}),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )