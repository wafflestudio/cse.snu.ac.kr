# 모니터링

백엔드의 `/actuator/prometheus` 와 프론트의 `:9464/metrics` 를 15초마다 긁어 Grafana 로 본다. 앱 배포와 분리된 별도
compose 프로젝트다(앱 배포 때마다 대시보드가 재시작되면 곤란하다).

## 띄우기

호스트에서:

```bash
docker compose -f monitoring/compose.yml up -d
```

배포 워크플로가 없다 — 바뀌는 일이 드물어 손으로 올린다. 대신 이 디렉터리가 정본이니
호스트에서 직접 고치지 말 것(다음에 여기서 올리면 덮인다).

## 보기

두 포트 모두 **loopback 에만** 바인딩돼 있다. 호스트에 방화벽이 없어서(ufw 미설치,
iptables INPUT ACCEPT) 게시 포트가 곧 공개 포트이기 때문이다. SSH 터널로 본다.

```bash
ssh -p 9122 -L 3001:localhost:3001 -L 9090:localhost:9090 waffle@<prod-host>
# Grafana     http://localhost:3001   (admin / GRAFANA_ADMIN_PASSWORD)
# Prometheus  http://localhost:9090
```

`GRAFANA_ADMIN_PASSWORD` 는 호스트의 `monitoring/.env` 에서 온다. 없으면 compose 가
기동을 거부한다(인터넷에 열려 있어 기본값을 두지 않았다).

⚠️ **이 값은 Grafana DB 가 처음 만들어질 때만 적용된다.** 이미 admin 유저가 있는 볼륨에
   나중에 값을 넣거나 바꿔도 **무시된다** — 로그인하면 `invalid password` 만 나온다.
   이미 만들어진 뒤에 바꾸려면 CLI 로 재설정한다:

   ```bash
   docker exec -it grafana grafana cli admin reset-admin-password '새비밀번호'
   ```

   `.env` 값도 같이 맞춰 두면 나중에 볼륨을 새로 만들 때 어긋나지 않는다.
   아이디는 항상 `admin` 이다(`GF_SECURITY_ADMIN_USER` 로 바꿀 수 있다).

## 대시보드

데이터소스와 대시보드 모두 provisioning 으로 자동 등록된다. 손댈 것 없이 열면 된다.

- `grafana/provisioning/datasources/prometheus.yml` — Prometheus 연결. `uid: prometheus`
  로 못박아 뒀다(안 주면 서버마다 uid 가 달라져 대시보드 패널이 전부 빈다).
- `grafana/dashboards/csereal-server.json` — 백엔드 대시보드. 패널 11 개.
- `grafana/dashboards/csereal-web.json` — 프론트 대시보드. 프론트 레포 `server.ts` 가 내는
  지표라 `page` 라벨(정규화한 URL)로 나눈다.

패널 질의는 **prod 에서 실제로 값이 나오는 것만** 골랐다. 히스토그램 버킷
(`http_server_requests_seconds_bucket`)과 tomcat 스레드 지표는 이 앱에 없어서 뺐다 —
그래서 응답시간은 p95 가 아니라 평균이다. p95 가 필요하면 앱에
`management.metrics.distribution.percentiles-histogram.http.server.requests: true` 를
켜야 한다(시계열 수가 크게 는다).

⚠️ provisioning 대시보드는 **UI 에서 고쳐도 재기동하면 파일 내용으로 되돌아간다**
(`allowUiUpdates: false`). 실험은 UI 에서 새 대시보드를 만들어 하고, 쓸 만해지면
JSON 을 뽑아 `grafana/dashboards/` 에 커밋한다.

## 경보

Slack appender 를 걷어내면서 이 시스템에 알림 수단이 없어졌다. 그 자리를 Grafana 경보가
메운다. 규칙과 수신처 모두 `grafana/provisioning/alerting/` 에 코드로 있다.

