from http import HTTPStatus

from fastapi import HTTPException

class CanNotStoreHistoryException(HTTPException):
    def __init__(self):
        super().__init__(status_code=HTTPStatus.CONFLICT, detail="Something went wrong while saving mail history")