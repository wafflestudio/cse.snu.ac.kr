#!/bin/bash
# 호스트에서 실행되는 배포 스크립트(pull 기반). 호스트에서 build하지 않고 CI가 GHCR에 올린
# 이미지를 pull해서 교체한다 → prod 빌드 부하 제거, 백엔드 GHCR 패턴과 통일.
#
# 호출: deploy.sh(수동 prod/staging) · deploy.yml의 staging 자동 배포. 둘 다 이 스크립트를 SSH로 보냄.
#
# 필요한 환경변수:
#   CONTAINER_NAME  (예: frontend)
#   IMAGE           (예: ghcr.io/wafflestudio/cse.snu.ac.kr:prod — 태그 포함 전체 ref)
#   PORT            (예: 3000)
#
# 전제: 호스트 docker가 GHCR pull 가능해야 함(패키지 private이면 `docker login ghcr.io` 선행).
set -e

: "${CONTAINER_NAME:?CONTAINER_NAME 필요}"
: "${IMAGE:?IMAGE 필요(예: ghcr.io/OWNER/cse.snu.ac.kr:prod)}"
: "${PORT:?PORT 필요}"

ROLLBACK_TAG="cse.snu.ac.kr:rollback"

echo "📥 새 이미지 pull: $IMAGE" >&2
docker pull "$IMAGE"

# 현재 실행 중 이미지를 rollback 태그로 보존(prune 보호 + 즉시 롤백용).
CURRENT_IMAGE=$(docker inspect "$CONTAINER_NAME" --format='{{.Image}}' 2>/dev/null || echo "")
if [ -n "$CURRENT_IMAGE" ]; then
  docker tag "$CURRENT_IMAGE" "$ROLLBACK_TAG" >&2
  echo "현재 이미지를 $ROLLBACK_TAG 로 태그(롤백용): ${CURRENT_IMAGE:0:19}" >&2
  echo "$CURRENT_IMAGE" # deploy.sh가 롤백 안내에 사용
else
  echo "백업할 기존 컨테이너 없음" >&2
fi

echo "🛑 기존 컨테이너 중지/삭제…" >&2
docker stop "$CONTAINER_NAME" 2>/dev/null || echo "실행 중 컨테이너 없음" >&2
docker rm "$CONTAINER_NAME" 2>/dev/null || echo "삭제할 컨테이너 없음" >&2

echo "🚀 새 컨테이너 시작…" >&2
FRONTEND_DATA_DIR="/home/$(whoami)/frontend-data"
mkdir -p "$FRONTEND_DATA_DIR/img-optimized" "$FRONTEND_DATA_DIR/analytics"

# 배포 환경의 사이트 호스트명을 컨테이너 안에서 엣지(= docker 호스트)로 해석시킨다.
#
# prod 빌드는 API_PROXY_TARGET 없이 **절대 URL 직호출**이라(VITE_API_BASE_URL이 번들에 박힘)
# SSR이 `https://cse.snu.ac.kr/api/...`를 부른다. 그런데 도메인 연결 전(2026-08 IP 이전 중)
# 에는 이 호스트명이 어디서도 해석되지 않아 **모든 페이지가 500**이 된다(getaddrinfo 실패).
# 11일 된 컨테이너가 살아 있는 동안엔 드러나지 않다가 재생성 시점에 터진다 — 실제로
# 2026-08-22 배포에서 겪었고, 롤백해도 같은 증상이라 코드가 아닌 환경 문제임이 드러났다.
#
# host-gateway로 매핑하면 컨테이너 → 호스트 Caddy → 백엔드로 정상 도달한다(호스트 IP를
# 하드코딩하지 않아 IP가 또 바뀌어도 유효). 도메인이 연결된 뒤에도 무해하다 — 공인 DNS
# 대신 같은 목적지를 가리킬 뿐이고, 오히려 SSR이 외부를 한 바퀴 돌지 않는다.
SITE_HOST="${SITE_HOST:-cse.snu.ac.kr}"

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT:$PORT" \
  --add-host "$SITE_HOST:host-gateway" \
  -v "$FRONTEND_DATA_DIR:/frontend-data" \
  "$IMAGE"

sleep 2
docker ps | grep "$CONTAINER_NAME" >&2

echo "🧹 미사용 이미지 정리…" >&2
docker image prune -f >&2
