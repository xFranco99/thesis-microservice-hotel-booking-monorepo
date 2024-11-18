from sqlalchemy.orm import Session

from models.hotel_model import Room
from schemas.hotel_schema import RoomCreate, RoomOut


class RoomRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_room(self, data: RoomCreate):
        room = Room(**data.model_dump(exclude_none=True))

        self.session.add(room)
        self.session.commit()
        self.session.refresh(room)

        return RoomOut(**room.__dict__)