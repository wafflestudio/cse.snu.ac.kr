# e2e

전 라우트 E2E(비주얼 회귀 포함). 레포 루트에서 `pnpm e2e`.

```
tests/<route>/read.spec.ts    비로그인·비변경. 콘텐츠 assert + 스크린샷(데스크톱·모바일)
tests/<route>/flow.spec.ts    로그인·DB 변경. 생성→편집→삭제
tests/language.spec.ts        로케일 리다이렉트·토글
tests/security.spec.ts        상태 코드·보안 헤더
tests/setup/                  DB 리셋(mysql2)·시드(API)·날짜 정규화 — 매 런 globalSetup
tests/helpers/                loginAsStaff, 폼 구동, 삭제
playwright.config.ts          프로젝트 read / read-mobile / language / security → flow
```

- 항상 핀된 Playwright 컨테이너에서 돈다(`scripts/e2e-docker.sh`). 백엔드는 같은 커밋의 `apps/api` 를 `infra/compose.local.yml` 로 띄운다. 호스트 직접 실행은 정식 경로가 아니다 — baseline(`*-linux.png`)이 컨테이너 렌더 기준이다.
- 프론트 소스는 `@web/*`(tsconfig paths → `apps/web/src`)로 가져온다. 시드 타입과 태그 상수만 쓴다.
- 경로 인자는 이 디렉터리 기준: `pnpm e2e tests/research/labs`. baseline 갱신은 `pnpm e2e --update-snapshots`.

무엇을 테스트하고 무엇을 백엔드에 맡기는지는 `CLAUDE.md`(이 디렉터리).
