#!/bin/bash

# 원격 서버에서 실행될 배포 스크립트
# 환경 변수로 전달되어야 할 값:
#   REMOTE_PATH, CONTAINER_NAME, IMAGE_NAME, BUILD_MODE, PORT

set -e

echo "📦 프로젝트 디렉토리로 이동 중..." >&2
cd $REMOTE_PATH

echo "🔄 Git 최신 변경사항 가져오는 중..." >&2
git pull --rebase

echo "📸 기존 컨테이너 이미지 백업 중..." >&2
# 2세대 이전 rollback 태그 먼저 삭제 (있다면)
docker rmi $IMAGE_NAME:rollback 2>/dev/null && echo "이전 rollback 태그 삭제" >&2 || true

PREV_IMAGE=$(docker inspect $CONTAINER_NAME --format='{{.Image}}' 2>/dev/null || echo "")
if [ -n "$PREV_IMAGE" ]; then
    echo "이전 이미지 ID: $PREV_IMAGE" >&2
    # 현재 이미지에 rollback 태그 붙여서 prune으로부터 보호
    docker tag $PREV_IMAGE $IMAGE_NAME:rollback >&2
    echo "이전 이미지를 $IMAGE_NAME:rollback으로 태그 지정" >&2
    echo "$PREV_IMAGE"
else
    echo "백업할 기존 컨테이너 없음" >&2
fi

echo "🏗️  Docker 이미지 빌드 중 ($BUILD_MODE 모드)..." >&2
docker build --build-arg BUILD_MODE=$BUILD_MODE -t $IMAGE_NAME:latest .

echo "🛑 기존 컨테이너 중지 중..." >&2
docker stop $CONTAINER_NAME 2>/dev/null || echo "실행 중인 컨테이너 없음" >&2
docker rm $CONTAINER_NAME 2>/dev/null || echo "삭제할 컨테이너 없음" >&2

echo "🚀 새 컨테이너 시작 중..." >&2
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:$PORT \
  $IMAGE_NAME:latest

echo "✅ 컨테이너 시작 완료" >&2

# 컨테이너 상태 확인
sleep 2
docker ps | grep $CONTAINER_NAME >&2

echo "🧹 사용하지 않는 이미지 정리 중..." >&2
docker image prune -f >&2
