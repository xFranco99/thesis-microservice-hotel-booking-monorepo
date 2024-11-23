from sqlalchemy import and_
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, joinedload

from models.hotel_model import Service, RoomService
from schemas.hotel_schema import ServiceBase, ServiceListOut, ServiceOut
from utils.object_util import obj_to_dict_non_none


class ServiceRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_service(self, data: ServiceBase):
        service = Service(**data.model_dump(exclude_none=True))

        self.session.add(service)
        self.session.commit()
        self.session.refresh(service)
        return ServiceBase(**service.__dict__)

    def associate_room_with_service(self, room_id: int, service_id: int):
        room_service = RoomService()
        room_service.room_id = room_id
        room_service.service_id = service_id

        self.session.add(room_service)
        self.session.commit()
        self.session.refresh(room_service)
        return service_id

    def find_all_services(self):
        services = self.session.query(Service).all()
        result = ServiceListOut()
        result.services = [ServiceOut(**service.__dict__) for service in services]
        return result

    def find_all_services_by_room_id(self, room_id: int):
        services = (
            self.session.query(Service)
            .join(RoomService)
            .filter(RoomService.room_id==room_id)
            .all()
        )

        return [ServiceBase(**service.__dict__) for service in services]

    def remove_service_from_room(self, room_id: int, service_id: int):
        self.session.query(RoomService).filter(
            and_(
                RoomService.room_id==room_id,
                RoomService.service_id==service_id
            )
        ).delete()

        self.session.commit()

    def update_service(self, service_id: int, data: ServiceBase):
        try:
            self.session.query(Service).filter_by(service_id=service_id).update(obj_to_dict_non_none(data))
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)

    def delete_service(self, service_id: int):
        try:
            self.session.query(Service).filter_by(service_id=service_id).delete()
            self.session.commit()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise SQLAlchemyError(e)