| 경보 | 조건 | 비고 |
|---|---|---|
| 앱이 응답하지 않는다 | `up{job="spring"} == 0`, 2분 | Slack 으로는 못 잡던 것 — 앱이 죽으면 로그도 안 나온다 |
| 프론트가 응답하지 않는다 | `up{job="frontend"} == 0`, 2분 | 프론트가 죽어도 백엔드는 멀쩡해 다른 규칙엔 안 걸린다 |
| 프론트 5xx 응답이 나가고 있다 | 5xx 발생, 5분 | SSR 실패·백엔드 호출 실패 |
| 에러 로그가 늘고 있다 | ERROR 초당 0.1건 초과, 5분 | Slack appender 의 대체 |
| 5xx 응답이 나가고 있다 | 5xx 발생, 5분 | 사용자가 겪는 실패 |
| DB 백업이 25시간 넘게 성공 안 함 | 하트비트가 늙음 | ops 컨테이너가 남기는 지표 |
| 디스크 여유 10GB 미만 | node-exporter | |

**Slack 과 달라진 점**: ERROR 한 건마다 울리지 않고 비율·지속시간으로 판단한다.
소음이 줄지만 **"무슨 에러인지"는 안 온다** — 알림을 받고 로그를 보러 가야 한다.
내용까지 받으려면 로그 수집기(Loki 등)가 따로 필요하다.

### 메일 발송 설정

수신처는 팀 공용 메일함 `csereal.waffle@gmail.com` 이다. **SMTP 자격증명이 없으면 Grafana 는 조용히 메일을
안 보낸다**(로그에만 남는다). 호스트 `monitoring/.env` 에 넣는다:

```
GF_SMTP_ENABLED=true
GF_SMTP_HOST=smtp.gmail.com:587
GF_SMTP_USER=<보내는 계정>
GF_SMTP_PASSWORD=<Gmail 앱 비밀번호>
GF_SMTP_FROM_ADDRESS=<보내는 계정>
```

Gmail 은 일반 비밀번호가 아니라 **앱 비밀번호**가 필요하다(2단계 인증 켠 뒤 발급).

## 요청 수 제한·급증 경보 (제안 — 기준값 미정)

