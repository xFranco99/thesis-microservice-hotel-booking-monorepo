from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db
from services.booking_service import BookingService
from services.hotel_service import HotelService
from services.photo_service import PhotoService
from services.room_service import RoomServiceLogic
from services.service_service import ServiceServiceLogic


def get_all_services(session: Session = Depends(get_db)):
    _booking_service = BookingService(session)
    _hotel_service = HotelService(session)
    _photo_service = PhotoService(session)
    _room_service = RoomServiceLogic(session)
    _services_service = ServiceServiceLogic(session)

    return _booking_service, _hotel_service, _photo_service, _room_service, _services_service