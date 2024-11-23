from pyexpat.errors import messages
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.photo_repository import PhotoRepository
from schemas.hotel_schema import PhotoCreate, PhotoBase, PhotoOut


class PhotoService:
    def __init__(self, session: Session):
        self.repository = PhotoRepository(session)

    def associate_photo(self, data: PhotoCreate) -> PhotoOut:
        room_id = data.room_id
        photo_list = data.photos

        photo_saved_list = []
        photo_not_saved_list = []

        response = PhotoOut()

        if self.repository.count_photos(room_id) > 9:
            response.photos_not_saved = photo_list
            response.error_message = 'Reached max photo limit'
            return response

        for photo in photo_list:
            try:
                photo_base = PhotoBase()
                photo_base.photo_url = photo
                photo_base.room_id = room_id


                if self.repository.count_photos(room_id) > 9:
                    photo_not_saved_list.append(photo)
                    response.error_message = 'Reached max photo limit'
                    continue

                self.repository.associate_photo(photo_base)
                photo_saved_list.append(photo)
            except SQLAlchemyError as e:
                photo_not_saved_list.append(photo)
                continue

        response.photos_saved = photo_saved_list
        response.photos_not_saved = photo_not_saved_list

        return response

    def find_photos_by_room_id(self, room_id: int):
        photos = self.repository.find_photos_by_room_id(room_id)
        return [photo.photo_url for photo in photos]