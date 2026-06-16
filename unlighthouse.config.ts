/**
 * 페이지별 Lighthouse — Unlighthouse 설정.
 *
 * 사용법:
 *   1) 앱을 띄운다(프로덕션 빌드 = E2E와 동일한 preview-server):
 *      VITE_API_BASE_URL=http://localhost:3000 pnpm build
 *      PORT=3000 pnpm start            # /api는 로컬 docker 백엔드(:8080)로 프록시
 *   2) 다른 터미널에서:  pnpm lighthouse
 *
 * Unlighthouse가 사이트를 크롤링(+sitemap)해 라우트별 점수를 대시보드로 보여준다.
 * 라우트별 설정 불필요 — 새 페이지가 생겨도 자동 발견. (기존 docker cron과 별개의 dev 도구)
 *
 * unlighthouse는 설치하지 않고 `pnpm dlx`로 온디맨드 실행한다(가끔 쓰는 perf 도구라
 * devDep·락파일·잠재적 의존 충돌을 피함). 그래서 여기선 타입 import 없이 평범한 객체로 둔다.
 */
const config = {
  site: process.env.LH_SITE ?? 'http://localhost:3000',
  scanner: {
    device: 'desktop',
    samples: 1,
    throttle: true,
  },
  // 프론트 페이지만 측정 — /api 프록시·/img 최적화 엔드포인트·en 중복·sitemap 제외.
  exclude: ['/en.*', '/api/.*', '/img.*', '/sitemap.xml'],
};

export default config;
