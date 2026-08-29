#!/bin/bash
# 호스트에서 실행: git URL로 docker build → 컨테이너 교체. 레지스트리 없음("빌드 == 배포").
# docker가 소스를 클론하므로(컨텍스트 = git URL#ref) 호스트엔 docker만 있으면 된다. 롤백은 이전 sha로 재실행.
# 필요 env: REF · BUILD_MODE(production|staging) · KAKAO(카맵키, build-arg)
# 선택   : CONTAINER(frontend) · PORT(3000) · SITE_HOST(cse.snu.ac.kr)
set -e
: "${REF:?REF 필요}"
: "${BUILD_MODE:?BUILD_MODE 필요}"
: "${KAKAO:?KAKAO(카맵키) 필요}"
CONTAINER="${CONTAINER:-frontend}"
PORT="${PORT:-3000}"
SITE_HOST="${SITE_HOST:-cse.snu.ac.kr}"
REPO="https://github.com/wafflestudio/cse.snu.ac.kr.git"

# 빌드 먼저: 실패하면 set -e로 멈춰 구버전이 계속 서빙된다(무중단).
echo "🔨 빌드: $REPO#$REF (mode=$BUILD_MODE)" >&2
docker build \
  --build-arg BUILD_MODE="$BUILD_MODE" \
  --build-arg VITE_KAKAO_MAP_API_KEY="$KAKAO" \
  -t "$CONTAINER:app" \
  "$REPO#$REF"

echo "🔁 컨테이너 교체" >&2
docker stop "$CONTAINER" 2>/dev/null || true
docker rm "$CONTAINER" 2>/dev/null || true
mkdir -p "$HOME/frontend-data/img-optimized" "$HOME/frontend-data/analytics"

# --add-host: 컨테이너 SSR의 절대 URL(cse.snu.ac.kr) → 호스트(엣지 Caddy)로 해석. 빠지면 전 페이지 500.
docker run -d --name "$CONTAINER" --restart unless-stopped \
  -p "$PORT:$PORT" \
  --add-host "$SITE_HOST:host-gateway" \
  -v "$HOME/frontend-data:/frontend-data" \
  "$CONTAINER:app"

sleep 2
docker ps --filter "name=$CONTAINER" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' >&2
docker image prune -f >/dev/null
echo "✅ 완료 (REF=$REF)" >&2
