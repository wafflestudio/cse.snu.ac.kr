#!/bin/bash
# 백업을 다른 호스트로 복사한다. ops 컨테이너 안에서 crond 가 부른다.
set -euo pipefail

# compose.ops.yml 이 정한다(기본값을 여기서 또 정하면 두 곳이 갈라진다).
: "${BACKUP_DIR:?compose.ops.yml 이 넣어준다}"
: "${METRICS_DIR:?compose.ops.yml 이 넣어준다}"
: "${OFFSITE_HOST:?compose.ops.yml 이 넣어준다 (예: csebackup@168.107.16.249)}"

# 받는 쪽 키는 authorized_keys 의 command= 로 backup-receive.sh 만 돌릴 수 있다.
# 그래서 원격 명령은 셸 문장이 아니라 그 스크립트가 아는 list·put·sha256·prune 뿐이고,
# 받는 경로·보관 기간도 받는 쪽이 정한다(이 키로 지우는 기간을 바꿀 수 없게).
KEY=/secrets/backup_offsite # compose 가 읽기 전용으로 마운트한다
# age 공개키(수신자) 파일. 한 줄에 하나, 여러 명이면 아무 개인키로나 풀린다. 개인키는 서버에 두지 않는다.
RECIPIENTS=/secrets/backup_age.pub
PORT=22
SEND_WINDOW_DAYS=7 # backup-receive.sh 의 PUT_WINDOW_DAYS 와 같은 값. 더 오래된 것은 받는 쪽이 거절한다
TOTAL=

# accept-new: 첫 접속만 받아들이고 이후 호스트 키 변경은 거부한다.
ssh_() {
    ssh -i "$KEY" -p "$PORT" -o StrictHostKeyChecking=accept-new \
        -o ConnectTimeout=20 -o BatchMode=yes "$OFFSITE_HOST" "$@"
}

copy_new() {
    [ -r "$KEY" ] || { echo "SSH 키를 읽을 수 없다: $KEY" >&2; exit 1; }
    if ! { [ -f "$RECIPIENTS" ] && grep -q '^age1' "$RECIPIENTS"; }; then
        echo "age 공개키가 없다: $RECIPIENTS (ops/README.md 의 키 만들기)" >&2
        exit 1
    fi
    local remote copied=0 f name enc local_sum remote_sum
    remote=$(ssh_ list)
    enc=$(mktemp)
    trap 'rm -f "$enc"' EXIT

    while IFS= read -r f; do
        name=$(basename "$f").age
        printf '%s\n' "$remote" | grep -qxF "$name" && continue

        # 받는 쪽(staging, 학외 클라우드)에는 암호문만 둔다. 암호화는 여기서, 풀기는 개인키를 가진 사람만.
        # 파일로 한 번 떨궈 해시를 잰다 — age 출력은 매번 달라 원본 해시와 비교할 수 없다.
        age -R "$RECIPIENTS" -o "$enc" "$f"
        ssh_ put "$name" <"$enc"

        # 크기가 아니라 해시로 본다 — 같은 크기로 깨진 전송도 잡는다.
        local_sum=$(sha256sum "$enc" | cut -d' ' -f1)
        # </dev/null: 안 막으면 ssh 가 이 while 의 입력(파일 목록)을 먹어 버린다.
        remote_sum=$(ssh_ sha256 "$name" </dev/null)
        [ "$local_sum" = "$remote_sum" ] || {
            echo "해시 불일치: $name (로컬 $local_sum / 원격 $remote_sum)" >&2
            exit 1
        }
        echo "복사: $name ($(($(stat -c %s "$enc") / 1024 / 1024))MB)"
        copied=$((copied + 1))
    done < <(find "$BACKUP_DIR" -maxdepth 1 -name 'mysqldump-*.gz' -mtime -"$SEND_WINDOW_DAYS" | sort)

    rm -f "$enc"
    trap - EXIT
    echo "$(date -Is) 오프사이트 복사 완료 → $OFFSITE_HOST (새로 $copied 개)"
}

# 보관 기간은 받는 쪽(backup-receive.sh)이 정한다. 여기선 정리하라고만 한다.
prune_remote() {
    ssh_ prune
    TOTAL=$(ssh_ list | wc -l)
    echo "원격 보관 중: $TOTAL 개"
}

# 실패하면 이 함수에 도달하지 않아 값이 늙는다 — 그게 신호다.
write_heartbeat() {
    [ -d "$METRICS_DIR" ] || return 0
    local t="$METRICS_DIR/backup_offsite.prom"
    {
        echo "# HELP csereal_backup_offsite_last_success_timestamp_seconds 마지막 오프사이트 복사 성공 시각"
        echo "# TYPE csereal_backup_offsite_last_success_timestamp_seconds gauge"
        echo "csereal_backup_offsite_last_success_timestamp_seconds $(date +%s)"
        echo "# HELP csereal_backup_offsite_files 원격에 보관 중인 백업 파일 수"
        echo "# TYPE csereal_backup_offsite_files gauge"
        echo "csereal_backup_offsite_files $TOTAL"
    } >"$t.tmp"
    mv "$t.tmp" "$t"
}

copy_new
prune_remote
write_heartbeat
