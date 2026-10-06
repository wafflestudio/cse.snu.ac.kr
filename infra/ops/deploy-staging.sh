#!/usr/bin/env bash
# staging 수동 배포: deploy.yml 의 배포 단계를 로컬에서 그대로 한다(호스트에 SSH → 레포를 그 커밋으로 → host-deploy.sh).
# 기능 브랜치를 develop 에 머지하기 전에 staging 에서 보고 싶을 때 쓴다. 다음 develop push 가 다시 덮는다.
# production 은 지원하지 않는다 — main 머지 → Actions 만이 길이다(리뷰 관문).
#
#   KAKAO=<카카오맵 키> infra/ops/deploy-staging.sh [ref]   # ref 기본값 HEAD. 원격에 푸시된 커밋이어야 한다.
#
# 접속은 내 SSH 키로 infra/staging.env 의 SSH_USER@SSH_HOST 에 들어간다(그 호스트에 내 공개키가 등록돼 있어야 한다).
set -euo pipefail
cd "$(dirname "$0")/../.."

: "${KAKAO:?KAKAO(카카오맵 키)가 필요하다 — GitHub 시크릿 KAKAO_MAP_KEY 와 같은 값}"
REF=${1:-HEAD}
GIT_SHA=$(git rev-parse --verify "$REF^{commit}")
TARGET=staging

# 호스트는 GitHub 에서 받아 빌드하므로, 원격에 없는 커밋은 배포할 수 없다.
git fetch -q origin
if ! git branch -r --contains "$GIT_SHA" | grep -q .; then
    echo "✗ $GIT_SHA 가 원격에 없다. 먼저 푸시한다." >&2
    exit 1
fi

set -a; . "infra/$TARGET.env"; set +a
echo "▸ $TARGET($SSH_HOST) 에 ${GIT_SHA:0:12} 배포: $(git log -1 --format=%s "$GIT_SHA")"

# deploy.yml 의 remote.sh 와 같은 내용.
remote=$(cat <<'REMOTE'
set -e
mkdir -p ~/proxy
W=~/build/cse.snu.ac.kr
[ -d "$W/.git" ] || git clone -q https://github.com/wafflestudio/cse.snu.ac.kr.git "$W"
cd "$W"
git fetch -q origin
git reset -q --hard "$GIT_SHA"
bash infra/ops/host-deploy.sh
REMOTE
)

# 처음 보는 호스트 키는 저장하고(deploy.yml 과 같다), 이후 키가 바뀌면 막는다.
ssh -p "$SSH_PORT" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 "$SSH_USER@$SSH_HOST" \
    GIT_SHA="$GIT_SHA" TARGET="$TARGET" KAKAO="$KAKAO" 'bash -s' <<<"$remote"

echo "✓ 배포 끝: https://$URL"
