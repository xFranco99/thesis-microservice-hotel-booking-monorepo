from fastapi import APIRouter
from routers.v1 import hotel_router, booking_router, photo_router, room_router, service_router

router = APIRouter(
    prefix="/api/v1"
)

router.include_router(hotel_router.router)
router.include_router(booking_router.router)
router.include_router(photo_router.router)
router.include_router(room_router.router)
router.include_router(service_router.router)