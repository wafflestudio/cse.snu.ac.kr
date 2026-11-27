# ops — 예약 작업(백업·지표)

`compose.ops.yml` 의 `csereal_ops` 컨테이너 하나가 crond 로 아래 스크립트를 돌린다. 스케줄은 `Dockerfile`.
앱 배포(`host-deploy.sh`)와 따로 손으로 올린다 — 이 디렉터리가 정본이니 호스트에서 직접 고치지 말 것.

```bash
# prod 호스트, compose.ops.yml 을 둔 디렉터리에서(../secrets·../database 가 닿는 곳)
docker compose -f compose.ops.yml up -d --build
docker exec csereal_ops /opt/ops/<스크립트>.sh   # 한 번 손으로 돌려 볼 때
```

| 스크립트 | 언제(KST) | 하는 일 | 지표(node_exporter 텍스트 수집기) |
|---|---|---|---|
| `db-backup.sh` | 00:00 | DB 덤프 → `~/database/backup`, 30일 | `csereal_db_backup_*` |
| `backup-offsite.sh` | 00:30 | 덤프를 staging 호스트로 복사 | `csereal_backup_offsite_*` |
| `tls-expiry.sh` | 09:00 | 443 인증서 만료 시각 | `csereal_tls_not_after_*` |

`backup-receive.sh` 는 ops 컨테이너가 아니라 **받는 쪽 호스트**에 설치하는 스크립트다(아래).

## 오프사이트 백업

```
prod  ~/database/backup/mysqldump-DATE.gz (평문, 30일)
        │ csereal_ops: backup-offsite.sh
        │   age -R /secrets/backup_age.pub  → 암호문
        └─ssh(전용 키 /secrets/backup_offsite)──> staging 168.107.16.249  csebackup 계정
             list · put NAME · sha256 NAME · prune      authorized_keys: restrict,command=…
                                                          └─ /usr/local/bin/csereal-backup-receive (= backup-receive.sh)
                                                               └─ ~csebackup/db-backup-from-prod/mysqldump-DATE.gz.age (30일)
```

받는 곳은 **staging 호스트와 같은 기계**다(`compose.ops.yml` 의 `OFFSITE_HOST` 와 `staging.env` 의 `SSH_HOST` 가 같다).
학외 클라우드라 prod 와 다른 장애 영역이라는 게 장점이고, staging 앱(밖에서 mock-login 이 열려 있다)과
디스크를 같이 쓴다는 게 약점이다.

### 키 권한을 줄인 이유와 방식

예전에는 prod 의 백업 키가 staging 의 `ubuntu` 계정(배포 계정, docker 그룹 = 사실상 root)에 그냥 붙었다.
prod 가 털리면 그 키로 staging 셸을 얻고, 받아 둔 백업도 지울 수 있었다.

지금은 받는 쪽 `authorized_keys` 가 키를 강제 명령 하나로 묶는다.

- `restrict` — 포트·에이전트·X11 포워딩과 pty 를 끈다.
- `command=` — 보낸 쪽이 무엇을 쓰든 `backup-receive.sh` 만 돈다. 보낸 명령은 `SSH_ORIGINAL_COMMAND` 로만 전달되고,
  스크립트는 셸로 해석하지 않고 `list`·`put`·`sha256`·`prune` 네 개만 받는다.
- `put` 은 이름을 `mysqldump-YYYY-MM-DD…` 꼴, 최근 7일 날짜로만 받고 **이미 있는 파일은 덮어쓰지 않는다**.
  미래 날짜를 미리 만들어 진짜 백업을 막는 것도 날짜 검사가 막는다.
- 지우기는 `prune` 하나, 기간(30일)은 받는 쪽 스크립트에 있다. 보내는 쪽 키로는 최근 백업을 지울 수 없다.
- 전용 계정 `csebackup` 은 docker 그룹이 아니고, `.ssh` 와 `authorized_keys` 는 root 소유라 스크립트가 뚫려도 키를 더할 수 없다.

rrsync 를 쓰지 않은 이유: 보내는 쪽이 rsync 가 아니라 `ssh … <파일` 이고, rrsync 는 경로만 가둘 뿐
그 안에서 덮어쓰기·지우기를 막지 못한다.

### 암호화

staging 은 학외 클라우드이고 앱과 디스크를 같이 쓴다. 그래서 그쪽엔 **암호문만** 둔다.
prod 가 복사 직전에 age 공개키로 암호화하고(`backup-offsite.sh`), 받는 쪽은 `age-encryption.org/v1` 머리가
없는 파일과 `.gz.age` 가 아닌 이름을 거절한다(`backup-receive.sh`). 보내는 쪽 설정이 어긋나도 평문이 남지 않는다.

