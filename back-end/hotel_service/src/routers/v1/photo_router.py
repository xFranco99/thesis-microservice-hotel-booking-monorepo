import json
from http import HTTPStatus

from fastapi import APIRouter, Depends, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import PhotoCreate
from services.photo_service import PhotoService

router = APIRouter(
    prefix="/photos",
    tags=["photos"]
)

@router.post("/associate-photos")
def associate_photos_to_room(
        data: PhotoCreate,
        session: Session = Depends(get_db)
) -> Response:
    _photo_service = PhotoService(session)

    response = _photo_service.associate_photo(data)

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-room-photos/{room_id}")
def get_room_photos(room_id: int, session: Session = Depends(get_db)) -> Response:
    _photo_service = PhotoService(session)

    response = _photo_service.find_photos_by_room_id(room_id)

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )