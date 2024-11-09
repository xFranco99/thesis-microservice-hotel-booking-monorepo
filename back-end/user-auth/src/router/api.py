from fastapi import APIRouter
from router.v1 import user_auth_router

router = APIRouter(
    prefix="/api/v1"
)

router.include_router(user_auth_router.router)