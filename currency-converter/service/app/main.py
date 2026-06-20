from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.converter import convert_amount
from app.models import ConvertRequest, ConvertResponse

app = FastAPI(
    title="Currency Converter",
    description="Simple currency conversion API with hardcoded rates",
    version="1.0.0",
    debug=settings.debug,
)

LOCAL_DEV_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
    "http://127.0.0.1:5175",
    "http://localhost:5175",
    "http://127.0.0.1:5176",
    "http://localhost:5176",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_DEV_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/convert", response_model=ConvertResponse)
def convert(payload: ConvertRequest) -> ConvertResponse:
    converted, rate = convert_amount(payload.amount, payload.from_currency, payload.to_currency)
    return ConvertResponse(
        amount=payload.amount,
        from_currency=payload.from_currency,
        to_currency=payload.to_currency,
        converted_amount=converted,
        rate=rate,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}
