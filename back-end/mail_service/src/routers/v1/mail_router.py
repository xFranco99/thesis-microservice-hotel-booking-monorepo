from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/hello-world")
def hello_world():
    return "Hello World!"