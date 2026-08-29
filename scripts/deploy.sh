#!/bin/bash
# 배포: 호스트가 git URL로 docker build → 컨테이너 교체(레지스트리 없음).
# 사용법: ./deploy.sh <staging|prod> [git-ref]   (ref 생략 시 환경 브랜치, 롤백은 이전 sha)
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

ENV="$1"; REF="$2"
if [ "$ENV" != "staging" ] && [ "$ENV" != "prod" ]; then
  echo -e "${RED}사용법: ./deploy.sh <staging|prod> [git-ref]${NC}"; exit 1
fi

# host/user/port·브랜치는 비밀이 아니라 여기 직접 둔다(커밋·리뷰됨, 드리프트 없음).
if [ "$ENV" == "staging" ]; then
  SSH_USER=ubuntu;  SSH_HOST=168.107.16.249;  SSH_PORT=22;    BRANCH=develop; BUILD_MODE=staging
else
  SSH_USER=waffle;  SSH_HOST=147.46.92.120;   SSH_PORT=9122;  BRANCH=main;    BUILD_MODE=production
fi
REF="${REF:-$BRANCH}"

# 카맵키(git 밖)는 로컬 env/.env에서 읽어 build-arg로 넘긴다.
KAKAO=$(grep -E '^VITE_KAKAO_MAP_API_KEY=' env/.env 2>/dev/null | cut -d= -f2-)
[ -n "$KAKAO" ] || { echo -e "${RED}오류: env/.env에 VITE_KAKAO_MAP_API_KEY(지도 키)가 없습니다.${NC}"; exit 1; }

echo -e "${BLUE}배포: ${ENV} ← ${REF}  (호스트 ${SSH_USER}@${SSH_HOST}:${SSH_PORT}에서 빌드+교체)${NC}"
read -p "계속할까요? (yes/no): " -r; [[ "$REPLY" =~ ^[Yy][Ee][Ss]$ ]] || { echo -e "${BLUE}취소.${NC}"; exit 0; }
if [ "$ENV" == "prod" ]; then
  echo -e "${RED}⚠️  프로덕션 배포입니다.${NC}"
  read -p "정말로 진행할까요? (yes/no): " -r; [[ "$REPLY" =~ ^[Yy][Ee][Ss]$ ]] || { echo -e "${BLUE}취소.${NC}"; exit 0; }
fi

# SSH 인증은 각자 환경(ssh-agent·~/.ssh/config)에 위임 — 스크립트는 키를 안 만진다.
ssh -p "$SSH_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$SSH_USER@$SSH_HOST" \
  "REF='$REF' BUILD_MODE='$BUILD_MODE' KAKAO='$KAKAO' bash -s" < "$(dirname "$0")/remote-deploy.sh"

echo -e "${GREEN}✅ 완료. 롤백: ./deploy.sh $ENV <이전-sha>${NC}"
