from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse

from app.config import settings
from app.models import ScoreResult, Transaction, TransactionIngest
from app.store import store

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(
    title="Fraud Score API",
    description="Fraud scoring pipeline — ingest transactions, score via Rust worker",
    version="1.0.0",
    debug=settings.debug,
    openapi_tags=[
        {
            "name": "Fraud Score",
            "description": "Ingest, claim, score, and track fraud-scored transactions",
        },
    ],
)


@app.post("/transactions", response_model=Transaction, status_code=201, tags=["Fraud Score"])
def create_transaction(payload: TransactionIngest) -> Transaction:
    return store.add(payload)


@app.get("/transactions/pending", response_model=list[Transaction], tags=["Fraud Score"])
def list_pending() -> list[Transaction]:
    return store.list_pending()


@app.get("/transactions/{transaction_id}", response_model=Transaction, tags=["Fraud Score"])
def get_transaction(transaction_id: str) -> Transaction:
    return store.get(transaction_id)


@app.patch("/transactions/{transaction_id}/claim", response_model=Transaction, tags=["Fraud Score"])
def claim_transaction(transaction_id: str) -> Transaction:
    return store.claim(transaction_id)


@app.post("/transactions/{transaction_id}/score", response_model=Transaction, tags=["Fraud Score"])
def submit_score(transaction_id: str, score: ScoreResult) -> Transaction:
    return store.submit_score(transaction_id, score)


@app.post("/transactions/{transaction_id}/fail", response_model=Transaction, tags=["Fraud Score"])
def fail_transaction(transaction_id: str) -> Transaction:
    return store.mark_failed(transaction_id)


@app.get("/health", tags=["Fraud Score"])
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


if STATIC_DIR.is_dir():
    @app.get("/ui", include_in_schema=False)
    async def fraud_ui_root() -> FileResponse:
        return FileResponse(STATIC_DIR / "index.html")

    @app.get("/ui/", include_in_schema=False)
    async def fraud_ui_root_slash() -> FileResponse:
        return FileResponse(STATIC_DIR / "index.html")
