# infra

프론트·백엔드 공통 인프라. 배포 대상·스택 정의·엣지·모니터링·운영 스크립트가 여기 있다. 앱 코드는 `apps/`.

```
compose.yml           스택 공통 정의(db·search·backend). 단독으로 쓰지 않는다
compose.local.yml     로컬·E2E override — apps/api 를 소스에서 빌드. `pnpm api:up`
compose.prod.yml      배포 override — host-deploy.sh 가 태그를 .env 에 써 넣는다
compose.caddy.yml     엣지(Caddy). caddy/Caddyfile(prod)·Caddyfile.dev(staging)
compose.ops.yml       백업 컨테이너
monitoring/           Prometheus·Grafana(prod)
ops/host-deploy.sh    호스트에서 jar·이미지 빌드 → compose up → Caddy reload. deploy-api.yml 이 부른다
ops/db-backup.sh 등   백업
deploy-targets/       브랜치별 호스트·프로파일(develop→staging, main→production)
Dockerfile.es         nori 플러그인을 넣은 Elasticsearch 이미지
```

프론트 이미지는 아직 여기 스택에 없다 — `deploy-web.yml` 이 호스트로 보내는 `scripts/remote-deploy.sh` 가 단독 컨테이너로 올린다. 스택에 합치는 것은 다음 작업.
