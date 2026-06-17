import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.store import store, user_store

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_store():
    store.reset()
    user_store.reset()
    yield
    store.reset()
    user_store.reset()


def test_create_and_list_transactions():
    response = client.post(
        "/api/transactions",
        json={
            "id": 1,
            "amount": 100.0,
            "type": "credit",
            "description": "Initial deposit",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["account_id"] == 1
    assert data["amount"] == 100.0
    assert data["type"] == "credit"

    list_response = client.get("/api/transactions", params={"id": 1})
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1


def test_balance_reflects_credits_and_debits():
    client.post("/api/transactions", json={"id": 1, "amount": 500.0, "type": "credit"})
    client.post("/api/transactions", json={"id": 1, "amount": 150.0, "type": "debit"})
    client.post("/api/transactions", json={"id": 1, "amount": 50.0, "type": "credit"})

    response = client.get("/api/balance", params={"id": 1})
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == 1
    assert body["balance"] == 400.0
    assert body["transaction_count"] == 3


def test_balance_is_scoped_per_account():
    client.post("/api/transactions", json={"id": 1, "amount": 100.0, "type": "credit"})
    client.post("/api/transactions", json={"id": 2, "amount": 200.0, "type": "credit"})

    response = client.get("/api/balance", params={"id": 1})
    assert response.status_code == 200
    assert response.json()["balance"] == 100.0

    response = client.get("/api/balance", params={"id": 2})
    assert response.status_code == 200
    assert response.json()["balance"] == 200.0


def test_rejects_unknown_user():
    response = client.post(
        "/api/transactions",
        json={"id": 999, "amount": 10.0, "type": "credit"},
    )
    assert response.status_code == 404

    response = client.get("/api/balance", params={"id": 999})
    assert response.status_code == 404


def test_list_users():
    response = client.get("/api/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 3
    assert users[0]["id"] == 1
    assert users[0]["name"] == "Alice Johnson"


def test_rejects_debit_exceeding_balance():
    client.post("/api/transactions", json={"id": 1, "amount": 50.0, "type": "credit"})

    response = client.post(
        "/api/transactions",
        json={"id": 1, "amount": 100.0, "type": "debit"},
    )
    assert response.status_code == 400
    assert "Insufficient balance" in response.json()["detail"]

    balance = client.get("/api/balance", params={"id": 1}).json()
    assert balance["balance"] == 50.0


def test_rejects_invalid_transaction():
    response = client.post(
        "/api/transactions",
        json={"id": 1, "amount": -10.0, "type": "credit"},
    )
    assert response.status_code == 422

    response = client.post(
        "/api/transactions",
        json={"id": 1, "amount": 10.0, "type": "invalid"},
    )
    assert response.status_code == 422

    response = client.post(
        "/api/transactions",
        json={"amount": 10.0, "type": "credit"},
    )
    assert response.status_code == 422


def test_empty_balance():
    response = client.get("/api/balance", params={"id": 1})
    assert response.status_code == 200
    assert response.json() == {"id": 1, "balance": 0.0, "transaction_count": 0}
