.PHONY: setup-gateway test-gateway test-worker test-scorer test e2e bench

setup-gateway:
	cd scorer-gateway && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt

test-gateway:
	cd scorer-gateway && pytest -v -m "not live"

test-gateway-live:
	cd scorer-gateway && pytest -v -m live

test-worker:
	cd worker && npm test

test-scorer:
	cd scorer && cargo test

test:
	$(MAKE) test-gateway
	$(MAKE) test-worker
	$(MAKE) test-scorer

e2e:
	./scripts/e2e.sh

bench:
	./scripts/bench_normalize.py
