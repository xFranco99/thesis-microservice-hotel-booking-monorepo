from http import HTTPStatus

from fastapi import HTTPException

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.room_repository import RoomRepository
from schemas.hotel_schema import RoomCreate


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