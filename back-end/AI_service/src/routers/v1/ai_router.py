import json
from http import HTTPStatus

from fastapi import APIRouter, UploadFile, Response, HTTPException

from schemas.ai_schema import AiChatInput, AiChatOutput
from services.ai_service import RAGChatAssistant
from vector_database.vectorized_db_manager import save_rag_file

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

rag_assistant = RAGChatAssistant()

@router.post("/ai-chat")
def ai_chat(data: AiChatInput) -> AiChatOutput:
    response = rag_assistant.retrieve_llm_response(data.input)

    return AiChatOutput(input=data.input, output=response)

@router.get("/reset-chat-history")
def ai_chat() -> Response:
    rag_assistant.reset_chat_history()

    return Response(
        status_code=HTTPStatus.OK
    )

@router.post("/upload-rag-file")
def upload_rag_file(file: UploadFile) -> Response:
    return Response(
        content=json.dumps(save_rag_file(file)),
        media_type="application/json",
        status_code=HTTPStatus.OK
    )