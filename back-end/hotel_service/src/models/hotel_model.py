from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, DECIMAL, Boolean
from sqlalchemy.orm import relationship
from config.database import Base


class Hotel(Base):
    __tablename__ = 'hotel'

    hotel_id = Column(Integer, primary_key=True)
    hotel_name = Column(String(45), nullable=True)
    hotel_address = Column(String(45), nullable=True)
    hotel_stars = Column(Integer, nullable=True)
    total_rooms = Column(Integer, nullable=True)
    hotel_city = Column(String(45), nullable=True)
    refundable = Column(Boolean, default=False)

    rooms = relationship('Room', back_populates='hotel', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='hotel', cascade='all, delete-orphan')


class Room(Base):
    __tablename__ = 'room'

    room_number = Column(Integer, primary_key=True)
    hotel_id = Column(Integer, ForeignKey('hotel.hotel_id'), nullable=True)
    bed_number = Column(Integer, nullable=True)
    room_type = Column(String(45), nullable=True)
    price_per_night_adults = Column(DECIMAL(3, 2), nullable=True)
    price_per_night_children = Column(DECIMAL(3, 2), nullable=True)
    description = Column(String(1000), nullable=True)

    hotel = relationship('Hotel', back_populates='rooms')
    photos = relationship('Photo', back_populates='room', cascade='all, delete-orphan')
    roomservices = relationship('RoomService', back_populates='room', cascade='all, delete-orphan')
    bookings = relationship('Booking', back_populates='room', cascade='all, delete-orphan')


class Booking(Base):
    __tablename__ = 'booking'

    booking_id = Column(Integer, primary_key=True)
    room_number = Column(Integer, ForeignKey('room.room_number'), nullable=True)
    user_id = Column(Integer, nullable=True)
    hotel_id = Column(Integer, ForeignKey('hotel.hotel_id'), nullable=True)
    booked_from = Column(DateTime, nullable=True)
    booked_to = Column(DateTime, nullable=True)
    adult_no = Column(Integer, nullable=True)
    children_no = Column(Integer, nullable=True)
    credit_card_no = Column(String(45), nullable=True)
    date_payment = Column(DateTime, nullable=True)
    date_refound = Column(DateTime, nullable=True)

    room = relationship('Room', back_populates='bookings')
    hotel = relationship('Hotel', back_populates='bookings')


class Photo(Base):
    __tablename__ = 'photos'

    photo_id = Column(Integer, primary_key=True)
    photo_url = Column(String(128), nullable=True)
    room_number = Column(Integer, ForeignKey('room.room_number'), nullable=True)

    room = relationship('Room', back_populates='photos')


class Service(Base):
    __tablename__ = 'service'

    service_id = Column(Integer, primary_key=True)
    service_name = Column(String(45), nullable=True)
    service_icon = Column(String(128), nullable=True)

    roomservices = relationship('RoomService', back_populates='service', cascade='all, delete-orphan')


class RoomService(Base):
    __tablename__ = 'roomservice'

    room_id = Column(Integer, ForeignKey('room.room_number'), primary_key=True)
    service_id = Column(Integer, ForeignKey('service.service_id'), primary_key=True)

    room = relationship('Room', back_populates='roomservices')
    service = relationship('Service', back_populates='roomservices')