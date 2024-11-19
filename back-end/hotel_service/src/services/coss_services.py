from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from schemas.hotel_schema import RoomOut, HotelOut
from services.booking_service import BookingService
from services.hotel_service import HotelService
from services.photo_service import PhotoService
from services.room_service import RoomServiceLogic
from services.service_service import ServiceServiceLogic

''' This class was created to avoid import circulation'''
class CrossServices:
    def __init__(self, session: Session):
        self.room_service = RoomServiceLogic(session)
        self.services_service = ServiceServiceLogic(session)
        self.photos_service = PhotoService(session)
        self.hotel_service = HotelService(session)
        self.booking_service = BookingService(session)
        
    def find_room_by_room_number(self, room_number: int):
        room = self.room_service.find_room_by_room_number(room_number)
        services =  self.services_service.find_all_services_by_room_id(room_number)
        photos = self.photos_service.find_photos_by_room_id(room_number)
        hotel = self.hotel_service.get_hotel_from_room(room.hotel_id)

        room.room_services = services
        room.photos = photos
        room.hotel = hotel

        return room

    def find_all_rooms_by_hotel_id(self, hotel_id: int):
        rooms = self.room_service.find_room_by_hotel_id(hotel_id)

        room_out_list = []

        for room in rooms:
            services = self.services_service.find_all_services_by_room_id(room.room_number)
            photos = self.photos_service.find_photos_by_room_id(room.room_number)

            room_out = RoomOut(**room.__dict__)
            room_out.photos = photos
            room_out.room_services = services
            room_out.hotel = self.hotel_service.get_hotel_from_room(hotel_id)

            room_out_list.append(room_out)

        return room_out_list

    def find_hotel_by_hotel_id(self, hotel_id: int):
        try:
            hotel_model = self.hotel_service.find_hotel_by_id(hotel_id)
            hotel = HotelOut(**hotel_model.__dict__)

            hotel.rooms = self.find_all_rooms_by_hotel_id(hotel.hotel_id)

            return hotel
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def find_active_booking_by_id_user(self, id_user: int):
        bookings = self.booking_service.find_bookings_not_expired_by_user_id(id_user)

        for booking in bookings:
            room = self.find_room_by_room_number(booking.room_number)
            booking.room = room

        return bookings
