# ISR(리버스 프록시 캐싱) + strict CSP 양립 설계

> 상태: **구현 + 로컬 검증 완료(2026-06-21). staging 배포·측정 대기.** 패턴 A 채택.
> 작성 맥락: 번들/렌더 부하를 줄이려 ISR 도입. SSR + strict CSP(nonce)라 "nonce ↔ 캐시" 충돌을 먼저 풀어야 한다.

> **구현(이 설계 대비 델타):**
> - **단일 컨테이너**: 엣지 Caddy는 서버팀 주관이라 못 만짐 → 프론트 컨테이너 안에 nginx(:3000 공개) → Hono(:8787 내부). `docker-entrypoint.sh`가 둘을 기동, Hono는 `BEHIND_NGINX=1`.
> - **cache key = URL만**(`$scheme$host$request_uri`): 로케일 항상-프리픽스 전환([[i18n-url-strategy]]) 완료로 `$eff_lang` 맵 불필요(아래 §3.3의 lang map은 폐기).
> - **CSP 정책 단일 출처**: `scripts/gen-nginx-csp.ts`가 `app/utils/csp.ts`에서 빌드 시 `nginx/csp.conf` 생성 → nginx가 include.
> - **Cache-Control은 `server.ts`** 한 곳에서 경로 기반(비어드민 GET 200 HTML=캐시, admin/.internal=no-store), `BEHIND_NGINX` 게이트(라우트별 `headers()` 대신).
> - **컨테이너-로컬 캐시**(`/var/cache/nginx/app`): 새 배포=새 컨테이너=콜드 → 릴리스 간 stale 자동 방지.
> - **섹션 단위 능동 무효화(purge)**: staff 수정 직후 `fetchOk`가 현재 페이지에서 섹션을 도출
>   (로케일+후행 id/edit/create 제거; 예 `/ko/community/notice/edit/123`→`/community/notice`)해
>   `purgeCache(scope)` serverFn 호출. serverFn은 캐시파일 `KEY`(=`$request_uri`)에 그 섹션을
>   포함하는 항목(ko/en·상세·목록·페이지네이션)+메인을 삭제. admin 일괄작업은 영향 범위가 넓어
>   `scope='*'`(flush-all). BEHIND_NGINX·로그인 세션 게이트(익명 abuse 방지). node:fs는 핸들러 내
>   동적 import. TTL(s-maxage=60)은 purge가 놓친 경로의 백스톱.
> - 실제 파일: `nginx/nginx.conf`·`scripts/gen-nginx-csp.ts`·`docker-entrypoint.sh`·`Dockerfile`·`server.ts`·`app/router.tsx`·`app/utils/serverFns.ts`·`app/utils/fetch.ts`.
>
> **로컬 검증(컨테이너 빌드+curl)**: X-Cache MISS→HIT · Cache-Control s-maxage/SWR · CSP nonce가 헤더·body 일치하며 **캐시 HIT에도 매 요청 신선** · `__CSP_NONCE__` 잔존 0 · JSESSIONID BYPASS · **섹션 purge**(한 섹션만 비우면 그 섹션 MISS·타 섹션 HIT 유지). E2E(비-nginx 경로)는 BEHIND_NGINX 미설정이라 현행 동작 유지.

## 1. 배경 / 문제

- 현재 렌더링은 **per-request SSR** (TanStack Start, `server.ts`=Hono → `dist/server/server.js`).
  loader가 매 요청 백엔드에서 라이브 데이터를 fetch한다. SSG 아님(콘텐츠가 라이브 CMS).
- TanStack Start의 "ISR"은 프레임워크 마법이 아니라 **표준 HTTP 캐시 헤더**
  (`Cache-Control: public, s-maxage=…, stale-while-revalidate=…`)다. 이를 존중하는
  **캐시 계층(CDN이든 리버스 프록시든)** 이 ISR을 수행한다. 우리는 이미 nip.io 앞단에
  리버스 프록시(HTTPS)가 있으므로 **self-host nginx로 ISR이 가능**하다.
