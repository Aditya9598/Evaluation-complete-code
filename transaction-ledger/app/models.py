from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class TransactionType(str, Enum):
    CREDIT = "credit"
    DEBIT = "debit"


class TransactionCreate(BaseModel):
    id: int = Field(..., gt=0, description="Account ID this transaction belongs to")
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    type: TransactionType
    description: Optional[str] = Field(None, max_length=200)

    @field_validator("amount")
    @classmethod
    def amount_must_be_finite(cls, value: float) -> float:
        if value != value:  # NaN check
            raise ValueError("amount must be a valid number")
        return round(value, 2)


class Transaction(BaseModel):
    id: int
    account_id: int
    amount: float
    type: TransactionType
    description: Optional[str]
    created_at: datetime


class BalanceResponse(BaseModel):
    id: int
    balance: float
    transaction_count: int


class User(BaseModel):
    id: int
    name: str
    email: str
