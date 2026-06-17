from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


CONTRACT_VERSION = "1.0"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SCORED = "scored"
    FAILED = "failed"


class ArticleIngest(BaseModel):
    contract_version: str
    job_id: str
    title: str = Field(..., min_length=1)
    body: str = ""
    source: str = "economic_times"


class ScoreResult(BaseModel):
    contract_version: str
    job_id: str
    relevance_score: int = Field(..., ge=0, le=100)
    risk_score: int = Field(..., ge=0, le=100)
    reasons: list[str]


class ArticleJob(BaseModel):
    contract_version: str
    job_id: str
    title: str
    body: str
    source: str
    status: JobStatus
    score: Optional[ScoreResult] = None
