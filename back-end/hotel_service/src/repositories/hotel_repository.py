from sqlalchemy.orm import Session

from models.hotel_model import Hotel
from schemas.hotel_schema import HotelCreate, HotelOut


class HotelRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_hotel(self, data: HotelCreate):
        hotel = Hotel(**data.model_dump(exclude_none=True))

        self.session.add(hotel)
        self.session.commit()
        self.session.refresh(hotel)
        return HotelOut(**hotel.__dict__)

    def find_hotel_by_id(self, hotel_id: int) -> Hotel:
        return self.session.query(Hotel).filter(Hotel.hotel_id==hotel_id).first()