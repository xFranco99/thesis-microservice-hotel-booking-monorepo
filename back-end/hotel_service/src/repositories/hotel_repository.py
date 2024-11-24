from sqlalchemy import and_, or_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.hotel_model import Hotel
from utils.object_util import obj_to_dict_non_none


class HotelRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_hotel(self, data: Hotel):
        try:
            self.session.add(data)
            self.session.commit()
            self.session.refresh(data)
            return data
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)

    def update_hotel(self, data: Hotel, hotel_id: int):
        try:
            self.session.query(Hotel).filter_by(hotel_id=hotel_id).update(obj_to_dict_non_none(data))
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)

    def delete_hotel(self, hotel_id: int):
        try:
            self.session.query(Hotel).filter_by(hotel_id=hotel_id).delete()
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)

    def find_hotel_by_id(self, hotel_id: int) -> Hotel:
        return self.session.query(Hotel).filter(Hotel.hotel_id==hotel_id).first()

    def find_city_by_name(self, city_name: str, limit: int):
        hotels = (
            self.session.query(Hotel)
            .filter(Hotel.hotel_city.like(f"{city_name}%"))
            .limit(limit).all()
        )
        return [hotel.hotel_city for hotel in hotels]

    def find_hotel_by_name_or_city_or_address(
            self,
            hotel_name: str,
            hotel_city: str,
            hotel_address: str,
            page: int,
            page_size: int
    ):
        offset_value = (page - 1) * page_size
        hotels = (
            self.session.query(Hotel)
            .filter(
                and_(
                    or_(hotel_name is None, Hotel.hotel_name.ilike(f"%{hotel_name}%")),
                    or_(hotel_address is None, Hotel.hotel_address.ilike(f"%{hotel_address}%")),
                    or_(hotel_city is None, Hotel.hotel_city == hotel_city)
                )
            )
            .offset(offset_value)
            .limit(page_size)
            .all()
        )

        hotels_total_number = self.session.query(Hotel).count()

        return hotels, hotels_total_number