from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openrouter import convert_code

router = APIRouter()

class CodeRequest(BaseModel):
    from_lang: str
    to_lang: str
    code: str

@router.post("/convert")
async def convert_code_route(request: CodeRequest):
    print("🚀 Received Request:")
    print(f"From: {request.from_lang}, To: {request.to_lang}")
    print(f"Code:\n{request.code}")

    result = await convert_code(request.from_lang, request.to_lang, request.code)

    print("✅ Converted Output:")
    print(result)

    return {"converted_code": result}
