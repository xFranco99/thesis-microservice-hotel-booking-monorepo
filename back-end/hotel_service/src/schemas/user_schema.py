from pydantic import BaseModel


class UserOutput(BaseModel):
    id_user: int
    username: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: str