**개인키는 어느 서버에도 두지 않는다.** prod 에는 공개키만 있으니 prod 가 털려도 staging 의 사본은 못 푼다.
반대로 개인키를 잃으면 오프사이트 사본 전부가 쓸모없어진다 — 보관이 이 방식의 전부다.

#### 키 만들기·보관 (사람이, 한 번)

```bash
# 자기 노트북에서(서버 아님). brew install age / apt install age
age-keygen -o csereal-backup-<이름>.key        # 출력의 "Public key: age1…" 이 공개키
```

- 개인키 파일은 팀 비밀번호 관리자(와플 공용 금고 등)에 넣고, 오프라인 사본을 하나 더 둔다. 노트북의 파일은 지운다.
- 관리자 두 명이 각자 키를 만들어 공개키를 둘 다 넣는 것을 권한다(한 줄에 하나). 어느 한 개인키로도 풀린다 — 한 사람이 떠나도 복구가 된다.
- prod 호스트 `~/secrets/backup_age.pub` 에 공개키 줄(`age1…`)을 쓴다. 없으면 복사가 실패하고 경보가 울린다.
- 키를 바꾸면(사람이 바뀌는 등) 공개키 파일만 고친다. 이미 올라간 사본은 옛 키로만 풀리니 옛 개인키는 30일 더 둔다.

#### 바꾸는 순서

1. 키를 만들고 prod `~/secrets/backup_age.pub` 를 둔다.
2. staging 에 새 `backup-receive.sh` 를 다시 설치한다(아래 `sudo install …` 줄). **이 스크립트가 바뀔 때마다 다시 설치해야 한다** — 배포가 덮어 주지 않는다.
3. prod ops 를 다시 빌드하고 `docker exec csereal_ops /opt/ops/backup-offsite.sh` 로 한 번 돌린다.
4. 아래 "오프사이트 사본 복구"로 한 번 풀어 본다. 풀리는 것을 보기 전까지는 백업이 있다고 말하지 않는다.
5. staging 에 남은 옛 평문 사본(`mysqldump-*.gz`)은 30일 뒤 `prune` 이 지우지만, 4 가 끝나면 손으로 지우는 것을 권한다:
   `sudo find ~csebackup/db-backup-from-prod -name 'mysqldump-*.gz' -delete`

#### 오프사이트 사본 복구

prod 의 `~/database/backup` 이 살아 있으면 그쪽이 먼저다(루트 README "DB 백업 복원"). prod 디스크를 잃었을 때:

```bash
# 개인키가 있는 기계에서. csebackup 은 셸이 없으니 ubuntu 로 sudo 해서 꺼낸다.
ssh ubuntu@168.107.16.249 'sudo ls /home/csebackup/db-backup-from-prod'
ssh ubuntu@168.107.16.249 'sudo cat /home/csebackup/db-backup-from-prod/mysqldump-YYYY-MM-DD.gz.age' >dump.gz.age

docker run -d --name restore-test -e MYSQL_ROOT_PASSWORD=x -e MYSQL_DATABASE=csereal mysql:8.0
age -d -i csereal-backup-<이름>.key dump.gz.age | gunzip | docker exec -i restore-test mysql -uroot -px csereal
```

풀린 평문(`gunzip` 결과)을 파일로 남기지 않는다. 운영 DB 에 넣을 때도 같은 파이프를 `csereal_db_container` 로 돌린다.

### 받는 쪽 설치 (사람이 staging 호스트에서, 한 번)

**순서가 중요하다.** 받는 쪽을 먼저 만들고 그다음 prod ops 를 다시 빌드한다. 거꾸로 하면 그 사이 복사가 실패한다
(25시간 뒤 "오프사이트 백업이 25시간 넘게 성공하지 않았다" 경보).

