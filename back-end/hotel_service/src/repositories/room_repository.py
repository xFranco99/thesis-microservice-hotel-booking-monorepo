from sqlalchemy.orm import Session

from models.hotel_model import Room
from schemas.hotel_schema import RoomCreate, RoomOut, RoomBase


class RoomRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_room(self, data: RoomCreate):
        room = Room(**data.model_dump(exclude_none=True))

        self.session.add(room)
        self.session.commit()
        self.session.refresh(room)

        return RoomOut(**room.__dict__)

    def find_room_by_room_number(self, room_number: int):
        room = self.session.query(Room).filter(Room.room_number == room_number).first()
        return RoomOut(**room.__dict__)

    def find_room_by_hotel_id(self, hotel_id: int):
        rooms = self.session.query(Room).filter(Room.hotel_id == hotel_id).all()
        return [RoomBase(**room.__dict__) for room in rooms]