from pathlib import Path
from typing import Optional

from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.models import BalanceResponse, Transaction, TransactionCreate, User
from app.store import store, user_store

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(
    title="Transaction Ledger",
    description="Simple in-memory transaction ledger API",
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

api = APIRouter(prefix="/api")


@api.get("/users", response_model=list[User])
def list_users() -> list[User]:
    return user_store.list_all()


@api.get("/users/{id}", response_model=User)
def get_user(id: int) -> User:
    return user_store.require(id)


@api.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(payload: TransactionCreate) -> Transaction:
    return store.add(payload)


@api.get("/transactions", response_model=list[Transaction])
def list_transactions(
    id: Optional[int] = Query(None, gt=0, description="Filter by account ID"),
) -> list[Transaction]:
    return store.list_all(account_id=id)


@api.get("/balance", response_model=BalanceResponse)
def get_balance(
    id: int = Query(..., gt=0, description="Account ID to get balance for"),
) -> BalanceResponse:
    balance, count = store.balance(account_id=id)
    return BalanceResponse(id=id, balance=balance, transaction_count=count)


@api.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


app.include_router(api)

if STATIC_DIR.is_dir():
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str = "") -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")

        if full_path:
            asset = STATIC_DIR / full_path
            if asset.is_file():
                return FileResponse(asset)

        index = STATIC_DIR / "index.html"
        if index.is_file():
            return FileResponse(index)

        raise HTTPException(status_code=404, detail="Not found")