```bash
# staging (ssh ubuntu@168.107.16.249). 래퍼는 이 브랜치가 develop 에 들어간 뒤 배포 클론에 있다.
sudo adduser --disabled-password --gecos '' --shell /bin/sh csebackup   # 셸이 nologin 이면 command= 도 못 돈다
sudo install -o root -g root -m 755 ~/build/cse.snu.ac.kr/infra/ops/backup-receive.sh /usr/local/bin/csereal-backup-receive

# 받아 둔 백업을 새 계정으로 옮긴다
sudo mv ~ubuntu/db-backup-from-prod ~csebackup/
sudo chown -R csebackup:csebackup ~csebackup/db-backup-from-prod && sudo chmod 700 ~csebackup/db-backup-from-prod

# 키 등록. 공개키는 prod 에서: ssh-keygen -y -f ~/secrets/backup_offsite
sudo install -d -o root -g root -m 755 ~csebackup/.ssh
echo 'restrict,command="/usr/local/bin/csereal-backup-receive" ssh-ed25519 AAAA…(prod 공개키) csereal-backup' |
    sudo tee ~csebackup/.ssh/authorized_keys >/dev/null
sudo chmod 644 ~csebackup/.ssh/authorized_keys

# ubuntu 계정에서 옛 백업 키 줄을 지운다(지문으로 찾는다: ssh-keygen -lf ~/.ssh/authorized_keys)
```

그다음 prod 에서 이 디렉터리와 `compose.ops.yml` 을 올리고 다시 빌드한 뒤 확인한다.

```bash
docker compose -f compose.ops.yml up -d --build
docker exec csereal_ops ssh -i /secrets/backup_offsite -o StrictHostKeyChecking=accept-new csebackup@168.107.16.249 list   # 목록이 나와야 한다
docker exec csereal_ops ssh -i /secrets/backup_offsite csebackup@168.107.16.249 id      # "허용하지 않는 명령" 이어야 한다
docker exec csereal_ops /opt/ops/backup-offsite.sh
```

더 조이려면 `from="<prod 가 나가는 IP>"` 를 `restrict` 앞에 붙인다. 학내망이 NAT 일 수 있으니
staging `/var/log/auth.log` 의 `Accepted publickey for csebackup from …` 에서 실제 IP 를 본 뒤에 넣는다.

## 업로드 파일 백업 (미정 — 선택지만)

보안점검 ⑥-1 에 "업로드 파일 백업 적용 예정"으로 적었다. DB 덤프에는 파일 이름만 있고 내용(`~/app/files`·`~/app/cse-files`,
약 24GB)은 어디에도 사본이 없다. **저장 공간이 정해지지 않아 구현하지 않았다.** 정할 것은 셋: 어디에, 어떤 방식으로, 누가 내나.

업로드는 사실상 추가만 된다(늘 새 이름, 덮어쓰지 않음). 그래서 어떤 증분 방식이든 첫 24GB 뒤로는 하루 몇 MB 다.

| 어디에 | 비용(24GB, 대략 — 가입 전 확인) | 장점 | 약점 |
|---|---|---|---|
| staging VM(DB 사본과 같은 곳) | 디스크 증설분만 | 이미 키·계정이 있다 | 디스크 여유 확인 필요, staging 앱과 같은 기계 |
| 객체 저장소(Backblaze B2·Cloudflare R2·AWS S3) | 월 1천 원 안팎(B2 ~$0.15, R2 ~$0.36, S3 서울 ~$0.6) | 다른 회사·다른 장애 영역, 용량 걱정 없음 | 결제 수단(학부·와플)과 계정 관리 주체 필요 |
| 학내 저장소(학부 NAS, 정보화본부 백업) | 무료일 수 있음 | 학교 정책에 맞기 쉽다 | 신청 절차, 같은 학내망(재해 분리 약함) |

방식은 **restic** 을 권한다.

- 내용 단위 중복 제거라 매일 돌려도 새 파일만 올라간다. 스냅샷마다 그날 상태로 되돌릴 수 있다(`forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12` 같은 보관).
- 저장소 자체가 암호화된다 — 위 DB 사본과 같은 "받는 쪽엔 암호문만" 원칙이 따로 손대지 않아도 선다. 비밀번호는 age 개인키처럼 서버 밖에 보관.
- sftp(staging)·S3 호환(B2·R2) 둘 다 된다. staging 에 둔다면 받는 쪽에 `rest-server --append-only` 를 띄워
  prod 가 털려도 스냅샷을 못 지우게 한다(지금 DB 사본의 "덮어쓰기·삭제 금지"와 같은 목적). 객체 저장소면 쓰기 전용 키 + 버킷 버전 관리/객체 잠금.
- ops 컨테이너에 `restic` 을 넣고 cron 한 줄, 하트비트 지표는 지금 스크립트들과 같은 방식.

쓰지 않을 것: `rsync --link-dest`(받는 쪽에 평문, 지금의 command= 제한과 안 맞는다), `rclone sync`(삭제·변조가 그대로 복제된다 — 백업이 아니라 거울).
