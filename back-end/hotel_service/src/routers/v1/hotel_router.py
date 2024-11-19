import json
from http import HTTPStatus

from fastapi import APIRouter, Response, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import HotelCreate
from services.hotel_service import HotelService

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

#@router.post("/get-hotel-by-hotel-id/{hotel_id}")
#def create_hotel(hotel_id: int, session: Session = Depends(get_db)) -> Response:
#    _hotel_service = HotelService(session)
#
#    hotel = _hotel_service.find_hotel_by_hotel_id(hotel_id, _photo_service, _room_service, _services_service)
#
#    return Response(
#        content=json.dumps(jsonable_encoder(hotel)),
#        media_type="application/json",
#        status_code=HTTPStatus.OK
#    )