from decimal import Decimal
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.booking_repository import BookingRepository
from schemas.hotel_schema import BookingCreate


class BookingService:
    def __init__(self, session: Session):
        self.repository = BookingRepository(session)

    def create_booking(self, data: BookingCreate, total_price: Decimal):
        try:
            return self.repository.create_booking(data, total_price)
        except SQLAlchemyError as e:
            raise HTTPException(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {str(e.__dict__['orig'])} while creating hotel"
            )

    def find_booking_by_id(self, booking_id: int):
        return self.repository.find_booking_by_id(booking_id)

    def find_bookings_not_expired_by_user_id(self, id_user: int):
        return self.repository.find_bookings_not_expired_by_user_id(id_user)

    def find_bookings_expired_by_user_id(self, id_user: int):
        return self.repository.find_bookings_expired_by_user_id(id_user)

    def remove_booking(self, booking_id: int):
        return self.repository.delete_booking_by_booking_id(booking_id)

    def mark_booking_as_cancelled(self, booking_id: int, refund: bool):
        return self.repository.mark_booking_as_cancelled(booking_id, refund)