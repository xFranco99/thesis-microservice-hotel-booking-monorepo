from pydantic import BaseModel


class AiChatInput(BaseModel):
    input: str

class AiChatOutput(AiChatInput):
    output: str