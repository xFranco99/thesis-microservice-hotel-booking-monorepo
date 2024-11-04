import sys
sys.path.append("..")

import enum
from sqlalchemy import Column, Integer, Enum, String, DateTime
from config.database import Base

class Role(enum.Enum):
    USER = 'USER'
    ADMIN = 'ADMIN'
    MANAGER = 'MANAGER'

class State(enum.Enum):
    CREATED = 'CREATED'
    ACTIVE = 'ACTIVE'
    SUSPEND = 'SUSPEND'
    DELETED = 'DELETED'

class UserAuth(Base):
    __tablename__ = 'user'
    id_user = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    insert_date = Column(DateTime)
    update_date = Column(DateTime)
    state = Column(Enum(State))
    email = Column(String)
    tmp_access_code = Column(String)
    tmp_access_code_expiration = Column(DateTime)
    role = Column(Enum(Role))
    suspend_end_date = Column(DateTime)





