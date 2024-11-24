from datetime import datetime

from sqlalchemy import and_, or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.hotel_model import Room, Booking, Hotel
from schemas.hotel_schema import RoomCreate, RoomOut, RoomBase, RoomPatch
from utils.object_util import obj_to_dict_non_none


class RoomRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_room(self, data: RoomCreate):
        room = Room(**data.model_dump(exclude_none=True))

        self.session.add(room)
        self.session.commit()
        self.session.refresh(room)

        return RoomOut(**room.__dict__)

    def update_room(self, data: RoomPatch, room_id: int):
        room = Room(**data.model_dump(exclude_none=True))
        try:
            self.session.query(Room).filter_by(room_id=room_id).update(obj_to_dict_non_none(room))
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)

    def find_room_by_room_id(self, room_id: int):
        room = self.session.query(Room).filter(Room.room_id == room_id).first()
        return RoomOut(**room.__dict__)

    def find_room_by_room_number(self, hotel_id: int, room_number: int):
        rooms = self.session.query(Room).filter(
            and_(
                Room.hotel_id == hotel_id,
                or_(room_number is None, Room.room_number==room_number)
            )
        ).all()
        return [RoomOut(**room.__dict__) for room in rooms]

    def find_room_by_hotel_id(self, hotel_id: int):
        rooms = self.session.query(Room).filter(Room.hotel_id == hotel_id).all()
        return [RoomBase(**room.__dict__) for room in rooms]

    def count_associated_rooms(self, hotel_id: int):
        return self.session.query(Room).filter_by(hotel_id = hotel_id).count()

    def search_room_not_booked(
            self,
            city: str,
            date_from: datetime,
            date_to: datetime,
            total_guests: int,
            page: int,
            page_size: int
    ):
        offset_value = (page - 1) * page_size

        rooms = (
            self.session.query(Room)
            .join(Hotel, Room.hotel_id == Hotel.hotel_id)
            .outerjoin(Booking, Room.room_id == Booking.room_id)
            .filter(
                and_(
                    # Match city and guest capacity
                    Hotel.hotel_city == city,
                    Room.bed_number >= total_guests,

                    or_(
                        # Not booked
                        Booking.booking_id.is_(None),

                        # Booked outside the given period
                        or_(
                            Booking.booked_to < date_from,
                            Booking.booked_from > date_to
                        )
                    )
                )
            )
            .offset(offset_value)
            .limit(page_size)
            .all()
        )

        return [RoomOut(**room.__dict__) for room in rooms]

    def delete_room(self, room_id: int):
        try:
            self.session.query(Room).filter_by(room_id=room_id).delete()
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)