from http import HTTPStatus

from fastapi import HTTPException


class TemplateAlreadyExistException(HTTPException):
    def __init__(self, template_name: str):
        message = "The template with name: '" + template_name + "' already exist"
        super().__init__(status_code=HTTPStatus.CONFLICT, detail=message)