- **그러나 nonce 기반 strict CSP와 HTML 캐싱은 정면 충돌한다.** 캐시 키가 매 요청에
  안 갈리면 첫 응답의 nonce가 박힌 HTML이 모두에게 재서빙된다 → nonce의 "응답별 고유"
  보장이 깨진다. 더 나아가 stored-XSS가 캐시된 HTML에 한 번 들어가면 모든 방문자에게
  XSS가 되는 문서화된 실사례가 있다(Jorian Woltjer, "Nonce CSP bypass using disk cache").
- 따라서 **그냥 캐싱하면 안 되고**, 아래 두 정공법 중 하나가 필요하다.

### 참고 자료
- Next.js — nonce 쓰면 동적 렌더 강제(기본 CDN 캐시 불가): <https://nextjs.org/docs/pages/guides/content-security-policy>
- AEM — `strict-dynamic` + cached nonce 패턴: <https://www.aem.live/docs/csp-strict-dynamic-cached-nonce>
- 캐시된 nonce 위험 실사례: <https://jorianwoltjer.com/blog/p/research/nonce-csp-bypass-using-disk-cache>

## 2. 두 가지 패턴

### 패턴 A — 프록시가 요청마다 nonce 재주입 (**채택**)
캐시된 HTML엔 placeholder nonce(`__CSP_NONCE__`)를 박아두고, 캐시 계층이 **매 요청**
그걸 랜덤값으로 치환 + 같은 값으로 CSP 응답 헤더를 세팅한다. 본문은 캐시되지만 nonce는
per-request로 유지된다. 현재 CSP 모델(nonce)을 그대로 보존한다.

### 패턴 B — `strict-dynamic` + 상수 nonce (대안)
`script-src 'nonce-aem' 'strict-dynamic'`로 바꾸고 nonce를 캐시 엔트리당 상수로 허용한다.
`strict-dynamic`이 트러스트 체인 모델로 전환해 nonce 값 노출의 치명도를 낮춘다.
- 장점: 재주입 불필요(운영 단순).
- 단점: **CSP 시맨틱이 바뀜**. `strict-dynamic`은 host 화이트리스트를 무시하므로
  외부 스크립트(KakaoMap=daumcdn)가 반드시 **trust-chain(우리 JS가 동적 주입)** 으로
  로드돼야 한다. 초기 HTML에 parser-inserted `<script src>`로 박혀 있으면 차단됨 → 사전 검증 필요.

> **결정:** self-host nginx + 현 CSP 유지에는 **패턴 A가 정합적**. strict-dynamic 의미 변화나
> 외부 스크립트 trust-chain 검증 없이, 앱은 placeholder만 내보내고 nginx가 per-request nonce를
> 책임진다. (패턴 B는 나중에 운영 단순화가 필요하면 재검토.)

## 3. 패턴 A 설계

### 3.1 아키텍처
```
브라우저 ─HTTPS─> nginx (nip.io)
                  ├─ proxy_cache app            # 익명·로케일별 read 응답만
                  ├─ sub_filter __CSP_NONCE__ → $request_id   # 매 요청(캐시히트 포함)
                  ├─ add_header CSP (nonce-$request_id)        # 매 요청
                  └─ proxy_pass :3000 (TanStack SSR)
```
핵심: 캐시된 본문엔 `nonce="__CSP_NONCE__"`가 있고, nginx가 매 요청 본문 placeholder를
`$request_id`로 치환 + 같은 값으로 CSP 헤더를 세팅 → 본문은 캐시돼도 **nonce는 응답별 고유**.

### 3.2 앱 변경

