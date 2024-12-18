import json
from http import HTTPStatus

from fastapi import APIRouter, Depends, Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import BookingCreate
from services.coss_services import CrossServices
from utils.pdf_util import generate_booking_pdf
from utils.card_util import mask_card_pan

router = APIRouter(
    prefix="/booking",
    tags=["booking"]
)

@router.post("/book-an-hotel")
def book_an_hotel(data: BookingCreate, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    data.credit_card_no = mask_card_pan(data.credit_card_no)

    booking = _cross_service.create_booking(data)

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

@router.get("/get-expired-user-booking/{id_user}")
def get_expired_user_bookings(id_user: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    bookings = _cross_service.find_expired_booking_by_id_user(id_user)

    return Response(
        content=json.dumps(jsonable_encoder(bookings)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("get-booking-by-id/{booking_id}")
def get_booking_by_id(booking_id: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    bookings = _cross_service.find_booking_by_id(booking_id)

    return Response(
        content=json.dumps(jsonable_encoder(bookings)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("get-booking-pdf-by-id/{booking_id}")
def get_booking_by_id(booking_id: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    booking = _cross_service.find_booking_by_id(booking_id)

    pdf_buffer = generate_booking_pdf(booking)

    file_name = f"booking_{booking.booking_id}_{booking.booked_from}_{booking.booked_to}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline; filename=" + file_name}
    )

@router.delete("/reservation-revoke")
def reservation_revoke(booking_id: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    _cross_service.revoke_reservation(booking_id)

    return Response(
        status_code=HTTPStatus.OK
    )