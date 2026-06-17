from fastapi import HTTPException

from app.models import (
    CONTRACT_VERSION,
    ArticleIngest,
    ArticleJob,
    JobStatus,
    ScoreResult,
)


class JobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, ArticleJob] = {}

    def add(self, payload: ArticleIngest) -> ArticleJob:
        if payload.contract_version != CONTRACT_VERSION:
            raise HTTPException(status_code=400, detail="unsupported contract_version")
        if payload.job_id in self._jobs:
            raise HTTPException(status_code=409, detail="job_id already exists")

        job = ArticleJob(
            contract_version=payload.contract_version,
            job_id=payload.job_id,
            title=payload.title,
            body=payload.body,
            source=payload.source,
            status=JobStatus.PENDING,
        )
        self._jobs[payload.job_id] = job
        return job

    def get(self, job_id: str) -> ArticleJob:
        job = self._jobs.get(job_id)
        if job is None:
            raise HTTPException(status_code=404, detail="job not found")
        return job

    def list_pending(self) -> list[ArticleJob]:
        return [j for j in self._jobs.values() if j.status == JobStatus.PENDING]

    def claim(self, job_id: str) -> ArticleJob:
        job = self.get(job_id)
        if job.status != JobStatus.PENDING:
            raise HTTPException(status_code=409, detail=f"cannot claim status {job.status}")
        job.status = JobStatus.PROCESSING
        return job

    def submit_score(self, job_id: str, score: ScoreResult) -> ArticleJob:
        if score.contract_version != CONTRACT_VERSION:
            raise HTTPException(status_code=400, detail="unsupported contract_version")
        job = self.get(job_id)
        if job.status != JobStatus.PROCESSING:
            raise HTTPException(status_code=409, detail=f"cannot score status {job.status}")
        job.score = score
        job.status = JobStatus.SCORED
        return job

    def mark_failed(self, job_id: str) -> ArticleJob:
        job = self.get(job_id)
        if job.status not in (JobStatus.PENDING, JobStatus.PROCESSING):
            raise HTTPException(status_code=409, detail=f"cannot fail status {job.status}")
        job.status = JobStatus.FAILED
        return job

    def reset(self) -> None:
        self._jobs.clear()


store = JobStore()
