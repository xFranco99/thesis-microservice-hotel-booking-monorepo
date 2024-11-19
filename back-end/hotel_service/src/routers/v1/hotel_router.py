import json
from http import HTTPStatus

from fastapi import APIRouter, Response, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import HotelCreate
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