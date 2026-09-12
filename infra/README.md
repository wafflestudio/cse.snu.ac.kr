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
