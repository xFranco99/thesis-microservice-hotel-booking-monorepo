import json
from http import HTTPStatus

from fastapi import APIRouter, UploadFile, Response
from fastapi.encoders import jsonable_encoder

from schemas.ai_schema import AiChatInput, AiChatOutput
from services.ai_service import retrieve_llm_response
from vector_database.vectorized_db_manager import save_rag_file

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

@router.post("/ai-chat")
def hello_world(data: AiChatInput) -> AiChatOutput:
    response = retrieve_llm_response(data.input)

    return AiChatOutput(input=data.input, output=response)

@router.post("/upload-rag-file")
def upload_rag_file(file: UploadFile) -> Response:
    return Response(
        content=json.dumps(save_rag_file(file)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )