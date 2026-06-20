# Single image running all four eval projects.
#
# Local build (pre-built Rust scorers required if Docker cannot reach crates.io):
#   cd Fraud-score-system/scorer && cargo build
#   cd screen-scraper/scorer && cargo build
#   docker build -t eval-workspace .
#
# Railway build (Rust compiled inside Docker):
#   docker build --build-arg RAILWAY=true -t eval-workspace .
#
# Local run:
#   docker run --rm -p 8000:8000 -p 8001:8001 -p 8002:8002 -p 8003:8003 \
#     -p 5174:5174 -p 5175:5175 -p 5176:5176 eval-workspace
#
# Railway run (single public port):
#   docker run --rm -e PORT=8080 -p 8080:8080 eval-workspace

ARG RAILWAY=false

# ── Stage 1: Transaction Ledger React build ──
FROM node:20-alpine AS ledger-fe
ARG RAILWAY
WORKDIR /build
COPY transaction-ledger/frontend/package.json transaction-ledger/frontend/package-lock.json ./
RUN npm ci
COPY transaction-ledger/frontend/ ./
RUN if [ "$RAILWAY" = "true" ]; then \
      export VITE_BASE_PATH=/ledger/ VITE_API_URL=/ledger/api; \
    else \
      export VITE_API_URL=/api; \
    fi && npm run build

# ── Stage 2: Currency Converter React build ──
FROM node:20-alpine AS converter-fe
ARG RAILWAY
WORKDIR /build
COPY currency-converter/frontend/package.json currency-converter/frontend/package-lock.json ./
RUN npm ci
COPY currency-converter/frontend/ ./
RUN if [ "$RAILWAY" = "true" ]; then \
      export VITE_BASE_PATH=/converter/ VITE_API_URL=/converter-api; \
    else \
      export VITE_API_URL=http://127.0.0.1:8001; \
    fi && npm run build

# ── Stage 3: Screen Scraper React build ──
FROM node:20-alpine AS scraper-fe
ARG RAILWAY
WORKDIR /build
COPY screen-scraper/frontend/package.json screen-scraper/frontend/package-lock.json ./
RUN npm ci
COPY screen-scraper/frontend/ ./
COPY screen-scraper/docs/eval/advanced/ ./public/eval/advanced/
RUN if [ "$RAILWAY" = "true" ]; then \
      export VITE_BASE_PATH=/scraper/ VITE_USE_PROXY=true VITE_SCRAPER_API_BASE_URL=/scraper-api; \
    else \
      export VITE_USE_PROXY=true; \
    fi && npm run build

# ── Stage 4: Fraud scorer (Railway builds in Docker) ──
FROM rust:1.83-bookworm AS fraud-scorer-build
WORKDIR /build
COPY Fraud-score-system/scorer/Cargo.toml Fraud-score-system/scorer/Cargo.lock* ./
COPY Fraud-score-system/scorer/src/ src/
RUN cargo build --release 2>/dev/null || cargo build --release

# ── Stage 5: Screen scraper scorer ──
FROM rust:1.83-bookworm AS scraper-scorer-build
WORKDIR /build
COPY screen-scraper/scorer/Cargo.toml screen-scraper/scorer/Cargo.lock* ./
COPY screen-scraper/scorer/src/ src/
RUN cargo build --release 2>/dev/null || cargo build --release

# ── Stage 6: Runtime ──
FROM python:3.12-slim-bookworm
ARG RAILWAY=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip install --no-cache-dir \
    "fastapi>=0.110.0" \
    "uvicorn[standard]>=0.27.0" \
    "pydantic>=2.0.0" \
    "pydantic-settings>=2.0.0" \
    "python-dotenv>=1.0.0" \
    "httpx>=0.27.0"

COPY transaction-ledger/app/ transaction-ledger/app/
COPY transaction-ledger/requirements.txt transaction-ledger/
COPY --from=ledger-fe /build/dist transaction-ledger/static/

COPY currency-converter/service/app/ currency-converter/service/app/

COPY Fraud-score-system/api/app/ Fraud-score-system/api/app/
COPY Fraud-score-system/api/static/ Fraud-score-system/api/static/
COPY Fraud-score-system/worker/ Fraud-score-system/worker/
COPY --from=fraud-scorer-build /build/target/release/scorer Fraud-score-system/scorer/scorer

COPY screen-scraper/scorer-gateway/app/ screen-scraper/scorer-gateway/app/
COPY screen-scraper/worker/ screen-scraper/worker/
COPY screen-scraper/shared/ screen-scraper/shared/
COPY --from=scraper-scorer-build /build/target/release/scorer screen-scraper/scorer/scorer

COPY --from=converter-fe /build/dist /var/www/converter/
COPY --from=scraper-fe /build/dist /var/www/scraper/
COPY examiner-hub/ /var/www/examiner-hub/

COPY docker/nginx.conf /etc/nginx/eval/nginx.conf
COPY docker/nginx-gateway.conf.template /etc/nginx/eval/nginx-gateway.conf.template
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && mkdir -p /var/log/nginx /tmp \
    && sed -i 's|pid /run/nginx.pid;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf 2>/dev/null || true

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD sh -c 'curl -sf "http://127.0.0.1:$${PORT:-8080}/health" || curl -sf http://127.0.0.1:8000/api/health || exit 1'

ENTRYPOINT ["/entrypoint.sh"]
