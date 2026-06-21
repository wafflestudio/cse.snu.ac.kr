#!/bin/sh
# 단일 컨테이너에서 SSR(Hono)과 엣지(nginx)를 함께 띄운다.
# - Hono: 내부 8787, BEHIND_NGINX=1(본문에 placeholder nonce·HTML에 Cache-Control).
# - nginx: 공개 3000, ISR 캐시 + nonce 재주입 + CSP/보안 헤더.
set -e

term() {
  nginx -s quit 2>/dev/null || true
  kill -TERM "$HONO_PID" 2>/dev/null || true
}
trap term TERM INT

PORT=8787 BEHIND_NGINX=1 node_modules/.bin/tsx server.ts &
HONO_PID=$!

# Hono가 8787을 열 때까지 대기(초기 nginx 502 윈도우 회피).
until node -e 'require("net").connect(8787,"127.0.0.1").on("connect",()=>process.exit(0)).on("error",()=>process.exit(1))' 2>/dev/null; do
  kill -0 "$HONO_PID" 2>/dev/null || { echo "Hono 기동 실패" >&2; exit 1; }
  sleep 0.3
done

nginx -g 'daemon off;' &
NGINX_PID=$!

# busybox ash엔 `wait -n`이 없어 폴링 — 둘 중 하나라도 죽으면 나머지 정리 후 종료.
while kill -0 "$HONO_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 1
done
term
wait
