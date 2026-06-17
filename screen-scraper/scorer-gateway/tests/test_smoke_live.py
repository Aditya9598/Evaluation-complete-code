import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.config import settings

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"


@pytest.mark.live
def test_live_scraper_market_status():
    import httpx

    base = settings.scraper_api_base_url.rstrip("/")
    response = httpx.get(f"{base}/api/v1/market-status/today", timeout=15.0)
    assert response.status_code == 200
    data = response.json()
    assert "market_status" in data
