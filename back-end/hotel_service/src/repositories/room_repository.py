from datetime import datetime

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from models.hotel_model import Room, Booking, Hotel
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
            .outerjoin(Booking, Room.room_number == Booking.room_number)  # Outer join to include rooms without bookings
            .filter(
                and_(
                    # Match city and guest capacity
                    Hotel.hotel_city == city,
                    Room.bed_number >= total_guests,

                    or_(
                        # Not booked
                        Room.room_number.notin_(
                            self.session.query(Booking.room_number).subquery()
                        ),

                        # Booked outside the given period
                        Booking.booked_to < date_from,
                        Booking.booked_from > date_to,

                        # Booked but cancelled
                        and_(
                            or_(
                                and_(
                                    Booking.booked_from >= date_from,
                                    Booking.booked_from <= date_to
                                ),
                                and_(
                                    Booking.booked_to >= date_from,
                                    Booking.booked_to <= date_to
                                )
                            ),
                            Booking.cancelled.is_(True)
                        )
                    )
                )
            )
            .offset(offset_value)
            .limit(page_size)
            .all()
        )

        return [RoomOut(**room.__dict__) for room in rooms]