from http import HTTPStatus
from fastapi import HTTPException

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.hotel_repository import HotelRepository
from schemas.hotel_schema import HotelCreate


class HotelService:
    def __init__(self, session: Session):
        self.repository = HotelRepository(session)

    def create_hotel(self, data: HotelCreate):
        try:
            return self.repository.create_hotel(data)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )