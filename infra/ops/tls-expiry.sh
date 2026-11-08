#!/bin/bash
# 사이트가 실제로 내보내는 인증서의 만료 시각을 지표로 남긴다. ops 컨테이너 안에서 crond 가 부른다.
# 파일이 아니라 443 을 본다: 2026-08-01 장애는 새 인증서를 받아 놓고 설치하지 않아서 났다.
set -euo pipefail

: "${TLS_HOST:?compose.ops.yml 이 넣어준다}"
: "${METRICS_DIR:?compose.ops.yml 이 넣어준다}"

NOT_AFTER=$(openssl s_client -connect "$TLS_HOST:443" -servername "$TLS_HOST" </dev/null 2>/dev/null |
    openssl x509 -noout -enddate | cut -d= -f2)
EPOCH=$(date -d "$NOT_AFTER" +%s)

# 임시 파일에 쓰고 옮긴다. node_exporter 가 쓰다 만 파일을 읽으면 지표가 사라진다.
T="$METRICS_DIR/tls_expiry.prom"
{
    echo "# HELP csereal_tls_not_after_timestamp_seconds 사이트 인증서 만료 시각"
    echo "# TYPE csereal_tls_not_after_timestamp_seconds gauge"
    echo "csereal_tls_not_after_timestamp_seconds $EPOCH"
} >"$T.tmp"
mv "$T.tmp" "$T"
echo "$TLS_HOST 인증서 만료: $NOT_AFTER"