보안점검 ②-8 에 "요청 수 제한·급증 경보 적용 예정"으로 적었다. 기준은 접근 로그(Caddy json, #133 에서 켬)가 몇 주
쌓인 뒤 정하기로 했다. 그때 바로 고를 수 있게 지금 가능한 것과 필요한 것을 적어 둔다. **아래 숫자 자리(`<…>`)는 비워 둔다.**

```
인터넷 → Caddy(접근 로그 /data/logs/access.log, IP 가 보인다) → web :3000 (http_requests_total)
                                                              → api :8080 (http_server_requests_seconds_count)
                                                                              └─ Prometheus 15초 → Grafana 경보
```

### 1. 급증 경보 — 지금 있는 지표로 된다

앱 두 곳이 이미 요청 수를 낸다(전체 합계, IP 구분 없음). 고정값보다 **지난주 같은 시각 대비 배수**가 덜 시끄럽다
(학기 시작·발표 날처럼 정상 급증은 하루 단위로 반복되지 않는다). 초안 — 기준이 정해지면 `rules.yml` 에 넣는다.

```yaml
- uid: request-surge
  title: API 요청이 평소보다 크게 늘었다
  condition: D
  for: 10m
  annotations:
    summary: "지난주 같은 시각의 <배수>배를 넘었다. 접근 로그에서 많이 부른 IP·경로를 볼 것(아래 '접근 로그 점검')."
  labels: { severity: warning }
  data:
    - refId: A   # 지금
      relativeTimeRange: { from: 600, to: 0 }
      datasourceUid: prometheus
      model: { expr: 'sum(rate(http_server_requests_seconds_count{uri!~"/actuator.*"}[5m]))', instant: true, refId: A }
    - refId: B   # 지난주 같은 시각
      relativeTimeRange: { from: 600, to: 0 }
      datasourceUid: prometheus
      model: { expr: 'sum(rate(http_server_requests_seconds_count{uri!~"/actuator.*"}[5m] offset 7d))', instant: true, refId: B }
    - refId: D   # 배수와 바닥값(한밤 소량 트래픽의 배수 튐 막기) 둘 다 넘을 때
      datasourceUid: __expr__
      model: { type: math, expression: '$A > <배수> * $B && $A > <초당 최소 요청>', refId: D }
```

프론트는 같은 꼴로 `http_requests_total{job="frontend"}`. 기준 잡는 법: Grafana Explore 에서 위 A 를 몇 주치 그려
평소 최대치와 지난주 대비 비율의 분포를 보고, 실제로 있었던 크롤러 폭주(접근 로그)가 몇 배였는지와 맞춘다.

**IP 별 경보는 지표로는 안 된다** — Prometheus 에 IP 라벨을 넣으면 시계열이 터진다. IP 별로 보려면 접근 로그를 읽는
수집기(Loki+Alloy 등)가 필요한데, 지금 규모에선 아래 2·3 이 낫다.

Caddy 도 자체 지표(`caddy_http_requests_total`, 상태 코드별)를 낼 수 있다. 엣지에서 막힌 요청(429 등)까지 세려면 쓴다.
관리 API(:2019)를 게시하면 설정을 바꿀 수 있으니 열지 말고, 지표 전용 리스너(`metrics` 핸들러)를 `172.17.0.1` 에만 게시해 긁는다.

### 2. 요청 수 제한 — 플러그인이 필요하다

- **Caddy 공식 이미지에는 rate limit 이 없다.** `github.com/mholt/caddy-ratelimit` 을 넣어 xcaddy 로 빌드한 이미지가 필요하다
  (`compose.caddy.yml` 의 `image: caddy:2.11.7-alpine` → `caddy:2.11.7-builder` 로 빌드하는 Dockerfile, 배포 때 같이 빌드).
  Caddy 조직 공식 모듈이 아니라 Matt Holt 개인 레포다. 판 올릴 때 같이 봐야 할 것이 하나 는다.
- 걸면 이런 꼴이다. 넘으면 429 와 `Retry-After` 를 준다.

  ```caddyfile
  { order rate_limit before reverse_proxy }
  rate_limit {
      zone api_per_ip {
          match { path /api/* }
          key    {remote_host}
          window <창>        # 예: 1m
          events <허용 요청>
      }
  }
  ```

- 걸기 전에 확인할 것: **접근 로그의 `request.remote_ip` 가 진짜 클라이언트 IP 인가.** docker 포트 게시가 원래 IP 를 넘기지 못하면
  (IPv6·userland-proxy) 모두 `172.17.0.1` 로 찍히고, 그 상태로 IP 별 제한을 걸면 사이트 전체가 한 IP 로 묶여 막힌다.
  `jq -r .request.remote_ip access.log | sort | uniq -c | sort -rn | head` 로 본다.
- 학내 NAT 뒤 여러 사람이 한 IP 로 나올 수 있다(연구실·기숙사). 기준은 그것보다 넉넉하게, 처음엔 `/api/*` 중 무거운 것(검색·목록)만.

### 3. 다른 길

- **fail2ban**(호스트에 이미 있다)이 Caddy 접근 로그를 읽어 폭주 IP 를 막는 jail. 플러그인 없이 된다. 단 Caddy 가 docker 라
  기본 `INPUT` 체인 차단은 게시 포트에 안 먹는다 — `chain = DOCKER-USER` 로 걸어야 한다. 로그 경로는 호스트 `~/proxy/caddy/data/logs/access.log`.
- 앱(Spring)에서 bucket4j 등으로 제한: Caddy 가 붙이는 `X-Forwarded-For` 를 믿도록 설정해야 하고, 웹 SSR 이 api 를 직접 부르는 길(`API_ORIGIN`)과
  구분해야 한다. 엣지에서 막는 것보다 손이 많이 간다.

권하는 순서: (1) 로그 몇 주 → 기준 → 1 의 경보부터 켠다(관찰). (2) 실제 폭주가 보이면 그때 2 또는 fail2ban 으로 막는다.

## 접근 로그 점검 (정기 절차)

보안점검 ④-6 에 "정기 점검 절차 마련 예정"으로 적은 것. 경보는 "무슨 일이 났다"만 알려 준다 — 경보에 안 걸리는 느린 이상
(스캐너, 낯선 관리 요청, 낯선 SSH 로그인)은 사람이 정해진 때 본다. **점검은 읽기만 한다.** 호스트에서 고칠 일이 나오면 따로 정한다.

### 어디에 무엇이 있나 (prod)

| 로그 | 위치 | 보관 | 비고 |
|---|---|---|---|
| 엣지 접근 로그(Caddy json) | `~/proxy/caddy/data/logs/access.log` (+ 회전된 `.gz`) | 1년(`roll_keep_for 8760h`), 100MiB 단위 회전·압축 | 누가(IP) 무엇을(경로·메서드·상태·UA). Cookie·Authorization 은 Caddy 가 가린다 |
| 백엔드 앱 로그 | `~/app/logs/` | **365일 또는 20GB 중 먼저 닿는 쪽** | 아래 주의 |
| 컨테이너 stdout | `docker logs <이름>` | 100MB×3 | 배포 직후 오류 보기용, 기록으로는 짧다 |
| SSH·fail2ban | `/var/log/auth.log`, `fail2ban-client status sshd` | logrotate 설정을 따른다(우분투 기본은 주 단위 4주) | 1년이 필요하면 logrotate 를 늘려야 한다 — 확인 필요 |
| 경보 이력 | Grafana → 경보 → 기록 | Grafana 기본 | |

⚠️ **앱 로그는 20GB 상한에 365일보다 먼저 닿을 수 있다.** `logback-spring.xml` 이 `maxHistory 365` 와 `totalSizeCap 20GB` 를 같이 걸어,
하루 로그가 평균 56MB 를 넘으면 1년이 되기 전에 오래된 날부터 지워진다. 회전된 파일을 압축하지 않으므로(`.log`) 생각보다 빨리 찬다.
월간 점검에서 가장 오래된 파일 날짜를 보고, 1년이 안 되는데 20GB 에 가까우면 둘 중 하나를 한다: 회전 파일 압축
(`fileNamePattern` 끝을 `.log.gz` 로 — 보통 열 배 남짓 준다), 또는 상한을 디스크 여유(경보 10GB)를 보며 올리기.
Caddy 접근 로그는 개수 상한(1000×100MiB)이 커서 1년이 먼저 닿지만, 압축 뒤 크기는 월간 점검에서 같이 본다.

### 누가·언제·무엇을

담당은 그 학기 운영 담당 한 명(지금 이성열). 바뀌면 이 줄과 경보 메일 수신처를 같이 바꾼다.
결과는 팀 문서에 날짜·담당·본 것·조치 한 줄씩 남긴다("이상 없음"도 남긴다 — 점검했다는 기록이 점검표가 묻는 것이다).

| 언제 | 무엇을 | 걸리는 시간 |
|---|---|---|
| 경보 메일이 올 때 | 경보 summary 가 가리키는 곳. 끝나면 원인 한 줄 기록 | 그때그때 |
| 매주 월요일 | 아래 "주간 점검" 명령 | 10분 |
| 매월 첫 주 | 보관 상태(앱 로그 가장 오래된 날짜·총량, 접근 로그 총량, auth.log 보관), Grafana 경보 규칙이 다 `Normal`/살아 있는지, 메일이 실제로 오는지 | 15분 |
| 학기마다 | 이 절차가 맞는지, 담당·수신처 갱신 | |

### 주간 점검 (prod 에서, 읽기만)

```bash
ssh -p 9122 waffle@147.46.92.120
# jq 가 호스트에 없으면 설치하지 말고 alias jq='docker run --rm -i ghcr.io/jqlang/jq'
L=~/proxy/caddy/data/logs
week() { find "$L" -name 'access*' -mtime -8 -print0 | xargs -0 zcat -f | jq -c 'select(.ts > (now - 7*86400))'; }

# 1. 요청이 많은 IP — 크롤러 폭주·스크래핑
week | jq -r .request.remote_ip | sort | uniq -c | sort -rn | head -20
# 2. 4xx 를 많이 받은 IP·경로 — 취약점 스캐너(/wp-admin, /.env, /.git …)
week | jq -r 'select(.status >= 400 and .status < 500) | "\(.request.remote_ip) \(.request.uri)"' | sort | uniq -c | sort -rn | head -20
# 3. 5xx — 경보와 맞춰 본다
week | jq -r 'select(.status >= 500) | "\(.ts|todate) \(.status) \(.request.method) \(.request.uri)"' | tail -20
# 4. 쓰기 요청(관리 기능) — 아는 사람·학내 IP 인가
week | jq -r 'select(.request.method != "GET" and .request.method != "HEAD" and (.request.uri|startswith("/api/"))) | "\(.request.remote_ip) \(.request.method) \(.request.uri|split("?")[0])"' | sort | uniq -c | sort -rn | head -20
# 5. 로그인 시도
week | jq -r 'select(.request.uri|startswith("/oauth2/") or startswith("/api/v1/login")) | .request.remote_ip' | sort | uniq -c | sort -rn | head
# 6. SSH: 성공한 로그인이 아는 키·IP 인가, fail2ban 차단
sudo grep 'Accepted' /var/log/auth.log | tail -20
sudo fail2ban-client status sshd
```

볼 때 기준: 1·2 는 상위가 검색엔진·학내 IP 면 넘어간다. 낯선 IP 가 4 에 나오거나, 6 에 모르는 IP 의 `Accepted` 가 있으면
그날 팀에 알린다. 1 의 수치는 요청 급증 경보 기준을 정할 재료로 쓴다(위 "요청 수 제한·급증 경보").

## 페이지 조회 통계 (GoatCounter)

Prometheus 의 요청 수는 서버 관점이다 — 크롤러가 섞이고 클라이언트 네비게이션은 안 잡힌다.
GoatCounter 는 브라우저 스크립트가 세므로 둘 다 해결된다. 쿠키를 쓰지 않아 동의 배너가 필요 없다.
같은 compose 프로젝트의 `goatcounter` 서비스이고, Caddy 가 `/stats` 를 통째로 넘긴다(`-base-path`).

- 대시보드: https://cse.snu.ac.kr/stats (GoatCounter 자체 로그인)
- 프론트: `__root.tsx` 가 prod 에서만 `/stats/count.js` 를 싣고(nonce 는 HeadContent 가 붙인다),
  `router.tsx` 가 클라이언트 네비게이션마다 `count()` 를 부른다.

처음 올릴 때 사이트를 한 번 만든다. **만든 뒤 재시작해야 한다** — 서버가 사이트 목록을 기동 시 읽는다.

```bash
docker exec -it goatcounter goatcounter db create site \
  -vhost cse.snu.ac.kr -user.email <이메일> \
  -db sqlite+/home/goatcounter/goatcounter-data/db.sqlite3
docker restart goatcounter
```

`-vhost` 는 요청의 Host 와 맞아야 한다(Caddy 가 Host 를 그대로 넘긴다). staging 은 도메인이 달라
스크립트를 싣지 않는다. 데이터는 `goatcounter-data` 볼륨의 SQLite 파일 하나다.

로컬에서 count 요청이 저장되는지 볼 때 두 가지가 봇으로 걸러진다. curl 기본 UA, 그리고 Playwright 같은 자동화 브라우저(`navigator.webdriver` 를 count.js 가 봇 점수로 보낸다 — `--disable-blink-features=AutomationControlled` 로 끄면 저장된다). 요청이 200 이어도 저장은 안 될 수 있다.

## 이력

- 같은 날: `0.0.0.0:9090` 이라 학외에서 무인증으로 `/api/v1/*` 이 응답하던 것을 막았다.
- 그전까지 이 스택은 어느 레포에도 없이 호스트에만 있었다. 그래서 위 두 고장이
  조용히 유지됐다.

## 호스트로 올릴 때 함정

macOS 에서 `tar` 로 보내면 확장 속성 때문에 `._` 로 시작하는 AppleDouble 파일이 함께
간다. Grafana 는 provisioning 디렉터리의 **모든 파일**을 설정으로 읽으므로
`._prometheus.yml`(바이너리)을 만나 `yaml: control characters are not allowed` 로
크래시 루프에 빠진다. 보낼 때 `COPYFILE_DISABLE=1` 을 주거나, 받은 쪽에서
`find ~/monitoring -name "._*" -delete` 로 지운다.
