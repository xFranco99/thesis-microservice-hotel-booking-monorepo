from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel

class RoomBase(BaseModel):
    room_id: Optional[int] = None
    room_number: int
    hotel_id: Optional[int] = None
    bed_number: Optional[int] = None
    room_type: Optional[str] = None
    price_per_night_adults: Optional[Decimal] = None
    price_per_night_children: Optional[Decimal] = None
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomCreateList(BaseModel):
    room_list: List[RoomCreate]

class RoomCreateListOut(BaseModel):
    rooms_created: List[RoomBase] = []
    rooms_not_created: List[RoomBase] = []

class HotelBase(BaseModel):
    hotel_name: Optional[str] = None
    hotel_address: Optional[str] = None
    hotel_stars: Optional[int] = None
    total_rooms: Optional[int] = None
    hotel_city: Optional[str] = None
    refundable: Optional[bool] = None

class HotelCreate(HotelBase):
    pass

class BookingBase(BaseModel):
    room_id: int
    user_id: Optional[int] = None
    hotel_id: Optional[int] = None
    booked_from: Optional[datetime] = None
    booked_to: Optional[datetime] = None
    adult_no: Optional[int] = None
    children_no: Optional[int] = None
    credit_card_no: Optional[str] = None
    date_payment: Optional[datetime] = None
    date_refound: Optional[datetime] = None
    cancelled: Optional[bool] = False

class BookingCreate(BookingBase):
    pass

class PhotoBase(BaseModel):
    photo_url: Optional[str] = None
    room_id: Optional[int] = None

class PhotoCreate(BaseModel):
    room_id: int
    photos: List[str]
    class Config:
        orm_mode = True

class PhotoOut(BaseModel):
    photos_saved: List[str] = []
    photos_not_saved: List[str] = []
    error_message: str = ''
    class Config:
        orm_mode = True

class ServiceBase(BaseModel):
    service_name: Optional[str] = None
    service_icon: Optional[str] = None

class ServiceCreate(BaseModel):
    services: List[ServiceBase]
    class Config:
        orm_mode = True

class ServiceOut(ServiceBase):
    service_id: int

    class Config:
        orm_mode = True

class ServiceListOut(BaseModel):
    services: List[ServiceOut] = []

    class Config:
        orm_mode = True

class ServiceCreationOut(BaseModel):
    saved_service: List[str] = []
    not_saved_service: List[str] = []

class RoomServiceBase(BaseModel):
    room_id: int
    service_id: int

class RoomServiceCreate(RoomServiceBase):
    pass

class RoomServiceOut(RoomServiceBase):
    service_name: str
    room_id: int

    class Config:
        orm_mode = True

class AssociateRoomWithServices(BaseModel):
    room_id: int
    services: List[int]

class RoomOut(RoomBase):
    photos: List[str] = []
    room_services: List[ServiceBase] = []
    hotel: Optional[HotelBase] = None

    class Config:
        orm_mode = True

class HotelOut(HotelBase):
    hotel_id: int
    rooms: List[RoomOut] = []

    class Config:
        orm_mode = True

class HotelOutPaginated(BaseModel):
    hotel_out: List[HotelOut] = []
    total_pages: int = None

    class Config:
        orm_mode = True

class BookingOut(BookingBase):
    booking_id: int
    hotel: Optional[HotelOut] = None
    payment_amount:  Optional[Decimal] = None

    class Config:
        orm_mode = True

class BookingRoomOut(BookingBase):
    booking_id: int
    room: Optional[RoomOut] = None
    payment_amount: Optional[Decimal] = None

    class Config:
        orm_mode = True

class AssociateRoomWithServicesOut(BaseModel):
    associated_services: List[int] = []
    not_associated_services: List[int] = []

class ServiceRoom(BaseModel):
    services: List[AssociateRoomWithServices]

    class Config:
        orm_mode = True

class RoomPatch(BaseModel):
    hotel_id: Optional[int] = None
    bed_number: Optional[int] = None
    room_type: Optional[str] = None
    price_per_night_adults: Optional[Decimal] = None
    price_per_night_children: Optional[Decimal] = None
    description: Optional[str] = None

class PhotoBaseOut(PhotoBase):
    photo_id: int

class SinglePhotoOutList(BaseModel):
    photos: List[PhotoBaseOut] = []

class RoomOutFromHotel(RoomBase):
    photos: List[str] = []
    room_services: List[ServiceBase] = []

    class Config:
        orm_mode = True

class RoomOutFromHotelPaginated(BaseModel):
    rooms: List[RoomOutFromHotel] = []
    total_pages: int = 1

    class Config:
        orm_mode = True