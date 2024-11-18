from sqlalchemy.orm import Session, joinedload

from models.hotel_model import Booking, Room, RoomService
from schemas.hotel_schema import BookingCreate, BookingOut


class BookingRepository:
    def __init__(self, session: Session):
        self.session= session

    def create_booking(self, data: BookingCreate):
        booking = Booking(**data.model_dump(exclude_none=True))

        self.session.add(booking)
        self.session.commit()
        self.session.refresh(booking)
        return BookingOut(**booking.__dict__)

    def find_bookings_by_user_id(self, id_user: int):
        bookings = (
            self.session.query(Booking)
            .filter(Booking.user_id == id_user)
            .options(
                joinedload(Booking.hotel),  # Eager load associated hotel
                joinedload(Booking.room).joinedload(Room.photos),  # Eager load room and its photos
                joinedload(Booking.room).joinedload(Room.roomservices).joinedload(RoomService.service),
                # Eager load room services and associated service details
            )
            .first()
        )
        return BookingOut(**bookings.__dict__)