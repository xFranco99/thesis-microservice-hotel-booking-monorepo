import enum
from sqlalchemy import Column, Integer, String, DateTime, BLOB, Boolean

from config.database import Base

class MailHistory(Base):
    __tablename__ = 'mail_history'
    id = Column(Integer, primary_key=True)
    id_template = Column(Integer)
    mail_to = Column(String)
    subject = Column(String)
    send_date = Column(DateTime)
    call_date = Column(DateTime)
    caller_service = Column(String)

class Template(Base):
    __tablename__ = 'template'
    id = Column(Integer, primary_key=True)
    description = Column(String)
    template_name = Column(String)
    template = Column(BLOB)
    insert_date = Column(DateTime)
    update_date = Column(DateTime)
    delete = Column(Boolean)