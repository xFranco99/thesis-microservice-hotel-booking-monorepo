import json
from http import HTTPStatus

from fastapi import APIRouter, Depends, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import BookingCreate
from services.booking_service import BookingService
from services.coss_services import CrossServices

router = APIRouter(
    prefix="/booking",
    tags=["booking"]
)

@router.post("/book-an-hotel")
def book_an_hotel(data: BookingCreate, session: Session = Depends(get_db)) -> Response:
    _booking_service = BookingService(session)

    booking = _booking_service.create_booking(data)

    return Response(
        content=json.dumps(jsonable_encoder(booking)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-active-user-booking/{id_user}")
def get_active_user_bookings(id_user: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    bookings = _cross_service.find_active_booking_by_id_user(id_user)

    return Response(
        content=json.dumps(jsonable_encoder(bookings)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )