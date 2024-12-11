from fastapi import APIRouter

from schemas.ai_schema import AiChatInput, AiChatOutput
from services.ai_service import retrieve_llm_response

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

@router.post("/ai-chat")
def hello_world(data: AiChatInput) -> AiChatOutput:
    response = retrieve_llm_response(data.input)

    return AiChatOutput(input=data.input, output=response)