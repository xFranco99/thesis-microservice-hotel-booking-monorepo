from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from repositories.photo_repository import PhotoRepository
from schemas.hotel_schema import PhotoCreate, PhotoBase, PhotoOut, PhotoBaseOut


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

    def update_photos(self, photo_id: int, photo_url: str):
        try:
            self.repository.update_photo(photo_id, photo_url)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error while updating image {e}"
            )

    def find_photos_by_room_id(self, room_id: int):
        photos = self.repository.find_photos_by_room_id(room_id)
        return [photo.photo_url for photo in photos]

    def find_photo_id_from_room_id(self, room_id: int):
        photos = self.repository.find_photo_id_from_room_id(room_id)
        return [PhotoBaseOut(**photo.__dict__) for photo in photos]

    def delete_single_photo(self, photo_id: int):
        try:
            self.repository.delete_single_photo(photo_id)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail=f"Error while updating image {e}"
            )