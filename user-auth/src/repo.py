from database import engine, SessionLocal
import model as model
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

model.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# TODO: FIX IT
def retrive_user(username_or_email: str) -> model.User:
    return (db_dependency.query(model.User)
            .filter(model.User.username == username_or_email |
                    model.User.email == username_or_email).first()
            )

def save_and_commit(model):
    db_dependency.add(model)
    db_dependency.commit()