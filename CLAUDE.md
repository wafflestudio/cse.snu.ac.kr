# cse.snu.ac.kr 작업 가이드 (에이전트용)

코드만 봐선 알 수 없는 것 — **결정의 이유·컨벤션·재발 함정**만 적는다. 구현 상세(파일 목록·시그니처·명령어)는 코드와 `package.json`·config 에서 확인한다. 히스토리는 git log 의 몫이라 적지 않는다(과거가 지금 코드 모양을 설명할 때만 예외). 사람용 온보딩은 루트 `README.md`.

이 파일은 레포 전체에 걸친 것만 담는다. 영역별 가이드는 그 디렉터리에 있다.

```
apps/web/CLAUDE.md   프론트 — 라우팅·코드 컨벤션·디자인 시스템
e2e/CLAUDE.md        E2E — 무엇을 테스트하고 무엇을 백엔드에 맡기나, 결정론, baseline
apps/api/docs/       백엔드 설계 문서·런북
infra/README.md      compose 스택·Caddy·모니터링·운영 스크립트·배포 대상(env)
```

# 레포 구조

pnpm 워크스페이스. 패키지는 `apps/web` 과 `e2e` 둘이고 `apps/api` 는 Gradle 이라 pnpm 이 관리하지 않는다(`pnpm api:*` 가 `cd apps/api && ./gradlew` 를 감쌀 뿐). `infra` 는 프론트·백엔드 공통 인프라(compose 스택에 db·search·api·web 이 함께 있다). 루트 스크립트는 디렉터리 이름을 접두사로 쓴다(`web:*`, `api:*`). 레포 전체를 다루는 것만 접두사 없음(`test`·`e2e`·`gen:api`·`typecheck`·`lint`·`knip`).

`apps/api` 는 옛 csereal-server 를 git subtree 로 합친 것이다(히스토리 보존). e2e 가 프론트 소스를 가져오는 통로는 `@web/*` 별칭 하나(`e2e/tsconfig.json`) — 워크스페이스 패키지 이름으로 부르면 Node ESM 이 확장자 없는 `.ts` 를 못 찾아 런타임에 깨진다.

# 로컬 환경

```
브라우저 ──(localhost:3000만)──> apps/web/server.ts (:3000, prod와 같은 서버)
                                  ├─ /api/**  → hono proxy → 로컬 docker 백엔드 :8080 (API_PROXY_TARGET 설정 시)
                                  └─ 그 외     → TanStack Start SSR (프로덕션 빌드 dist/)
```

- **백엔드 = 로컬 docker 실서버**(`apps/api` 소스, `infra/compose.yml`+`compose.local.yml`, :8080). MySQL+Elasticsearch+Spring, mock-login 은 `@Profile("!prod")` 실엔드포인트(진짜 JSESSIONID 세션). **로컬 전용이라 리셋·시드 자유 — staging·프로덕션 서버는 절대 건드리지 않는다.** `pnpm e2e`·`pnpm gen:api` 가 자동 기동한다(기동 순서·health 대기는 compose 선언).
- **프론트 = 프로덕션 빌드**를 `server.ts`(Hono)로 서빙. MSW/mock 안 씀. **왜 same-origin proxy:** 세션 쿠키(JSESSIONID)가 `Secure` 라 cross-origin 요청에 안 실린다 → 브라우저는 :3000 만 보고 `/api` 를 서버사이드에서 :8080 으로 넘긴다. 배포는 프론트·백엔드가 같은 도메인이라 절대 URL 직호출(`API_PROXY_TARGET` 없음).
- **API 타입은 손으로 쓰지 않는다.** `pnpm gen:api` 가 이 커밋의 백엔드 스펙에서 `apps/web/src/types/api/generated.d.ts` 를 만들고, `pnpm e2e` 가 러너 안에서 같은 비교를 해 어긋나면 테스트 전에 실패한다(드리프트 게이트). 백엔드 컨트롤러를 고쳤으면 타입을 다시 만들어 같은 PR 에 커밋한다.

# prod 토폴로지

```
인터넷 ─443─> Caddy(엣지: TLS·HSTS·HTTP/2·라우팅·보안 헤더, 별도 compose ~/proxy)
              ├─ 그 외    → host:3000  csereal_web (Hono, hono/compress 로 gzip)
              └─ /api/*   → host:8080  csereal_api (Spring)
   앱 스택(~/app, infra/compose.yml + compose.prod.yml): db · search · api · web · autoheal. Caddy 는 host.docker.internal 로 붙는다.
   web SSR 이 백엔드를 부를 때도 이 엣지를 탄다(절대 URL). compose 의 extra_hosts "<URL>:host-gateway" 가 그 경로다.
```

