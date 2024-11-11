import json
from http import HTTPStatus

from fastapi import APIRouter, Depends, Response, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

import service.auth as _auth
from config.database import get_db
from schemas.user_auth_schema import UserOutput, UserInput, Token, VerifyCode, SignInInput, UserOtpOutput, \
    ResetPasswordInput
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

@router.get("/confirm-mail/{token}")
async def confirm_mail(token: str, session: Session = Depends(get_db)) -> Response:
    _token_service = TokenService(session)
    _token_service.activate_user(token)

    return Response(status_code=HTTPStatus.OK)

@router.get("/sign-in")
def sign_in(log_in_form: SignInInput, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _service.find_by_username_and_password(log_in_form.user, log_in_form.pswd)
    user.access = True
    token = _auth.generate_token(user)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

# FORGOT PASSWORD STEPS
# 1. generate the otp for reset password
@router.post("/forgot-password")
def forgot_password(email: str, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)

    user = _service.forgot_password(email)
    user_otp_out = UserOtpOutput(**user.__dict__)
    token = _auth.generate_token(user_otp_out)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

# 2. validate the otp
@router.post("/validate-otp")
def validate_otp(verify_code: VerifyCode, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)
    _token_service = TokenService(session)

    user = _token_service.verify_code(verify_code.otp.lstrip().upper(), verify_code.token)

    user_output = UserOutput(**user.__dict__)
    user_output.access = True

    token = _auth.generate_token(user_output)

    return Response(
        content=json.dumps(jsonable_encoder(token)),
        media_type="application/json",
        status_code=status.HTTP_201_CREATED
    )

# 3. change password
@router.put("/reset-password")
def password_reset(data: ResetPasswordInput, session: Session = Depends(get_db)) -> Response:
    _service = UserAuthService(session)

    _service.reset_password(data)

    return Response(
        content=json.dumps({"message": "Password changed successfully"}),
        media_type="application/json",
        status_code=HTTPStatus.OK
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


