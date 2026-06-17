from datetime import datetime, timezone

from fastapi import HTTPException

from app.models import Transaction, TransactionCreate, TransactionType, User


class UserStore:
    """In-memory user store backed by a dict map."""

    def __init__(self) -> None:
        self._users: dict[int, User] = {}
        self._seed()

    def _seed(self) -> None:
        dummy_users = [
            User(id=1, name="Alice Johnson", email="alice@example.com"),
            User(id=2, name="Bob Smith", email="bob@example.com"),
            User(id=3, name="Carol Lee", email="carol@example.com"),
        ]
        for user in dummy_users:
            self._users[user.id] = user

    def get(self, user_id: int) -> User | None:
        return self._users.get(user_id)

    def require(self, user_id: int) -> User:
        user = self.get(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
        return user

    def list_all(self) -> list[User]:
        return list(self._users.values())

    def reset(self) -> None:
        self._users.clear()
        self._seed()


class TransactionStore:
    """In-memory transaction ledger."""

    def __init__(self, user_store: UserStore) -> None:
        self._user_store = user_store
        self._transactions: list[Transaction] = []
        self._next_id = 1

    def add(self, payload: TransactionCreate) -> Transaction:
        self._user_store.require(payload.id)

        if payload.type == TransactionType.DEBIT:
            current_balance, _ = self.balance(payload.id)
            if current_balance - payload.amount < 0:
                raise HTTPException(status_code=400, detail="Insufficient balance for debit")

        transaction = Transaction(
            id=self._next_id,
            account_id=payload.id,
            amount=payload.amount,
            type=payload.type,
            description=payload.description,
            created_at=datetime.now(timezone.utc),
        )
        self._next_id += 1
        self._transactions.append(transaction)
        return transaction

    def list_all(self, account_id: int | None = None) -> list[Transaction]:
        if account_id is not None:
            self._user_store.require(account_id)
        if account_id is None:
            return list(self._transactions)
        return [txn for txn in self._transactions if txn.account_id == account_id]

    def balance(self, account_id: int) -> tuple[float, int]:
        self._user_store.require(account_id)

        total = 0.0
        count = 0
        for txn in self._transactions:
            if txn.account_id != account_id:
                continue
            count += 1
            if txn.type == TransactionType.CREDIT:
                total += txn.amount
            else:
                total -= txn.amount
        return round(total, 2), count

    def reset(self) -> None:
        self._transactions.clear()
        self._next_id = 1


user_store = UserStore()
store = TransactionStore(user_store=user_store)
