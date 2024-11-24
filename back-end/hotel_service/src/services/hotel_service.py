import math
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.hotel_model import Hotel
from repositories.hotel_repository import HotelRepository
from schemas.hotel_schema import HotelCreate, HotelBase, HotelOut


class HotelService:
    def __init__(self, session: Session):
        self.repository = HotelRepository(session)

    def create_hotel(self, data: HotelCreate):
        try:
            hotel = Hotel(**data.model_dump(exclude_none=True))
            hotel_saved = self.repository.create_hotel(hotel)
            return HotelOut(**hotel_saved.__dict__)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def update_hotel(self, data: HotelCreate, id_hotel: int):
        try:
            hotel = Hotel(**data.model_dump(exclude_none=True))
            return self.repository.update_hotel(hotel, id_hotel)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while updating hotel"
            )

    def delete_hotel(self, id_hotel: int):
        try:
            self.repository.delete_hotel(id_hotel)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while deleting hotel"
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

    def find_hotel_by_name_or_city_or_address(
            self,
            hotel_name: str,
            hotel_city: str,
            hotel_address: str,
            page: int,
            page_size: int
    ):
        hotels, hotels_total_number = (
            self.repository.find_hotel_by_name_or_city_or_address(
                hotel_name,
                hotel_city,
                hotel_address,
                page,
                page_size
            )
        )

        return [HotelOut(**hotel.__dict__) for hotel in hotels], math.ceil(hotels_total_number / page_size)


    def find_city_by_name(self, city_name: str, limit: int):
        return self.repository.find_city_by_name(city_name, limit)