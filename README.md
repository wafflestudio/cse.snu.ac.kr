![](https://github.com/user-attachments/assets/39a28dbf-8ce8-4c3c-9222-abdddd22b934)

서울대학교 컴퓨터공학부 홈페이지의 프론트엔드 소스코드입니다.

## 기술 스택

- **TanStack Start** (file-based 라우팅, SSR) · React 19 · TypeScript
- **Tailwind CSS v4** (디자인 토큰은 `app/app.css`의 `@theme`)
- **Storybook 10** (공용 컴포넌트 카탈로그) · **Playwright** (E2E + 비주얼 회귀)
- 백엔드: [csereal-server](https://github.com/wafflestudio/csereal-server) (Spring, 세션 인증)

## Getting Started

```sh
git clone https://github.com/wafflestudio/cse.snu.ac.kr
cd cse.snu.ac.kr
pnpm install
pnpm dev
```

필요시 환경 변수를 설정합니다.

```sh
cp env/.env.example env/.env
```

**1. 카카오 맵 API 키** 
- [소개 > 찾아오는 길](https://cse.snu.ac.kr/about/directions) 페이지에서 사용
- 없어도 지도 외 다른 기능은 정상 작동합니다

**2. SSH 설정**
- staging/프로덕션 서버 배포 시 필요
- 관련자에게 전달받아 설정

## 환경 (백엔드 기준)

| 이름 | 백엔드 | 정체 |
|---|---|---|
| production | `cse.snu.ac.kr` | 실서비스 |
| staging | `168.107.16.249.nip.io` | 배포된 프리-프로드(공개 접근) |
| local | `localhost:8080` (docker) | 로컬 E2E/개발 |

## 스크립트

```sh
pnpm dev            # 개발 서버 (vite, API: env/.env.development = staging)
pnpm build          # 프로덕션 빌드 (mode=production)
pnpm build:staging  # staging 빌드 (env/.env.staging)
pnpm build:local    # 로컬 빌드 (상대 /api → server.ts가 로컬 docker로 프록시)
pnpm start          # 빌드된 사이트 실행 = prod 런타임(프록시 없음). 컨테이너 CMD
pnpm preview        # build:local + /api 프록시(:8080) → 로컬에서 직접 클릭

pnpm typecheck      # TypeScript 타입 체크
pnpm test           # E2E (핀된 Playwright 컨테이너 = CI와 동일 렌더 환경. 백엔드는 자동 기동)
                    #   baseline 재생성: pnpm test --update-snapshots
pnpm test:ui        # E2E UI 모드 — 호스트 브라우저에서 http://localhost:43210
pnpm storybook      # Storybook (dev, :6006). 배포 시엔 `/storybook` 경로로도 서빙됨
pnpm build-storybook

pnpm deploy:staging # staging 서버 배포
pnpm deploy:prod    # 프로덕션 배포
```

## 문서

- **`CLAUDE.md`** — 아키텍처(same-origin 프록시·환경 모델), 라우팅/코드 컨벤션, E2E 테스트 가이드, Storybook·디자인 시스템 규칙. 작업 전 참고.

## 참고사항

- ⚠️ 학외망에서 prod 서버 접속시 첫번째 시도는 실패할 수 있습니다.

## 관련 레포

- [wafflestudio/csereal-server](https://github.com/wafflestudio/csereal-server)
- [csereal-web](https://github.com/wafflestudio/csereal-web)
