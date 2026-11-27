#!/bin/bash
# 오프사이트 백업을 "받는 쪽"(staging 호스트)에서 도는 SSH 강제 명령(forced command).
# prod 의 backup-offsite.sh 가 보내는 명령 네 가지만 받고 나머지는 거절한다.
#
# 설치는 infra/ops/README.md "오프사이트 백업 받는 쪽 설치". authorized_keys 한 줄:
#   restrict,command="/usr/local/bin/csereal-backup-receive" ssh-ed25519 AAAA... csereal-backup
#
# 왜 이렇게: 키만 있으면 받는 쪽 셸을 통째로 쓰던 것을 "파일 올리기·목록·해시·정리"로 줄인다.
# prod 가 털려도 이 키로는 (1) 받는 쪽에서 명령을 실행할 수 없고 (2) 이미 받은 백업을
# 덮어쓰거나 지울 수 없다 — 지우기는 KEEP_DAYS 가 지난 것만, 이 스크립트가 정한 대로만 한다.
#
#   list           받은 백업 이름 목록
#   put NAME       표준입력(age 암호문)을 NAME 으로 받는다. 이미 있으면 거절(덮어쓰지 않는다)
#   sha256 NAME    받은 파일의 sha256 — 보낸 쪽이 온전히 갔는지 비교한다
#   prune          KEEP_DAYS 지난 백업과 끊긴 조각(.part)을 지운다
set -euo pipefail
umask 077

DIR="${BACKUP_RECEIVE_DIR:-$HOME/db-backup-from-prod}"
KEEP_DAYS=30 # 보관 정책은 여기 한 곳. 보내는 쪽은 기간을 넘기지 않는다(넘길 수 있으면 0 일로 다 지운다).
PUT_WINDOW_DAYS=7 # 이 날수보다 오래된(또는 미래) 날짜 이름은 받지 않는다. backup-offsite.sh 와 같은 값
MAX_BYTES=$((2 * 1024 * 1024 * 1024)) # 정상 덤프 ~95MB. 디스크를 채우는 업로드를 막는다
# 이름의 날짜는 prod 가 KST 로 찍는다. 이 호스트가 UTC 여도 같은 달력으로 비교한다.
export TZ=Asia/Seoul
# 암호문(age)만 받는다. 보내는 쪽 설정이 어긋나도 평문 덤프가 이 호스트에 남지 않게.
NAME_RE='^mysqldump-([0-9]{4}-[0-9]{2}-[0-9]{2})\.gz\.age$'
AGE_MAGIC='age-encryption.org/v1'

die() {
    echo "backup-receive: $*" >&2
    exit 1
}

# SSH_ORIGINAL_COMMAND 는 보낸 쪽이 쓴 명령 문자열 그대로다. 셸로 해석하지 않고 공백으로만 자른다.
read -r -a ARGV <<<"${SSH_ORIGINAL_COMMAND:-}"
[ "${#ARGV[@]}" -le 2 ] || die "인자가 너무 많다"
CMD=${ARGV[0]:-}
NAME=${ARGV[1]:-}

need_name() {
    [[ $NAME =~ $NAME_RE ]] || die "허용하지 않는 이름: $NAME"
}
no_name() {
    [ -z "$NAME" ] || die "$CMD 는 인자를 받지 않는다"
}

# 미리 미래 날짜 이름을 만들어 두면 그날 진짜 백업이 "이미 있음"으로 건너뛰어진다. 그래서 날짜를 본다.
in_window() {
    local day today oldest
    [[ $NAME =~ $NAME_RE ]] || return 1
    day=$(date -d "${BASH_REMATCH[1]}" +%s 2>/dev/null) || return 1
    today=$(date -d "$(date +%Y-%m-%d)" +%s)
    oldest=$((today - PUT_WINDOW_DAYS * 86400))
    [ "$day" -le "$today" ] && [ "$day" -ge "$oldest" ]
}

mkdir -p "$DIR"
cd "$DIR"
shopt -s nullglob

case $CMD in
list)
    no_name
    for f in mysqldump-*; do
        # 평문(.gz) 같은 다른 파일은 건너뛴다. && 로 이으면 마지막 파일이 안 맞을 때 그 실패가 종료 코드가 된다
        if [[ $f =~ $NAME_RE ]] && [ -f "$f" ]; then printf '%s\n' "$f"; fi
    done
    ;;
put)
    need_name
    in_window || die "받는 기간(${PUT_WINDOW_DAYS}일) 밖의 날짜: $NAME"
    [ ! -e "$NAME" ] || die "이미 있다 — 덮어쓰지 않는다: $NAME"
    trap 'rm -f "$NAME.part"' EXIT
    # .part 로 받고 끝까지 받았을 때만 옮긴다 — 끊긴 조각이 정상 파일처럼 남지 않게.
    head -c $((MAX_BYTES + 1)) >"$NAME.part"
    [ "$(stat -c %s "$NAME.part")" -le "$MAX_BYTES" ] || die "너무 크다(상한 $MAX_BYTES bytes)"
    [ "$(head -c ${#AGE_MAGIC} "$NAME.part")" = "$AGE_MAGIC" ] || die "age 암호문이 아니다 — 받지 않는다"
    mv "$NAME.part" "$NAME"
    trap - EXIT
    ;;
sha256)
    need_name
    [ -f "$NAME" ] || die "없다: $NAME"
    sha256sum "$NAME" | cut -d' ' -f1
    ;;
prune)
    no_name
    find . -maxdepth 1 -type f -name 'mysqldump-*' ! -name '*.part' -mtime +"$KEEP_DAYS" -delete
    find . -maxdepth 1 -type f -name 'mysqldump-*.part' -mmin +60 -delete
    ;;
*)
    die "허용하지 않는 명령: ${CMD:-(빈 명령)}"
    ;;
esac
