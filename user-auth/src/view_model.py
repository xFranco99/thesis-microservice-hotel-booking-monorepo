from enum import Enum
from pydantic import BaseModel

class Role(str, Enum):
    USER = 'USER'
    ADMIN = 'ADMIN'
    MANAGER = 'MANAGER'

class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role