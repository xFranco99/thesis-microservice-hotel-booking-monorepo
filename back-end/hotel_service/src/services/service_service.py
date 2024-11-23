from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.service_repository import ServiceRepository
from schemas.hotel_schema import ServiceCreate, AssociateRoomWithServices, ServiceBase


class ServiceServiceLogic:
    def __init__(self, session: Session):
        self.repository = ServiceRepository(session)

    def create_services(self, data: ServiceCreate):
        service_list = data.services
        saved_services = []
        not_saved_services = []

        for service in service_list:
            try:
                saved_service = self.repository.create_service(service)
                saved_services.append(saved_service.service_name)
            except SQLAlchemyError as e:
                not_saved_services.append(service.service_name)
                continue

        return saved_services, not_saved_services

    def associate_room_with_services(self, data: AssociateRoomWithServices):
        room_id = data.room_id
        service_id_list = data.services

        associated_services = []
        not_associated_services = []

        for service_id in service_id_list:
            try:
                associated_service = self.repository.associate_room_with_service(room_id, service_id)
                associated_services.append(associated_service)
            except SQLAlchemyError as e:
                not_associated_services.append(service_id)
                continue

        return associated_services, not_associated_services

    def find_all_services(self):
        services = self.repository.find_all_services()
        return services

    def find_all_services_by_room_id(self, room_id: int):
        services = self.repository.find_all_services_by_room_id(room_id)
        return services

    def remove_service_from_room(self, room_id: int, service_id: int):
        self.repository.remove_service_from_room(room_id, service_id)

    def update_service(self, service_id: int, data: ServiceBase):
        try:
            self.repository.update_service(service_id, data)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error while updating service: {e}"
            )

    def delete_service(self, service_id: int):
        try:
            self.repository.delete_service(service_id)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error while deleting service: {e}"
            )