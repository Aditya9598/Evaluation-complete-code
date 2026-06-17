import re
from functools import lru_cache

MARKET_KEYWORDS = frozenset(
    {
        "nifty",
        "sensex",
        "market",
        "stock",
        "rally",
        "crash",
        "ipo",
        "fii",
        "dii",
        "crude",
        "inflation",
    }
)
RISK_KEYWORDS = frozenset(
    {
        "fraud",
        "scam",
        "default",
        "bankruptcy",
        "hack",
        "breach",
        "sanction",
        "war",
        "strike",
    }
)


@lru_cache(maxsize=4096)
def normalize_text(text: str) -> str:
    """Normalize article text for keyword matching (cached for perf — A6)."""
    lowered = text.lower()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()


def tokenize(text: str) -> set[str]:
    return set(normalize_text(text).split())


def relevance_score(title: str, body: str) -> tuple[int, list[str]]:
    tokens = tokenize(f"{title} {body}")
    hits = [kw for kw in MARKET_KEYWORDS if kw in tokens]
    score = min(100, len(hits) * 15 + (20 if len(tokens) > 30 else 0))
    reasons = ["market_keywords"] if hits else []
    if len(tokens) > 30:
        reasons.append("substantial_content")
    return score, reasons


def risk_score(title: str, body: str) -> tuple[int, list[str]]:
    tokens = tokenize(f"{title} {body}")
    hits = [kw for kw in RISK_KEYWORDS if kw in tokens]
    score = min(100, len(hits) * 25)
    reasons = ["risk_keywords"] if hits else []
    return score, reasons
