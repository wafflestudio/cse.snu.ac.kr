#!/bin/sh
set -eu

# Lighthouse 컨테이너를 빌드하고 실행하는 간단 스크립트입니다.

IMAGE_NAME="cse-lighthouse"
LIGHTHOUSE_CONTAINER_NAME="cse-lighthouse"
LIGHTHOUSE_HOST_OUTPUT_DIR="../lighthouse"

HOST_OUTPUT_DIR="${LIGHTHOUSE_HOST_OUTPUT_DIR}"

if docker ps -a --format '{{.Names}}' | grep -q "^${LIGHTHOUSE_CONTAINER_NAME}$"; then
  # 동일한 이름의 컨테이너가 있으면 정리합니다.
  docker rm -f "${LIGHTHOUSE_CONTAINER_NAME}" >/dev/null
fi

if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:latest$"; then
  # 기존 이미지는 삭제 후 재빌드합니다.
  docker rmi -f "${IMAGE_NAME}:latest" >/dev/null || true
fi

docker build -f lighthouse/Dockerfile -t "$IMAGE_NAME" .

docker run -d \
  --name "${LIGHTHOUSE_CONTAINER_NAME}" \
  --restart unless-stopped \
  -v "$LIGHTHOUSE_HOST_OUTPUT_DIR:/lighthouse" \
  -v "lighthouse/urls.txt:/lighthouse/urls.txt:ro" \
  "$IMAGE_NAME"
