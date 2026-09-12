# csereal-server

cse.snu.ac.kr 백엔드. 2026-09 부터 프론트와 같은 레포(`cse.snu.ac.kr`)의 `apps/api` 에 있다. 여기엔 앱 코드만 있고 compose·Caddy·모니터링·운영 스크립트는 `../../infra` 다. Gradle 명령은 이 디렉터리에서 실행한다.

## 로컬 실행

```bash
pnpm api:up      # 레포 루트에서. infra/compose.yml + compose.local.yml
```

## CI/CD

`develop` → staging, `main` → production. 워크플로는 레포 루트 `.github/workflows/`(`ci.yml` 의 `api-jar`·`api-test`, `deploy.yml`), 배포 스크립트·대상은 `infra/ops/host-deploy.sh`·`infra/production.env`·`infra/staging.env`.

GitHub 시크릿은 Environment(`production`·`staging`)의 `SSH_KEY` 하나이며 나머지는 호스트에 둡니다.

호스트의 `~/secrets/`에 아래 환경변수를 둡니다.

| | |
|---|---|
| `app.env` | `MYSQL_ROOT_PASSWORD` `MYSQL_USER` `MYSQL_PASSWORD` `MYSQL_DATABASE` `OIDC_CLIENT_SECRET`(prod만) |
| `monitoring.env` | `GF_SECURITY_ADMIN_PASSWORD` · `GF_SMTP_*`. prod만 |
| `certs/` | TLS 인증서·키. `main.env` 의 경로와 맞아야 합니다. prod만 |
| `backup_offsite` | 백업용 SSH 개인키. prod만 |

## DB 백업 복원

백업은 ops 컨테이너가 매일 자정 호스트 `~/database/backup/` 에 남깁니다([`infra/ops/db-backup.sh`](../../infra/ops/db-backup.sh)).

```bash
docker run -d --name restore-test -e MYSQL_ROOT_PASSWORD=x -e MYSQL_DATABASE=csereal mysql:8.0
gunzip -c ~/database/backup/mysqldump-YYYY-MM-DD.gz | docker exec -i restore-test mysql -uroot -px csereal
```
