from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.hotel_repository import HotelRepository
from schemas.hotel_schema import HotelCreate, HotelBase


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

    def get_hotel_from_room(self, hotel_id: int):
        try:
            hotel_model = self.repository.find_hotel_by_id(hotel_id)
            return HotelBase(**hotel_model.__dict__)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def find_hotel_by_id(self, hotel_id: int):
        return self.repository.find_hotel_by_id(hotel_id)

    def find_city_by_name(self, city_name: str, limit: int):
        return self.repository.find_city_by_name(city_name, limit)