**(a) `app/router.tsx` — 프록시 모드면 placeholder, 헤더는 nginx 위임**
```ts
const NONCE_PLACEHOLDER = '__CSP_NONCE__';
const cspViaProxy = () => process.env.CSP_NONCE_PROXY === '1'; // nginx-fronted 배포에서만 set

const setupCsp = createIsomorphicFn()
  .server((): string => {
    if (cspViaProxy()) return NONCE_PLACEHOLDER; // 본문에 placeholder만, CSP/보안헤더는 nginx 소유
    // dev / E2E preview(프록시 없음): 기존 그대로 — 진짜 nonce + 앱이 헤더 세팅
    const nonce = createNonce();
    setResponseHeader(
      import.meta.env.DEV ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
      getCSPHeaders(nonce),
    );
    setResponseHeader('X-Frame-Options', 'SAMEORIGIN');
    setResponseHeader('X-Content-Type-Options', 'nosniff');
    setResponseHeader('Strict-Transport-Security', 'max-age=3600');
    return nonce;
  })
  .client(() => undefined);
```
- `ssr.nonce=placeholder` → TanStack이 모든 `<script>`·`<meta csp-nonce>`·HTMLViewer
  `<style nonce>`에 `__CSP_NONCE__`를 박는다 → nginx가 일괄 치환. **`useNonce`/`__root` 무변경**
  (클라는 치환된 meta에서 실제 nonce를 읽는다).
- `CSP_NONCE_PROXY=1`은 **배포 컨테이너 env**로만 주입(remote-deploy의 `docker run -e`).
  dev·E2E preview엔 미설정 → 현재 동작 유지(프록시 없이도 깨지지 않음).

**(b) cacheable read 라우트에 `Cache-Control` (per-route `headers()`)**
```ts
export const Route = createFileRoute('/{-$locale}/community/notice/')({
  headers: () => ({ 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' }),
  loader: /* … */,
});
```
- `max-age=0`(브라우저 항상 재검증) · `s-maxage=60`(nginx fresh) · `swr=600`(백그라운드 갱신).
- **선택 적용** — 트래픽 높은 read부터(메인·notice/news 목록·상세). admin/edit/mutation·검색
  (`?keyword=` 등 고카디널리티)은 제외.

### 3.3 nginx 설정 (초안)
```nginx
# 앱 detectLangFromHeaders 미러: lang 쿠키 우선, 없으면 Accept-Language(en*→en, else ko)
map $cookie_lang $eff_lang { "ko" ko; "en" en; default $al_lang; }
map $http_accept_language $al_lang { "~*^en" en; default ko; }

proxy_cache_path /var/cache/nginx/app levels=1:2 keys_zone=app:50m
                 max_size=1g inactive=10m use_temp_path=off;

server {
  # … TLS, server_name 168.107.16.249.nip.io …

  location /api/       { proxy_pass http://127.0.0.1:3000; }   # 캐시 안 함
  location /_serverFn/ { proxy_pass http://127.0.0.1:3000; }   # 캐시 안 함
  location /assets/    { proxy_pass http://127.0.0.1:3000;     # 해시 파일 → 장기 immutable
                         add_header Cache-Control "public, max-age=31536000, immutable"; }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Accept-Encoding "";                 # sub_filter는 비압축 본문에만
    gzip on; gzip_types text/html;                       # 치환 후 nginx가 재압축

    # nonce: 매 요청 placeholder 치환 (캐시 히트에도 적용됨)
    sub_filter_types text/html;
    sub_filter_once off;
    sub_filter '__CSP_NONCE__' '$request_id';

    # CSP/보안 헤더: nginx가 소유, 매 요청 $request_id
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-$request_id' https://t1.daumcdn.net http://t1.daumcdn.net https://dapi.kakao.com; style-src 'self' 'nonce-$request_id' https://fonts.googleapis.com 'sha256-kAApudxpTi9mfjlC9lC8ZaS9xFHU9/NLLbB173MU7SU=' https://cdn.jsdelivr.net/gh/orioncactus/; img-src 'self' https://cse.snu.ac.kr https://mts.daumcdn.net http://mts.daumcdn.net https://t1.daumcdn.net http://t1.daumcdn.net; font-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net" always;
    add_header Strict-Transport-Security "max-age=3600" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # 캐시: 익명 + 로케일별. s-maxage 있는 응답만 저장(앱이 cacheability 결정)
    proxy_cache app;
    proxy_cache_key    "$scheme$host$request_uri:$eff_lang";
    proxy_cache_bypass $cookie_JSESSIONID;     # 로그인 staff는 캐시 미사용(fresh)
    proxy_no_cache     $cookie_JSESSIONID;     # staff 응답 저장 금지
    proxy_cache_background_update on;           # SWR
    proxy_cache_use_stale updating error timeout;
    add_header X-Cache-Status $upstream_cache_status always;   # 검증용
  }
}
```
- `add_header`는 캐시 히트에도 매 요청 실행 → 헤더 nonce와 sub_filter 본문 nonce가 **요청마다 동일**.
- 캐시 키에 `$eff_lang` → `/about`(ko=본문 / en=302 리다이렉트)이 섞이지 않음.
- `proxy_no_cache $cookie_JSESSIONID` → staff UI(편집버튼 등)는 절대 캐시 안 됨.

