from sqlalchemy.orm import Session

from models.hotel_model import Photo
from schemas.hotel_schema import PhotoBase, PhotoCreate


class PhotoRepository:
    def __init__(self, session: Session):
        self.session = session

    def associate_photo(self, data: PhotoBase):
        photo = Photo(**data.model_dump(exclude_none=True))

        self.session.add(photo)
        self.session.commit()
        self.session.refresh(photo)
        return photo.photo_url

    def count_photos(self, room_id: int):
        return self.session.query(Photo).filter_by(room_id=room_id).count()

    def find_photos_by_room_id(self, room_id: int):
        photos = self.session.query(Photo).filter_by(room_id=room_id).all()

        return [PhotoBase(**photo.__dict__) for photo in photos]