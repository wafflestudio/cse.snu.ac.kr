#!/usr/bin/env bash
# RR식 코드기반 → 파일기반 구조 컷오버(깨끗한 트리에서 1회 실행).
# 이후 vite.config(file-based)·router.tsx(생성 트리)·코드기반 산출물 삭제는 별도.
set -euo pipefail
cd "$(dirname "$0")/.."
R=app/routes
L="$R/{-\$locale}"

mkdir -p "$L"
# main/* → {-$locale}/ 루트 (main/index.tsx → '/')
for f in "$R"/main/*; do mv "$f" "$L"/; done
rmdir "$R"/main
# 로케일 도메인 통째 이동(도메인 내부 상대 import 보존)
for d in search about community people research admissions academics reservations 10-10-project; do
  mv "$R/$d" "$L/$d"
done
# 비라우트 파일 정리
mkdir -p app/components/system app/lib/server
mv "$R/404.tsx" app/components/system/NotFound.tsx
mv "$R/img.tsx" app/lib/server/img.tsx
rm "$R/layout.tsx"               # __root에 흡수
mv "$R/internal" "$R/[.]internal" # /.internal 리터럴 점

# 비라우트 참조 갱신
perl -pi -e 's{~/routes/404}{~/components/system/NotFound}g' "$R/__root.tsx"
perl -pi -e 's{\.\./\.\./app/routes/img}{../../app/lib/server/img}g' tests/setup/preview-server.ts

# 라우트 파일 createFileRoute 변환(1회) + 이동 도메인 절대 import 재작성
node scripts/convert-routes.mjs
node scripts/fix-absolute-imports.mjs
echo "[cutover] 구조 변환 완료"
