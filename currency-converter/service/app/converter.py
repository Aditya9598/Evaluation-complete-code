from fastapi import HTTPException

from app.models import Currency

# Hardcoded rates: key (from, to) -> multiplier
RATES: dict[tuple[Currency, Currency], float] = {
    (Currency.USD, Currency.EUR): 0.92,
    (Currency.EUR, Currency.USD): 1.09,
    (Currency.USD, Currency.GBP): 0.79,
    (Currency.GBP, Currency.USD): 1.27,
    (Currency.EUR, Currency.GBP): 0.86,
    (Currency.GBP, Currency.EUR): 1.16,
    (Currency.USD, Currency.USD): 1.0,
    (Currency.EUR, Currency.EUR): 1.0,
    (Currency.GBP, Currency.GBP): 1.0,
}


def convert_amount(amount: float, from_currency: Currency, to_currency: Currency) -> tuple[float, float]:
    if from_currency == to_currency:
        raise HTTPException(status_code=400, detail="from and to currencies must differ")

    rate = RATES.get((from_currency, to_currency))
    if rate is None:
        raise HTTPException(status_code=400, detail=f"Unsupported conversion: {from_currency} -> {to_currency}")

    converted = round(amount * rate, 2)
    return converted, rate
