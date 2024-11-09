from fastapi import APIRouter
from routers.v1 import mail_router

router = APIRouter(
    prefix="/api/v1"
)

router.include_router(mail_router.router)