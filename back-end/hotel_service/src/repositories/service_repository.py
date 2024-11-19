from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from models.hotel_model import Service, RoomService
from schemas.hotel_schema import ServiceBase, ServiceListOut, ServiceOut


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

        result = ServiceListOut()
        result.services = [ServiceBase(**service.__dict__) for service in services]
        return result

    def remove_service_from_room(self, room_number: int, service_id: int):
        self.session.query(RoomService).filter(
            and_(
                RoomService.room_id==room_number,
                RoomService.service_id==service_id
            )
        ).delete()

        self.session.commit()