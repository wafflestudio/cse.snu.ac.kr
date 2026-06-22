#!/bin/sh
# 단일 컨테이너에서 SSR(Hono)과 엣지(nginx)를 함께 띄운다.
# - Hono: 내부 8787, BEHIND_NGINX=1(본문에 placeholder nonce·HTML에 Cache-Control).
# - nginx: 공개 3000, ISR 캐시 + nonce 재주입 + CSP/보안 헤더.
set -e

# CSP nonce placeholder를 기동마다 랜덤 비밀로 생성(소스에 없음 → public repo로도 못 앎).
# 고정 마법문자열이면 공격자가 콘텐츠에 그걸 심어 nginx가 유효 nonce를 찍어주는 XSS 우회가
# 가능 → 비밀 토큰이면 공격자가 못 주입한다. Hono(본문에 박음)와 nginx(sub_filter)가 같은 값 공유.
# 컨테이너-로컬 캐시는 기동마다 콜드라 placeholder 불일치 없음.
CSP_NONCE_PLACEHOLDER="__CSPNONCE_$(node -e 'process.stdout.write(require("crypto").randomBytes(16).toString("hex"))')__"
export CSP_NONCE_PLACEHOLDER
printf "sub_filter_once off;\nsub_filter '%s' '\$request_id';\n" "$CSP_NONCE_PLACEHOLDER" \
  > /etc/nginx/sub_filter.conf

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
