from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"


class ConvertRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Amount to convert (must be positive)")
    from_currency: Currency = Field(..., alias="from")
    to_currency: Currency = Field(..., alias="to")

    model_config = {"populate_by_name": True}

    @field_validator("amount")
    @classmethod
    def amount_must_be_finite(cls, value: float) -> float:
        if value != value:
            raise ValueError("amount must be a valid number")
        return round(value, 2)


class ConvertResponse(BaseModel):
    amount: float
    from_currency: Currency = Field(..., alias="from")
    to_currency: Currency = Field(..., alias="to")
    converted_amount: float
    rate: float

    model_config = {"populate_by_name": True}
