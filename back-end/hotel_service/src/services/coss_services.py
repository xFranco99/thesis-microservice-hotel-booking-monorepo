from datetime import datetime
from decimal import Decimal
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from schemas.hotel_schema import RoomOut, HotelOut, BookingCreate, BookingRoomOut
from schemas.mail_schema import RefundMailInput
from services.booking_service import BookingService
from services.hotel_service import HotelService
from services.photo_service import PhotoService
from services.room_service import RoomServiceLogic
from services.service_service import ServiceServiceLogic
from clients.client import send_refund_mail, get_user_from_id

''' This class was created to avoid import circulation'''
class CrossServices:
    def __init__(self, session: Session):
        self.room_service = RoomServiceLogic(session)
        self.services_service = ServiceServiceLogic(session)
        self.photos_service = PhotoService(session)
        self.hotel_service = HotelService(session)
        self.booking_service = BookingService(session)

    def create_booking(self, data: BookingCreate):
        try:
            room = self.room_service.find_room_by_room_number(data.room_number)
            total_price = (
                    (room.price_per_night_children * data.children_no) +
                    (room.price_per_night_adults * data.adult_no)
            )
            return self.booking_service.create_booking(data, total_price)
        except SQLAlchemyError as e:
            raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, data=f"{e}")

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

    def get_associated_booking_room(self, bookings: [BookingRoomOut]):
        for booking in bookings:
            room = self.find_room_by_room_number(booking.room_number)
            booking.room = room

        return bookings

    def find_active_booking_by_id_user(self, id_user: int):
        bookings = self.booking_service.find_bookings_not_expired_by_user_id(id_user)

        return self.get_associated_booking_room(bookings)

    def find_expired_booking_by_id_user(self, id_user: int):
        bookings = self.booking_service.find_bookings_expired_by_user_id(id_user)

        return self.get_associated_booking_room(bookings)

    def find_booking_by_id(self, booking_id: int):
        booking = self.booking_service.find_booking_by_id(booking_id)
        booking_room_out = BookingRoomOut(**booking.__dict__)
        return self.get_associated_booking_room([booking_room_out])[0]

    def search_a_room(
            self,
            city: str,
            date_from: datetime,
            date_to: datetime,
            total_guests: int,
            page: int,
            page_size: int
    ):
        rooms = self.room_service.search_room_not_booked(city, date_from, date_to, total_guests, page, page_size)

        for room in rooms:
            services = self.services_service.find_all_services_by_room_id(room.room_number)
            photos = self.photos_service.find_photos_by_room_id(room.room_number)
            hotel = self.hotel_service.get_hotel_from_room(room.hotel_id)

            room.room_services = services
            room.photos = photos
            room.hotel = hotel

        return rooms

    def revoke_reservation(self, booking_id: int):

        try:
            booking = self.booking_service.find_booking_by_id(booking_id)
            if not booking.cancelled:
                hotel_id = booking.hotel_id
                refund = self.hotel_service.find_hotel_by_id(hotel_id).refundable

                if refund:
                    user_info = get_user_from_id(booking.user_id)
                    refund_amount = Decimal(
                        str(booking.payment_amount)) if booking.payment_amount is not None else Decimal('0.00')

                    mail_object = {
                        "subject": "Refund confirmed - Hotel",
                        "mail_to": user_info.email,
                        "username": user_info.username,
                        "booking_id": booking_id,
                        "refund_amount": refund_amount,
                        "call_date": datetime.now(),
                        "caller_service": "hotel_service"
                    }
                    mail_info = RefundMailInput(**mail_object)

                    send_refund_mail(mail_info)

                self.booking_service.mark_booking_as_cancelled(booking_id, refund)
        except SQLAlchemyError as e:
            raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"{e}")

