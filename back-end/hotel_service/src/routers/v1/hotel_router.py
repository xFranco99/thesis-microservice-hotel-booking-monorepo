import json
from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter, Response, Depends, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import HotelCreate, HotelOutPaginated
from services.coss_services import CrossServices
from services.hotel_service import HotelService
from services.room_service import RoomServiceLogic

router = APIRouter(
    prefix="/hotel",
    tags=["hotel"]
)

@router.post("/create-hotel")
def create_hotel(data: HotelCreate, session: Session = Depends(get_db)) -> Response:
    _hotel_service = HotelService(session)

    hotel = _hotel_service.create_hotel(data)

    return Response(
        content=json.dumps(jsonable_encoder(hotel)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-hotel-by-hotel-id/{hotel_id}")
def create_hotel(hotel_id: int, session: Session = Depends(get_db)) -> Response:
    _cross_service = CrossServices(session)

    hotel = _cross_service.find_hotel_by_hotel_id(hotel_id)

    return Response(
        content=json.dumps(jsonable_encoder(hotel)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/available-city")
def get_city(city_name: str = "", limit: int = 3, session: Session = Depends(get_db)) -> Response:
    _hotel_service = HotelService(session)

    response = _hotel_service.find_city_by_name(city_name, limit)

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.patch("/edit-hotel/{id_hotel}")
def edit_hotel(data: HotelCreate, id_hotel: int, session: Session = Depends(get_db)) -> Response:
    _hotel_service = HotelService(session)

    _hotel_service.update_hotel(data, id_hotel)

    return Response(
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.delete("/delete-hotel/{id_hotel}")
def delete_hotel(id_hotel: int, session: Session = Depends(get_db)) -> Response:
    _hotel_service = HotelService(session)

    _hotel_service.delete_hotel(id_hotel)

    return Response(
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/search-by-name-city-address")
def get_hotels(
        hotel_name: Optional[str] = None,
        hotel_city: Optional[str] = None,
        hotel_address: Optional[str] = None,
        page: int = Query(1, ge=1),
        page_size: int = Query(10, ge=1, le=100),
        session: Session = Depends(get_db)
) -> Response:
    _hotel_service = HotelService(session)

    hotels, total_pages = _hotel_service.find_hotel_by_name_or_city_or_address(
        hotel_name,
        hotel_city,
        hotel_address,
        page,
        page_size
    )

    response = HotelOutPaginated()
    response.hotel_out = hotels
    response.total_pages = total_pages

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )