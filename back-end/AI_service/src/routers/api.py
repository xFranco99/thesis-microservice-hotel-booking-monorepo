from fastapi import APIRouter
from routers.v1 import ai_router

router = APIRouter(
    prefix="/api/v1"
)

router.include_router(ai_router.router)