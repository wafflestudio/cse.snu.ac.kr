#!/usr/bin/env bash
# E2E 단일 진입점 — `pnpm test`가 부른다. 스택 정의·기동 순서·health 대기는 전부
# tests/setup/compose.yml이 선언한다(db → backend healthy → e2e). 여기는 호스트 UX만:
# --ui 포트 공개와 TTY 처리.
#
# 사용:
#   pnpm test                       # 전체 검증(Linux baseline 대조)
#   pnpm test --update-snapshots    # baseline 재생성(호스트 tests/에 PNG 기록)
#   pnpm test tests/research/labs   # 특정 경로/프로젝트 등 인자 패스스루
#   pnpm test:ui                    # UI 모드 — 호스트 브라우저에서 http://localhost:43210
set -eo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

run_flags=(--rm)
args=("$@")
for a in "$@"; do
  if [ "$a" = "--ui" ]; then
    run_flags+=(--service-ports) # compose.yml의 e2e ports(43210) 공개
    args+=("--ui-host=0.0.0.0" "--ui-port=43210")
    echo "[e2e] UI 모드 — 호스트 브라우저에서 http://localhost:43210 열기"
  fi
done
[ -t 1 ] || run_flags+=(-T) # CI 등 TTY 없는 환경

exec docker compose -f tests/setup/compose.yml run "${run_flags[@]}" e2e "${args[@]}"
