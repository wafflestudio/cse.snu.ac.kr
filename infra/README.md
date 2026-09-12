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
ops/db-backup.sh 등   백업
production.env        prod 배포 대상 — 호스트·프로파일·웹 빌드 mode·Caddyfile·인증서 경로 (main push)
staging.env           staging 배포 대상 (develop push)
Dockerfile.es         nori 플러그인을 넣은 Elasticsearch 이미지
```

컨테이너 이름은 `csereal_db_container` · `csereal_search` · `csereal_api` · `csereal_web` · `csereal_autoheal` · `csereal_caddy`. 관리 엔드포인트는 `docker exec csereal_api curl localhost:8080/…`.

## 호스트 디스크

VM 디스크는 씬 프로비저닝이다. 게스트가 쓴 만큼 하이퍼바이저 디스크가 차고, 게스트에서 지운 것은 `fstrim` 이 돌아야 돌아간다(`fstrim.timer` 주간, 켜져 있다). 2026-09-12 에 하이퍼바이저 디스크가 가득 차 VM 이 굳은 적이 있다. 쓸데없는 데이터를 남기지 않는다.

- `host-deploy.sh` 가 배포마다 옛 이미지(3개 남김)·빌드 캐시(2GB 상한)·이름 없는 볼륨을 걷어낸다.
- 백엔드 로그 14일(`logback-spring.xml`), DB 백업 30일(`ops/db-backup.sh`), 컨테이너 로그 100MB×3.
- journald 는 상한을 두어야 한다(기본은 디스크의 10%까지 자란다). 호스트에서 한 번:

  ```sh
  sudo sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=200M/' /etc/systemd/journald.conf
  sudo systemctl restart systemd-journald && sudo journalctl --vacuum-size=200M
  sudo fstrim -v /
  ```

