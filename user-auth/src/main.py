from datetime import datetime
from typing import Annotated

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.status import HTTP_200_OK

import model
from database import SessionLocal, engine
from model import Role, State
from view_model import User

import auth
from auth import Token

app = FastAPI()
model.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post('/user-registration/', status_code=status.HTTP_201_CREATED)
async def user_registration(user: User, db: db_dependency):
    db_user = model.User(**user.model_dump())

    db_user.password = auth.get_password_hash(db_user.password)
    db_user.insert_date = datetime.now()
    db_user.update_date = datetime.now()
    db_user.state = State.CREATED if str(db_user.role) == str(Role.USER) else State.ACTIVE

    db.add(db_user)
    db.commit()

    return None

# TODO: FIX IT
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    return auth.get_token_from_login(form_data)

@app.get('/', status_code=HTTP_200_OK)
async def user_retrieve(username: str, db: db_dependency):
    users = db.query(model.User).filter(model.User.username == username).all()
    return users

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)