# infra

프론트·백엔드 공통 인프라. 배포 대상·스택 정의·엣지·모니터링·운영 스크립트가 여기 있다. 앱 코드는 `apps/`.

```
compose.yml           스택 공통 정의(db·search·api). 단독으로 쓰지 않는다
compose.local.yml     로컬·E2E override — apps/api 를 소스에서 빌드. `pnpm api:up`
compose.prod.yml      배포 override — web 을 더하고, host-deploy.sh 가 .env 에 써 넣는 태그로 이미지를 잡는다
compose.caddy.yml     엣지(Caddy, ~/proxy). caddy/Caddyfile(prod)·Caddyfile.dev(staging)
compose.ops.yml       백업 컨테이너
monitoring/           Prometheus·Grafana(prod)
ops/host-deploy.sh    호스트에서 jar·api 이미지·web 이미지 빌드 → compose up → Caddy reload → GIT_SHA 검증. deploy.yml 이 부른다
ops/db-backup.sh 등   백업 · 오프사이트 복사 · 인증서 만료 지표. 스케줄·받는 쪽 설치·복구는 ops/README.md
production.env        prod 배포 대상 — 호스트·프로파일·웹 빌드 mode·Caddyfile·인증서 경로 (main push)
staging.env           staging 배포 대상 (develop push)
Dockerfile.es         nori 플러그인을 넣은 Elasticsearch 이미지
```

컨테이너 이름은 `csereal_db_container` · `csereal_search` · `csereal_api` · `csereal_web` · `csereal_autoheal` · `csereal_caddy`. 관리 엔드포인트는 `docker exec csereal_api curl localhost:8080/…`.

## 호스트 디스크

VM 디스크는 씬 프로비저닝이다. 게스트가 쓴 만큼 하이퍼바이저 디스크가 차고, 게스트에서 지운 것은 `fstrim` 이 돌아야 돌아간다(`fstrim.timer` 주간, 켜져 있다). 2026-09-12 에 하이퍼바이저 디스크가 가득 차 VM 이 굳은 적이 있다. 쓸데없는 데이터를 남기지 않는다.

- `host-deploy.sh` 가 배포마다 옛 이미지(3개 남김)·빌드 캐시(2GB 상한)·이름 없는 볼륨을 걷어낸다.
- 백엔드 로그 365일·20GB 중 먼저 닿는 쪽(`logback-spring.xml`), Caddy 접근 로그 1년(`caddy/Caddyfile`), DB 백업 30일(`ops/db-backup.sh`), 컨테이너 로그 100MB×3. 정기 점검은 `monitoring/README.md` "접근 로그 점검".
- journald 는 상한을 두어야 한다(기본은 디스크의 10%까지 자란다). 호스트에서 한 번:

  ```sh
  sudo sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=200M/' /etc/systemd/journald.conf
  sudo systemctl restart systemd-journald && sudo journalctl --vacuum-size=200M
  sudo fstrim -v /
  ```


## 백신·EDR (검토 — 도입 안 함)

보안점검 ④-5 가 "미설치, 기관 정책에 따라 도입 검토"다. 이 호스트는 우분투 VM 하나에 컨테이너만 돌고, 바깥에서 들어오는
파일은 사실상 **교직원이 올리는 업로드**뿐이다(`~/app/files`). 그래서 "호스트 전체 상시 감시"와 "업로드 검사"를 나눠 본다.

| 선택지 | 무엇 | 비용·부담 | 맞는 경우 |
|---|---|---|---|
| 기관 표준 제품(정보화본부·바쿠스가 쓰는 리눅스 서버 백신/EDR, 예: V3 for Linux Server) | 상시 감시·중앙 관리 | 라이선스는 기관, 설치·업데이트 경로는 확인 필요 | 점검표가 "기관 정책에 따라"를 묻는다 — **먼저 물어볼 것** |
| ClamAV 로 업로드만 검사 | ops 컨테이너에서 매일 새 업로드만 `clamdscan`(무결성 점검의 "더해짐" 목록을 그대로 쓰면 된다), 결과를 지표·경보로 | 무료. clamd 가 시그니처로 메모리 1GB 남짓, 하루 1회 시그니처 갱신 | 방문자에게 악성 첨부가 퍼지는 것을 막는 게 목적일 때. 호스트 침해 탐지는 아니다 |
| ClamAV 상시 감시(clamonacc) | 파일 접근 시 검사 | 위 메모리 + 접근마다 지연, 컨테이너 오버레이에서 설정이 까다롭다 | 권하지 않는다 |
| Wazuh 에이전트 | FIM·루트킷 점검·로그 분석·취약점 탐지 | 무료지만 매니저 서버(수 GB 메모리)가 따로 필요 | 학교·바쿠스에 이미 매니저가 있을 때만 |
| 상용 EDR(CrowdStrike·SentinelOne·Defender for Endpoint) | 행위 기반 탐지·대응 | 호스트당 연 수십만 원대, 관제 인력 전제 | 기관이 관제까지 맡을 때 |

권하는 순서: (1) 정보화본부·바쿠스에 기관 표준 제품과 설치 주체를 묻는다(④-5 는 "바쿠스/운영 몫" 목록에도 있다).
(2) 기관 제품이 없거나 늦으면 ClamAV 업로드 검사를 ops 에 더한다 — `upload-integrity.sh` 와 같은 cron·지표 방식이라 반나절 일이다.
이미 있는 대체 통제: 업로드 무결성 점검(`ops/README.md`), OS 자동 보안 업데이트, fail2ban, 업로드는 정적 제공만(④-3).
