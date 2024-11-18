import json
from http import HTTPStatus
from http.client import responses

from fastapi import APIRouter, Depends, Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from config.database import get_db
from schemas.hotel_schema import ServiceCreate, ServiceCreationOut, AssociateRoomWithServices, \
    AssociateRoomWithServicesOut
from services.service_service import ServiceServiceLogic

router = APIRouter(
    prefix="/services",
    tags=["services"]
)

@router.post("/create-service")
def create_service(data: ServiceCreate, session: Session = Depends(get_db)) -> Response:

    _service_service_logic = ServiceServiceLogic(session)

    services_saved, not_services_saved = _service_service_logic.create_services(data)

    services_saved_out = ServiceCreationOut()
    services_saved_out.saved_service = services_saved
    services_saved_out.not_saved_service = not_services_saved

    return Response(
        content=json.dumps(jsonable_encoder(services_saved_out)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.post("/associate-room-to-service")
def associate_room_to_service(
        data: AssociateRoomWithServices,
        session: Session = Depends(get_db)
) -> Response:
    _service_service_logic = ServiceServiceLogic(session)

    associated_services, not_associated_services = (
        _service_service_logic.associate_room_with_services(data)
    )

    room_to_service = AssociateRoomWithServicesOut()
    room_to_service.associated_services = associated_services
    room_to_service.not_associated_services = not_associated_services

    return Response(
        content=json.dumps(jsonable_encoder(room_to_service)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-all-services")
def get_all_services(session: Session = Depends(get_db)) -> Response:
    _service_service_logic = ServiceServiceLogic(session)

    response = _service_service_logic.find_all_services()

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )

@router.get("/get-all-services-from-room/{room_id}")
def get_all_services_from_room(room_id: int, session: Session = Depends(get_db)) -> Response:
    _service_service_logic = ServiceServiceLogic(session)

    response = _service_service_logic.find_all_services_by_room_id(room_id)

    return Response(
        content=json.dumps(jsonable_encoder(response)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )