from datetime import datetime
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.room_repository import RoomRepository
from schemas.hotel_schema import RoomCreate, RoomCreateList, RoomCreateListOut, RoomBase


class RoomServiceLogic:
    def __init__(self, session: Session):
        self.repository = RoomRepository(session)

    def create_room(self, data: RoomCreate):
        try:
            return self.repository.create_room(data)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def create_room_list(self, data: RoomCreateList):
        result = RoomCreateListOut()

        rooms_saved = []
        rooms_not_saved = []

        for room in data.room_list:
            room_base = RoomBase(**room.__dict__)
            try:
                self.create_room(room)
                rooms_saved.append(room_base)
            except HTTPException as e:
                rooms_not_saved.append(room_base)
                continue

        result.rooms_created = rooms_saved
        result.rooms_not_created = rooms_not_saved

        return result

    def find_room_by_room_number(self, room_number: int):
        return self.repository.find_room_by_room_number(room_number)

    def find_room_by_hotel_id(self, hotel_id: int):
        return self.repository.find_room_by_hotel_id(hotel_id)

    def search_room_not_booked(
            self,
            city: str,
            date_from: datetime,
            date_to: datetime,
            total_guests: int,
            page: int,
            page_size: int
    ):

        return self.repository.search_room_not_booked(city, date_from, date_to, total_guests, page, page_size)