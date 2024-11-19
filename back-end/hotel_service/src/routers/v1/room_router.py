import json
from datetime import datetime
from http import HTTPStatus

from fastapi import APIRouter, Depends, Response, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import RoomCreate, RoomCreateList
from services.coss_services import CrossServices
from services.room_service import RoomServiceLogic

router = APIRouter(
    prefix="/room",
    tags=["room"]
)

@router.post("/create-room")
def create_room(data: RoomCreate, session: Session = Depends(get_db)) -> Response:

    _room_service = RoomServiceLogic(session)
    room = _room_service.create_room(data)

    return Response(
        content=json.dumps(jsonable_encoder(room)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.post("/create-room-list")
def create_room(data: RoomCreateList, session: Session = Depends(get_db)) -> Response:

    _room_service = RoomServiceLogic(session)
    room = _room_service.create_room_list(data)

    return Response(
        content=json.dumps(jsonable_encoder(room)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-room-by-room-number/{room_number}")
def get_room_by_room_number(room_number: int, session: Session = Depends(get_db)) -> Response:

    _cross_service = CrossServices(session)

    room = _cross_service.find_room_by_room_number(room_number)

    return Response(
        content=json.dumps(jsonable_encoder(room)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/search-room")
def search_a_room(
        city: str,
        date_from: datetime,
        date_to: datetime,
        total_guests: int,
        page: int = Query(1, ge=1),
        page_size: int = Query(10, ge=1, le=100),
        session: Session = Depends(get_db)
) -> Response:
    _cross_service = CrossServices(session)

    response = _cross_service.search_a_room(city, date_from, date_to, total_guests, page, page_size)

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )