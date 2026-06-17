import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.store import store
from app.text_analysis import normalize_text

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_store():
    store.reset()
    normalize_text.cache_clear()
    yield
    store.reset()
    normalize_text.cache_clear()


def test_ingest_and_get_job():
    response = client.post(
        "/jobs",
        json={
            "contract_version": "1.0",
            "job_id": "job-1",
            "title": "Nifty rally today",
            "body": "Markets gained on strong FII buying.",
            "source": "economic_times",
        },
    )
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
    assert client.get("/jobs/job-1").status_code == 200


def test_status_lifecycle_to_scored():
    client.post(
        "/jobs",
        json={
            "contract_version": "1.0",
            "job_id": "job-2",
            "title": "Stock market update",
            "body": "Sensex closed higher.",
            "source": "economic_times",
        },
    )
    assert client.patch("/jobs/job-2/claim").json()["status"] == "processing"
    score_resp = client.post(
        "/jobs/job-2/score",
        json={
            "contract_version": "1.0",
            "job_id": "job-2",
            "relevance_score": 70,
            "risk_score": 10,
            "reasons": ["market_keywords"],
        },
    )
    assert score_resp.status_code == 200
    assert score_resp.json()["status"] == "scored"


def test_rejects_wrong_contract_version():
    response = client.post(
        "/jobs",
        json={
            "contract_version": "2.0",
            "job_id": "job-3",
            "title": "Test",
            "body": "",
            "source": "economic_times",
        },
    )
    assert response.status_code == 400


def test_normalize_text_cache():
    first = normalize_text("Nifty 50 Rally!!!")
    second = normalize_text("Nifty 50 Rally!!!")
    assert first == second
    info = normalize_text.cache_info()
    assert info.hits >= 1
