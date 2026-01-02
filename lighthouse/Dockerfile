FROM node:20-bullseye-slim

ENV CI=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Lighthouse 실행을 위한 최소 런타임 의존성 설치
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    chromium \
    curl \
    fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g lighthouse@12.2.1

ENV SUPERCRONIC_VERSION=v0.2.29
# cron 대체 도구(supercronic) 설치
RUN curl -fsSL -o /usr/local/bin/supercronic \
    https://github.com/aptible/supercronic/releases/download/${SUPERCRONIC_VERSION}/supercronic-linux-amd64 \
  && chmod +x /usr/local/bin/supercronic

WORKDIR /app
ENV LIGHTHOUSE_OUTPUT_DIR=/lighthouse
ENV LIGHTHOUSE_CHROME_FLAGS="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"

# 엔트리포인트 스크립트로 스케줄 실행
COPY lighthouse/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
