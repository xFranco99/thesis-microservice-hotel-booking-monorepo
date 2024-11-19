from datetime import datetime

from sqlalchemy import and_
from sqlalchemy.orm import Session

from models.hotel_model import Booking
from schemas.hotel_schema import BookingCreate, BookingOut, BookingRoomOut


class BookingRepository:
    def __init__(self, session: Session):
        self.session= session

    def create_booking(self, data: BookingCreate):
        booking = Booking(**data.model_dump(exclude_none=True))

        self.session.add(booking)
        self.session.commit()
        self.session.refresh(booking)
        return BookingOut(**booking.__dict__)

    def find_bookings_not_expired_by_user_id(self, id_user: int):
        bookings = (
            self.session.query(Booking)
            .filter(
                and_(
                    Booking.user_id==id_user,
                    Booking.booked_from >= datetime.now(),
                    Booking.cancelled == False
                )
            ).all()
        )
        return [BookingRoomOut(**booking.__dict__) for booking in bookings]

    def find_bookings_expired_by_user_id(self, id_user: int):
        bookings = (
            self.session.query(Booking)
            .filter(
                and_(
                    Booking.user_id==id_user,
                    Booking.booked_to < datetime.now()
                )
            ).all()
        )
        return [BookingRoomOut(**booking.__dict__) for booking in bookings]