#!/bin/sh
set -eu

# 컨테이너 내부에서 Lighthouse를 주기적으로 실행하는 엔트리입니다.

# 호스트에 마운트된 결과 저장 경로입니다.
OUT_DIR="/lighthouse"

# Lighthouse 실행에 사용할 Chromium 플래그입니다.
CHROME_FLAGS="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"

# URL 목록을 파일로 관리하는 경로입니다.
URLS_FILE="/lighthouse/urls.txt"
URLS=""

# 매일 새벽 2시에 실행하는 크론 스케줄입니다.
CRON="0 2 * * *"
CRON_STRIPPED="$CRON"

# 컨테이너 시작 시 즉시 1회 실행할지 여부입니다. (1=실행)
RUN_ON_START="1"
RUNS="${LIGHTHOUSE_RUNS:-5}"

if [ -f "$URLS_FILE" ]; then
  echo "URL 목록 파일을 읽습니다: $URLS_FILE" >&2
  URLS="$(cat "$URLS_FILE")"
else
  echo "URL 목록 파일이 없습니다: $URLS_FILE" >&2
  exit 1
fi

run_lighthouse() {
  NOW="$(date +%Y%m%d-%H%M%S)"
  echo "Lighthouse 실행 시작: $NOW" >&2
  mkdir -p "$OUT_DIR/$NOW"
  clean_name() {
    # URL을 파일명으로 안전하게 변환합니다.
    echo "$1" \
      | sed -E 's|https?://||' \
      | sed -E 's|/|_|g' \
      | sed -E 's|[^a-zA-Z0-9._-]|_|g'
  }
  echo "$URLS" | while IFS= read -r url; do
    raw_line="$(echo "$url" | tr -d '\r')"
    raw_line="$(echo "$raw_line" | sed -E 's/[[:space:]]+#.*$//')"
    url="$(echo "$raw_line" | sed -E 's/^[[:space:]]+|[[:space:]]+$//g' | sed -E 's/^"(.*)"$/\\1/' | sed -E "s/^'(.*)'$/\\1/")"
    case "$url" in
      ""|\#*) continue ;;
    esac
    name="$(clean_name "$url")"
    for preset in mobile desktop; do
      json_path="$OUT_DIR/$NOW/${name}.${preset}.json"
      html_path="$OUT_DIR/$NOW/${name}.${preset}.html"
      echo "대상 URL: $url ($preset)" >&2
      echo "결과 저장 경로: $OUT_DIR/$NOW" >&2
      lighthouse "$url" \
        --output json --output html \
        --output-path "$json_path" \
        --quiet --no-enable-error-reporting \
        --preset="$preset" \
        --chrome-flags="$CHROME_FLAGS"
      if [ -f "$json_path" ] && [ ! -f "$html_path" ]; then
        if [ -f "${json_path%.json}.report.html" ]; then
          mv "${json_path%.json}.report.html" "$html_path"
        fi
      fi
    done
  done
}

if [ "$RUN_ON_START" = "1" ]; then
  # 컨테이너 시작 직후 1회 실행합니다.
  echo "컨테이너 시작 시 즉시 1회 실행합니다." >&2
  run_lighthouse
fi

echo "크론 스케줄을 등록합니다: $CRON_STRIPPED" >&2
echo "$CRON_STRIPPED /entrypoint.sh" > /etc/cron.d/lighthouse

echo "스케줄러를 시작합니다." >&2
exec /usr/local/bin/supercronic /etc/cron.d/lighthouse
