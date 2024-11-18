import uvicorn
from fastapi import FastAPI
from routers.v1.hotel_router import router

app = FastAPI()

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8082)