- 호스트: prod `147.46.92.120:9122`(학내), staging `168.107.16.249`(클라우드, 학외). 정본은 `infra/production.env`·`infra/staging.env`.
- **Caddyfile 정본은 `infra/caddy/`.** `host-deploy.sh` 가 매 배포마다 복사해 reload 한다 — 호스트에서 직접 고치면 다음 배포에 덮인다.
- **압축은 앱이 한다(`hono/compress`).** 예전 상위 프록시가 하던 일인데 그 계층이 없어졌다. 빼면 HTML 이 무압축으로 나간다.
- **⚠️ web 컨테이너의 `extra_hosts: <URL>:host-gateway` 를 빼지 말 것**(`compose.prod.yml`). SSR 이 절대 URL 로 자기 도메인을 부르므로 컨테이너가 그 이름을 게이트웨이로 풀어야 한다. 빠지면 전 페이지 500 인데, 오래 뜬 컨테이너에선 안 드러나고 재생성 시점에 터진다.
- **학외 접속은 드물게 끊긴다**(경계 장비의 SYN drop·RST). 앱 버그 아님. 배포 워크플로가 SSH 를 5회 재시도하는 이유. **학외 OAuth 로그인은 불가** — `id.snucse.org` 가 학외 443 을 막고 있다(바쿠스 소유).
- **⚠️ local·dev 프로파일에 OIDC `issuer-uri` 를 넣지 말 것.** 있으면 백엔드가 기동 시 `id.snucse.org` discovery 를 강제해 학외·CI 에서 크래시 루프다. `SecurityConfig` 가 registration 이 있을 때만 `oauth2Login` 을 배선하고, 두 환경은 mock-login 만 쓴다. prod 만 등록.
- **관리 엔드포인트는 앱이 loopback 으로 막는다**(`@InternalOnly`, `remoteAddr.isLoopbackAddress`). 운용은 `docker exec csereal_api curl localhost:8080/…`. 컨테이너 안 호출은 IPv6 `::1` 로 오니 `127.0.0.1` 만 매칭하면 막힌다. 엣지에는 이 차단이 없고 앱이 정본 방어다. 세션 인증을 안 쓴 이유: 학외에서 OAuth 가 막혀 개발자가 못 쓴다.

# 브랜치 · CI/CD

- **브랜치:** `main`=production · `develop`=staging · `feature/*`·`fix/*`→`develop` PR · `hotfix/*`→`main` PR(후 develop back-merge). 직접 push 금지 — ruleset 이 PR 필수 + `web-test` 필수 체크 + force push 금지(admin 포함).
- **머지:** `feature`→`develop` squash(기능당 1커밋). `develop`→`main` merge commit(squash 하면 long-lived 인 develop 과 히스토리가 갈라져 다음 승격 PR 이 깨진다). rebase 머지 없음, 머지 후 head 브랜치 자동 삭제.
- **CI(`ci.yml`, PR):** `api-jar`(백엔드 소스의 내용 해시로 "테스트 통과한 jar" 캐시를 조회만) → `api-test`(캐시가 없을 때만 `gradlew build -x jar` 로 테스트 + bootJar, 성공 시 캐시 저장) → `web-test`(그 jar 를 `JAR_STAGE=prebuilt` 로 받아 JS 워크스페이스 typecheck·lint·knip 뒤 로컬과 같은 `e2e/run.sh`). E2E 는 항상 같은 커밋의 `apps/api` 로 돈다. **두 벌 관리 X — CI 는 로컬 스크립트·config 를 호출만 한다.** 필수 체크는 `web-test` 하나 — `api-test` 는 캐시 히트면 건너뛰어지는데, 건너뛴 잡을 필수로 두면 "대기 중"으로 머지가 막힌다. PR 이 만든 캐시는 다른 PR 이 못 읽어 develop push 에서도 `api-jar`·`api-test` 가 돌아 캐시를 채운다.
- **CD(`deploy.yml`) — 전부 Actions, 수동 배포 없음.** `develop` push → staging, `main` push → production. 잡 하나: 호스트에 SSH 로 들어가 이 레포를 `~/build/cse.snu.ac.kr` 에 클론(갱신)하고 `infra/ops/host-deploy.sh` 를 돌린다 — Gradle bootJar → `csereal-api:<sha>`·`csereal-web:<sha>` 이미지 빌드 → `compose up -d --wait --remove-orphans` → Caddy reload → 두 컨테이너의 `GIT_SHA` 가 의도한 커밋인지 검증. 대상은 `infra/production.env`·`infra/staging.env`, 시크릿은 Environment(`production`·`staging`)의 `SSH_KEY` 와 레포의 `KAKAO_MAP_KEY`(웹 build-arg). 이미지는 최근 5개를 남겨 `.env` 의 `IMAGE_TAG` 로 되돌릴 수 있고, 정식 롤백은 revert 커밋이다. 사람이 누르는 관문이 필요하면 Environment `production` 에 required reviewer.
- **왜 호스트 빌드(학외 CI 아님):** 레지스트리 없이 빌드==배포이고, 호스트가 클론을 들고 있어 Gradle 증분 컴파일과 docker 레이어 캐시가 살며, 프리렌더를 다시 켜면 빌드가 prod API 를 페이지 수만큼 부르는데 학외에선 SYN drop 이 누적돼 플레이키하다. 서빙 호스트에 빌드 부하가 생기지만 격리·무중단 swap 이라 감내.
- **GitHub API 함정:** 브랜치 보호는 `repos/:owner/:repo/rules/branches/:branch`(ruleset) 로 조회한다 — 구식 `branches/:branch/protection` 은 ruleset 만 쓰는 레포에서 404 다. "설정이 없다"는 결론을 404 로 내리지 말 것.

# 도구

- **Biome** 하나로 린트·포맷. 커밋 전 `lint-staged` 가 staged 파일에 `biome check --write --error-on-warnings` + `pnpm -r typecheck` 를 돌려 경고도 커밋을 막는다. `apps/api`·`infra`·생성물(`routeTree.gen.ts`·`generated.d.ts`)은 `biome.json` 에서 제외 — **생성물을 빼지 않으면 `lint:fix` 가 재포맷해 드리프트 게이트가 깨진다.**
- **knip** 은 워크스페이스별 entry(`knip.json`). 미사용 파일·export·의존성이 `web-test` 에서 잡힌다.
- E2E 러너의 node_modules 는 패키지마다 볼륨(이름에 마운트 경로). 디렉터리를 옮기면 볼륨 이름도 바꿔야 한다 — 옛 볼륨의 상대 심링크가 깨지는데 pnpm 은 설치돼 있다고 보고 다시 링크하지 않는다.
