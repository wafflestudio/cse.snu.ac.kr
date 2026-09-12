# perf

Lighthouse 수동 측정. 레포 루트에서 `pnpm perf`.

```
pnpm perf                # prod
pnpm perf staging
pnpm perf local          # 로컬 prod 빌드를 띄워 잰다(:PERF_PORT, 기본 3000). /api 는 PERF_API(기본 prod)로 프록시
pnpm perf https://…      # 임의 URL
PERF_RUNS=5 pnpm perf    # 회수(기본 3). 기록용은 5
```

- 표본은 `urls.txt`(16개). 조회 순위와 화면 유형을 겹쳐 골랐고 상세 페이지는 id 를 고정했다 — "최신 글"로 잡으면 매번 다른 콘텐츠를 재게 된다.
- E2E 와 같은 핀된 Playwright 컨테이너에서 돈다. 로컬과 다른 머신의 절대값은 다르니(CPU), 비교는 같은 머신에서 전후로 한다.
- 워크스페이스 패키지가 아니다. lhci 는 컨테이너 안에서 `npx` 로 받고(`run.sh` 의 `LHCI` 핀), npm 캐시는 볼륨에 남아 두 번째부터는 빠르다.
- 시뮬레이션 스로틀링(Lighthouse 기본). 관측 한 번을 바탕으로 느린 네트워크·CPU 를 계산하므로 같은 네트워크·localhost 에서 재는 것이 권장 조건이다.
- 결과는 `.output/<시각>-<타깃>/` 에 폼팩터별 `manifest.json` + HTML·JSON 리포트, 그리고 `summary.json`(대표 런의 점수·LCP·TBT·CLS·SI·전송량). `node perf/compare.mjs A B` 로 두 결과의 차이를 본다.
- `local` 빌드에는 조회 통계 스크립트(GoatCounter)가 빠진다 — 로컬 서버엔 `/stats` 가 없어 404 만 나기 때문(`constants/api.ts` 의 `STATS_ENABLED`).
- `local` 은 http 라 best-practices 가 prod 보다 20점쯤 낮게 나온다(HTTPS 감사). 로컬 전후 비교는 performance·LCP·전송량으로 한다.
