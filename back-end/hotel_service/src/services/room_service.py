from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.room_repository import RoomRepository
from schemas.hotel_schema import RoomCreate, RoomCreateList, RoomCreateListOut, RoomBase, RoomOut
from services.hotel_service import HotelService
from services.photo_service import PhotoService
from services.service_service import ServiceServiceLogic


class RoomServiceLogic:
    def __init__(self, session: Session):
        self.repository = RoomRepository(session)
        self.services_service = ServiceServiceLogic(session)
        self.photos_service = PhotoService(session)
        self.hotel_service = HotelService(session)

    def create_room(self, data: RoomCreate):
        try:
            return self.repository.create_room(data)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} while creating hotel"
            )

    def create_room_list(self, data: RoomCreateList):
        result = RoomCreateListOut()

        rooms_saved = []
        rooms_not_saved = []

        for room in data.room_list:
            room_base = RoomBase(**room.__dict__)
            try:
                self.create_room(room)
                rooms_saved.append(room_base)
            except HTTPException as e:
                rooms_not_saved.append(room_base)
                continue

        result.rooms_created = rooms_saved
        result.rooms_not_created = rooms_not_saved

        return result

    def find_room_by_room_number(self, room_number: int):
        room = self.repository.find_room_by_room_number(room_number)
        services =  self.services_service.find_all_services_by_room_id(room_number)
        photos = self.photos_service.find_photos_by_room_id(room_number)
        hotel = self.hotel_service.get_hotel_from_room(room.hotel_id)

        room.room_services = services
        room.photos = photos
        room.hotel = hotel

        return room

    #def find_all_rooms_by_hotel_id(self, hotel_id: int, ):
    #    rooms = self.repository.find_room_by_hotel_id(hotel_id)
#
    #    room_out_list = []
#
    #    for room in rooms:
    #        services = self.services_service.find_all_services_by_room_id(room.room_number)
    #        photos = self.photos_service.find_photos_by_room_id(room.room_number)
    #        hotel = self.hotel_service.get_hotel_from_room(room.hotel_id)
#
    #        room_out = RoomOut(**room.__dict__)
    #        room_out.photos = photos
    #        room_out.room_services = services
    #        room_out.hotel = hotel
#
    #        room_out_list.append(room_out)
#
    #    return room_out_list