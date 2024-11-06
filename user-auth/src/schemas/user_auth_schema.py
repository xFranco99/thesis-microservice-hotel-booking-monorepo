from datetime import datetime
from enum import Enum
from pydantic import BaseModel

class Role(str, Enum):
    USER = 'USER'
    ADMIN = 'ADMIN'
    MANAGER = 'MANAGER'

class State(str, Enum):
    CREATED = 'CREATED'
    ACTIVE = 'ACTIVE'
    SUSPEND = 'SUSPEND'
    DELETED = 'DELETED'

class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserInput(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserOutput(BaseModel):
    id_user: int
    username: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role

class UserAuthComplete(BaseModel):
    id_user: int
    username: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    email: str
    role: Role
    insert_date: datetime
    update_date: datetime
    state: State
    tmp_access_code: str | None
    tmp_access_code_expiration: datetime | None
    suspend_end_date: datetime | None

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None