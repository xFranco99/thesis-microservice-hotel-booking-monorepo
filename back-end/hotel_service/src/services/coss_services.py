from datetime import datetime
from decimal import Decimal
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from schemas.hotel_schema import RoomOut, HotelOut, BookingCreate, BookingRoomOut, RoomCreate
from schemas.mail_schema import RefundMailInput, ReservationMailInfo
from services.booking_service import BookingService
from services.hotel_service import HotelService
from services.photo_service import PhotoService
from services.room_service import RoomServiceLogic
from services.service_service import ServiceServiceLogic
from clients.client import send_refund_mail, get_user_from_id, send_reservation_mail
from utils.mail_utility import generate_base_mail_info
from utils.date_util import calculate_days_difference

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
            room = self.room_service.find_room_by_room_id(data.room_id)
            price_e_p = (
                    (room.price_per_night_children * data.children_no) +
                    (room.price_per_night_adults * data.adult_no)
            )
            total_price = price_e_p * calculate_days_difference(data.booked_to, data.booked_from)
            booking =  self.booking_service.create_booking(data, total_price)
            hotel = self.hotel_service.get_hotel_from_room(booking.hotel_id)
        except SQLAlchemyError as e:
            raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, data=f"{e}")

        user = get_user_from_id(data.user_id)

        mail_info_base = generate_base_mail_info(user)
        mail_info = ReservationMailInfo(**mail_info_base.__dict__)
        mail_info.guest_name = user.first_name + " " + user.last_name
        mail_info.hotel_name = hotel.hotel_name
        mail_info.check_in = booking.booked_from
        mail_info.check_out = booking.booked_to
        mail_info.adults_no = str(booking.adult_no)
        mail_info.childs_no = str(booking.children_no)
        mail_info.room_type = room.room_type
        mail_info.booking_id = booking.booking_id
        mail_info.hotel_address = hotel.hotel_address

        send_reservation_mail(mail_info)

        return booking

    def find_room_by_room_id(self, room_id: int):
        room = self.room_service.find_room_by_room_id(room_id)
        services =  self.services_service.find_all_services_by_room_id(room_id)
        photos = self.photos_service.find_photos_by_room_id(room_id)
        hotel = self.hotel_service.get_hotel_from_room(room.hotel_id)

        room.room_services = services
        room.photos = photos
        room.hotel = hotel

        return room

    def find_all_rooms_by_hotel_id(self, hotel_id: int):
        rooms = self.room_service.find_room_by_hotel_id(hotel_id)

        room_out_list = []

        for room in rooms:
            services = self.services_service.find_all_services_by_room_id(room.room_id)
            photos = self.photos_service.find_photos_by_room_id(room.room_id)

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
            room = self.find_room_by_room_id(booking.room_id)
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
            services = self.services_service.find_all_services_by_room_id(room.room_id)
            photos = self.photos_service.find_photos_by_room_id(room.room_id)
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

                    mail_info_base = generate_base_mail_info(user_info)
                    mail_info = RefundMailInput(**mail_info_base.__dict__)
                    mail_info.refund_amount = refund_amount
                    mail_info.booking_id = booking_id

                    send_refund_mail(mail_info)

                self.booking_service.remove_booking(booking_id)
        except SQLAlchemyError as e:
            raise HTTPException(HTTPStatus.INTERNAL_SERVER_ERROR, detail=f"{e}")


    def create_room(self, data: RoomCreate):
        hotel = self.hotel_service.find_hotel_by_id(data.hotel_id)
        hotel_rooms_associated = self.room_service.count_associated_rooms(data.hotel_id)

        if hotel.total_rooms == hotel_rooms_associated:
            raise HTTPException(
                status_code=HTTPStatus.FORBIDDEN,
                detail="Can't add more rooms to this hotel"
            )

        return self.room_service.create_room(data)

    def find_room_by_room_no(self, hotel_id: int, room_no: int):

        rooms = self.room_service.find_room_by_room_no(hotel_id, room_no)

        for room in rooms:
            room.room_services = self.services_service.find_all_services_by_room_id(room.room_id)
            room.photos = self.photos_service.find_photos_by_room_id(room.room_id)

        return rooms