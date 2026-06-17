from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_convert_usd_to_eur():
    response = client.post(
        "/convert",
        json={"amount": 100, "from": "USD", "to": "EUR"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["amount"] == 100
    assert body["from"] == "USD"
    assert body["to"] == "EUR"
    assert body["converted_amount"] == 92.0
    assert body["rate"] == 0.92


def test_rejects_invalid_currency():
    response = client.post(
        "/convert",
        json={"amount": 100, "from": "USD", "to": "JPY"},
    )
    assert response.status_code == 422


def test_rejects_invalid_amount():
    response = client.post(
        "/convert",
        json={"amount": -10, "from": "USD", "to": "EUR"},
    )
    assert response.status_code == 422


def test_rejects_same_currency():
    response = client.post(
        "/convert",
        json={"amount": 100, "from": "USD", "to": "USD"},
    )
    assert response.status_code == 400
    assert "must differ" in response.json()["detail"]