## 4. 정합성 체크포인트 (검증 필수)

| 리스크 | 처리 / 검증 |
|---|---|
| **공유 nonce** | sub_filter + add_header가 `$request_id`로 매 요청 갈림 → `curl -I` 2회 시 CSP의 nonce가 **달라야** 함 |
| **로케일 혼선** | `$eff_lang` 키가 detectLang 미러. canonical `/en/*`부터 보수적으로 확대 |
| **인증 UI 캐시** | JSESSIONID bypass + no_cache. 익명 my-role=[]라 익명 응답은 균일 |
| **sub_filter 누락** | nonce가 버퍼 경계로 쪼개지면 미치환 → 응답 HTML에서 `__CSP_NONCE__` 잔존 **0** 확인 |
| **gzip 충돌** | upstream `Accept-Encoding ""`(필수, sub_filter는 압축 본문 못 다룸) → nginx 재압축 |
| **Set-Cookie** | 페이지 GET은 Set-Cookie 없음(확인됨: lang 쿠키는 토글 serverFn=POST만). 캐시 가능 |
| **신선도** | s-maxage TTL만큼 글 수정 반영 지연. 즉시 무효화 필요 시 백엔드 저장→`proxy_cache_purge` 웹훅(선택, 상용 모듈) |

## 5. 롤아웃 (staging부터 점진)

1. **앱**: `CSP_NONCE_PROXY` 분기 + 파일럿 라우트 1~2개(`/`·notice 목록)에 `Cache-Control`. 빌드.
2. **컨테이너 env**: `CSP_NONCE_PROXY=1` 추가(remote-deploy `docker run -e`).
3. **nginx**: 위 설정 staging 적용 → 검증:
   - `curl -I` 2회 → CSP nonce **매번 다름** + 본문 `__CSP_NONCE__` 잔존 0.
   - `X-Cache-Status: MISS→HIT`(익명), 로그인 쿠키 시 `BYPASS`.
   - ko/en 각각 올바른 본문(브라우저 CSP 위반 0).
4. 문제 없으면 라우트 확대 + TTL 튜닝. 필요 시 purge 웹훅.

## 6. 트레이드오프 / 추천 순서

- **이득**: 익명 read의 SSR·백엔드 fetch를 nginx 캐시가 흡수(부하·TTFB↓). strict CSP(nonce) 유지.
- **비용**: nginx 설정 복잡도(sub_filter+gzip+로케일 맵) + s-maxage 신선도 지연 + 검증 부담.
- **추천 순서**:
  1. 지금은 **앱에 `Cache-Control`만 무해하게 추가**(nginx 없이도 안전, 효과는 아직 0) — 리스크 0.
  2. nginx는 **staging에서 위 설정으로 PoC** 후 측정.
  3. 효과 확인되면 prod. **실제 nginx 적용은 인프라 담당 확인 후.**
- 현재 규모에선 ISR보다 **번들 축소가 더 싼 레버**(cheerio 제거 완료, 셸 SVG 외부화 등). ISR은
  트래픽이 늘어 SSR/백엔드가 병목으로 보일 때 도입하는 게 순서상 맞다.

## 7. 열린 질문
- s-maxage TTL 기본값(콘텐츠 신선도 vs 캐시 효율). 공지 60s/메인 300s 등 라우트별 차등?
- 즉시 무효화(purge 웹훅) 도입 여부 — 백엔드에 글 저장 훅을 걸 수 있는가?
- 패턴 B(strict-dynamic)로 갈 경우 KakaoMap·외부 스크립트 로딩 방식 전수 검증 필요.
