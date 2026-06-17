from fastapi import FastAPI

from app.config import settings
from app.models import ArticleJob, ArticleIngest, ScoreResult
from app.store import store

app = FastAPI(title="Scorer Gateway", version="1.0.0", debug=settings.debug)


@app.post("/jobs", response_model=ArticleJob, status_code=201)
def create_job(payload: ArticleIngest) -> ArticleJob:
    return store.add(payload)


@app.get("/jobs/pending", response_model=list[ArticleJob])
def list_pending() -> list[ArticleJob]:
    return store.list_pending()


@app.get("/jobs/{job_id}", response_model=ArticleJob)
def get_job(job_id: str) -> ArticleJob:
    return store.get(job_id)


@app.patch("/jobs/{job_id}/claim", response_model=ArticleJob)
def claim_job(job_id: str) -> ArticleJob:
    return store.claim(job_id)


@app.post("/jobs/{job_id}/score", response_model=ArticleJob)
def submit_score(job_id: str, score: ScoreResult) -> ArticleJob:
    return store.submit_score(job_id, score)


@app.post("/jobs/{job_id}/fail", response_model=ArticleJob)
def fail_job(job_id: str) -> ArticleJob:
    return store.mark_failed(job_id)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "environment": settings.environment,
        "scraper_api": settings.scraper_api_base_url,
    }
