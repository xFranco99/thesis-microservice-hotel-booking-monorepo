from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.booking_repository import BookingRepository
from schemas.hotel_schema import BookingCreate


class BookingService:
    def __init__(self, session: Session):
        self.repository = BookingRepository(session)

    def create_booking(self, data: BookingCreate):
        try:
            return self.repository.create_booking(data)
        except SQLAlchemyError as e:
            raise HTTPException(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def find_bookings_not_expired_by_user_id(self, id_user: int):
        return self.repository.find_bookings_not_expired_by_user_id(id_user)

    def find_bookings_expired_by_user_id(self, id_user: int):
        return self.repository.find_bookings_expired_by_user_id(id_user)