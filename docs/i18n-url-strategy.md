# 다국어 URL 전략 — 기본 언어 무프리픽스(A) → 항상 프리픽스(B) 전환 근거

> 결론: **모든 언어에 경로 프리픽스를 붙이고(`/ko/...`·`/en/...`), 프리픽스 없는 주소는 언어를 감지해 리다이렉트하는 전략(B)** 으로 전환한다. nginx ISR 캐싱 작업의 선행 작업.

이 문서는 그 결정의 근거(실제 서비스 조사·프레임워크 기본값·SEO·캐싱)와 현재 구현에서 무엇을 바꾸는지를 정리한다.

---

## 1. 배경 — 무엇을 정하는 문제인가

다국어 사이트가 **URL에 언어를 어떻게 새기는가**에는 사실상 세 가지 방식뿐이다.

| 전략 | URL 예시 | 프레임워크 옵션명 |
|---|---|---|
| **A. 기본 언어 무프리픽스** (지금 우리) | `/about`=ko, `/en/about`=en | next-intl `as-needed` · Nuxt `prefix_except_default` |
| **B. 항상 프리픽스 + bare 리다이렉트** | `/about`→302, `/ko/about`, `/en/about` | next-intl `always` · Nuxt `prefix` |
| C. 무프리픽스 + 콘텐츠 협상 | `/about`이 사람마다 다른 언어 | next-intl `never` — SEO 깨짐, 비채택 |

실질 비교는 **A vs B**.

---

## 2. 실제 서비스 조사 (직접 측정)

`Accept-Language` 헤더를 바꿔가며 실제 응답을 관찰했다.

- **MDN**: `GET /` (ko) → **302 `/ko/`**, (en) → **302 `/en-US/`**. 맨 주소는 콘텐츠를 안 주고 언어 감지 후 리다이렉트. 모든 문서는 `/ko/`·`/en-US/` 아래에만 존재. → **B의 교과서**.
- **Samsung**: `GET /` → **301 `/sec/`**(한국 리전). 지역(geo) 기반이라 사람당 목적지가 고정 → 301 가능.
- **Apple**: 루트는 국가 선택, 콘텐츠는 `/kr/`·`/jp/` 항상 프리픽스. B 계열.
- **Next.js·Vercel·TanStack·Angular 공식 사이트**: bare에서 200(프리픽스 없음). 영어 단일 사이트라 i18n 라우팅 없음 — 비교 대상 아님.

URL로 언어를 구분하는 다국어 사이트는 거의 전부 **B**. 큰 다국어 사이트가 A를 쓰는 사례는 측정에서 안 잡혔다.

---

## 3. 프레임워크 기본값 — 가장 무거운 근거

**next-intl(Next.js i18n 사실상 표준)은 3.0에서 기본값을 A(`as-needed`)→B(`always`)로 바꿨다.** 그 이유 둘이 우리가 이 프로젝트에서 독립적으로 겪은 함정과 같다.

### 이유 ① — "점(.) 든 경로를 특별 처리할 필요가 없어진다"

다국어 라우팅은 요청마다 "이게 언어 처리할 페이지냐, 손대면 안 되는 파일이냐"를 가려야 한다. 흔한 어림짐작이 **"끝에 점(.)이 있으면 파일"**(`/favicon.ico`, `/sitemap.xml`). 문제는 점 든 진짜 페이지(`/users/jane.doe`, `/blog/node.js`)가 파일로 오인되는 것.

- **A**: 기본 언어 페이지에 프리픽스가 없어 "페이지냐"의 판별 단서가 점밖에 없다 → `/users/jane.doe`가 깨지고, matcher에 예외를 손으로 붙여야 한다.
- **B**: 페이지마다 `/ko`·`/en`이 박혀 판별 기준이 "프리픽스 유무"로 바뀐다 → 점에 의존할 필요가 사라진다.

(우리 코드에선 next-intl middleware matcher만큼 직접적이진 않으나, `routeFileIgnorePattern`·`[.]internal`·bare-vs-특수라우트 구분이 같은 부류의 부담이다.)

### 이유 ② — "Link href의 서버/클라 불일치" (우리 렌더 루프와 같은 뿌리)

next-intl 3.0 블로그 원문: *"an edge case of `Link` where we include a prefix for the default locale **on the server side** but **patch this on the client side by removing the prefix** (certain SEO tools might report a hint that a link points to a redirect)."*

메커니즘:
- A에서 기본 언어(ko)의 정식 주소는 무프리픽스 `/about`. 그런데 **무프리픽스 주소만으론 "방금 이 언어를 선택했다 → 쿠키를 갱신해라"는 의도를 서버에 전달할 수 없다**.
- 그래서 시스템은 쿠키 갱신을 위해 **일부러 프리픽스 붙은 `/en/about`을 운반 수단으로 거친 뒤** 무프리픽스로 strip-redirect한다. (next-intl: "superfluous prefix `/en/about` → `/about` redirect, Link가 이 메커니즘에 의존".)
- 결과: Link가 **서버에선 `/en/about`(프리픽스), 클라에선 `/about`(무프리픽스)** 으로 갈림 → (1) hydration 불일치, (2) SEO 도구가 "리다이렉트로 연결되는 링크"로 경고, (3) 크롤러 혼선.

**B**는 모든 링크가 곧 정식 URL(`/ko/about`)이라 운반→strip 자체가 없다 → 서버/클라 동일, 리다이렉트 안 가리킴.

**우리와의 관계(정직하게):** 우리가 겪은 `/ko`-strip **무한 리다이렉트(메인스레드 점유, "notice 상세 wedge")** 는 같은 "prefix 운반→strip dance"에서 나온 **더 심한 발현**이다. next-intl이 문서화한 건 가벼운 증상(href 불일치·SEO 힌트)이고, 우리는 무거운 증상까지 겪고 `localizedPath`로 우회 중. 같은 구조적 뿌리, 다른 강도. → 일화가 아니라 **표준 라이브러리가 구조적 이유로 택한 방향**이라는 게 핵심.

### Nuxt 교차 확인

`no_prefix`(C) · `prefix_except_default`(A) · `prefix`(B) · `prefix_and_default`(하이브리드: 기본 언어를 무프리픽스+프리픽스 둘 다 생성, canonical은 무프리픽스 — 중복 페이지·canonical 관리 비용).

---

## 4. SEO

- **서브디렉터리 구조 권장**(루트 도메인 권위 상속). 우리는 이미 서브디렉터리 — A든 B든 OK.
- **hreflang**: "이 페이지의 ko판은 여기, en판은 여기"를 각 페이지가 상호 참조. 규칙 = 대칭 + 자기참조 + `x-default` 필수(빠지면 구글이 세트 전체 무시).
- **B가 유리**: `/ko/x` ↔ `/en/x` 완벽 대칭이라 hreflang을 기계적으로 깐다. `x-default`는 bare 경로(언어 감지 리다이렉트)에 매핑. A는 "무프리픽스 ko"가 특례라 비대칭 실수 위험.

```html
<!-- B에서 /ko/notice/5 의 head -->
<link rel="alternate" hreflang="ko" href=".../ko/notice/5" />
<link rel="alternate" hreflang="en" href=".../en/notice/5" />
<link rel="alternate" hreflang="x-default" href=".../notice/5" />
```

---

## 5. 리다이렉트 상태코드 — 301이 아니라 302/307

bare → 언어 리다이렉트는 **사람마다 목적지가 다르다**(ko→`/ko`, en→`/en`). 301(영구)을 쓰면 CDN/브라우저가 "이 주소는 영원히 저기"로 캐시 → 먼저 온 ko 사용자의 `/about→/ko/about`가 캐시되어 **뒤에 온 en 사용자도 ko로 끌려간다**. 그래서 MDN은 **302**. 삼성이 301을 쓴 건 geo 기반(목적지 고정)이라 가능했던 것. → **우리도 bare 감지 리다이렉트는 302/307**, 공유 캐시엔 저장 안 함(200만 캐시).

---

## 6. 캐싱과의 연결 (B를 지금 하는 직접 이유)

nginx ISR 캐싱([[isr-csp-caching-plan]])에서 로케일 때문에 cache key에 "lang 버킷"을 넣어야 했다. **A**에선 같은 `/about`이 사람에 따라 ko 200이 되거나 `/en`으로 가는 302가 되어, URL만으론 캐시를 못 가른다.

**B**에선 모든 콘텐츠 URL이 언어 명시 → **응답 본문이 URL로 100% 결정** → **cache key = URL만, lang 버킷 불필요**. 언어로 갈리는 응답은 bare 302 하나뿐인데 그건 어차피 캐시 안 함. → 캐싱 설계가 한 단계 단순해진다.

---

## 7. 수동 언어 선택 (드롭다운)

수동 선택은 자동 감지를 덮어쓰고(override) 기억(persist)해야 한다. 우선순위: **명시 URL > `lang` 쿠키(수동 선택) > Accept-Language > 기본(ko)**.

- **B에서 토글 = 반대 프리픽스로 이동**(`/ko/x` → `/en/x`) + 기억용 쿠키 1줄. 프리픽스 페이지는 URL이 권위라 쿠키는 렌더에 영향 없음 → 쿠키는 오직 bare 진입의 tiebreaker.
- **캐싱 주의(향후 nginx 단계)**: `lang` 쿠키는 **클라이언트에서** 써라. SSR `Set-Cookie`로 내리면 nginx가 그 응답을 캐시 안 하는 안전장치에 걸린다. (지금 마이그레이션 단계에선 기존 `setLangCookie` serverFn 유지, nginx 단계에서 클라 세팅으로 전환 검토.)
- **A에선 기본 언어로의 수동 전환이 바로 그 strip/loop의 진원지** — B에서 사라진다.

---

## 8. 결정

실측(MDN 302·삼성·애플) + 프레임워크 기본값(next-intl이 동일 함정으로 `always` 전환) + SEO(대칭 hreflang) + 캐싱(lang 버킷 제거) + 기존 렌더 루프 버그 제거가 모두 **B로 수렴**. 유일한 반대급부는 "ko URL이 `/ko/` 달고 길어짐 + 일회성 마이그레이션". 캐싱·로케일을 어차피 만지는 타이밍이라 함께 청산.

---

## 9. 구현 (2026-06-21 완료)

**라우트 구조: optional `{-$locale}` → 필수 `$locale`.** "타입상 로케일이 항상 존재"가 보장돼 bare 경로가 구조적으로 렌더 불가가 된다(더 올바른 방향). 디렉터리 rename(`app/routes/{-$locale}/` → `$locale/`)으로 라우트 파일의 `createFileRoute('/{-$locale}/…')` 경로 문자열·`@/routes/{-$locale}/…` import 102개 파일·146회를 `$locale`로 일괄 치환(기계적 rename, 로직 0). `routeTree.gen.ts`는 vite build로 재생성. `params.locale === 'en' ? …` 패턴이 대부분이라 required 전환에도 소비처 타입 무탈.

비로케일 라우트(`admin`·`[.]internal`·`img`·`sitemap[.]xml`)는 `$locale` 밖 형제로 유지. `detectLangFromHeaders`는 이미 cookie>Accept-Language>ko 순서라 그대로 사용.

로직 변경:

1. **`app/routes/__root.tsx`** beforeLoad: `/ko` strip **제거** → 첫 세그먼트가 `ko`/`en`도 비로케일 라우트(`NON_LOCALE_SEGMENTS`)도 아니면(=bare) `readLangHeaders`+`detectLangFromHeaders`로 감지해 `/{lang}{path}` 리다이렉트. `/login/success`는 `/{lang}`. + loader가 `getSiteOrigin`을 반환하고 RootDocument가 head에 **hreflang ko/en/x-default**(절대 URL) 렌더.
2. **`app/routes/$locale/route.tsx`**: 유효 로케일 `ko|en`(아니면 notFound).
3. **`app/hooks/useLanguage.ts`**: `pathWithoutLocale`=`/(en|ko)` strip, `localizedPath`=**항상 `/${locale}${path}`**(home은 `/${locale}`), `changeLanguage` 타깃도 항상 프리픽스.
4. **`app/sitemap.tsx`**: `LOCALES = ['/ko', '/en']`.
5. **`app/utils/ssr.ts`**: `getSiteOrigin`(isomorphic) 추가 — hreflang 절대 URL용.

테스트:

- **`tests/language.spec.ts`(신규)** + playwright `language` 프로젝트(`testMatch: /language\.spec\.ts$/`, flow가 dependency로 read 단계에 포함). 7 케이스: bare→/ko·/en 감지, cookie>Accept-Language 우선순위, 토글+쿠키 persist, /ko no-loop 회귀 가드, hreflang head, 모바일 토글. **모두 프론트 소유 와이어링·상호작용**(와이어링 모양당 1번, 전 라우트 반복 X).
- **`tests/helpers/locale.ts`** `expectEnDetailHeading`: 현재 경로가 `/ko/…`라 로케일을 떼고 `/en`·`/ko`로 재부착하도록 수정.
- **기존 read/flow는 무수정으로 통과**: bare goto는 `setLocale(ko)` 쿠키와 함께 서버에서 `/ko`로 리다이렉트(콘텐츠 동일→스크린샷 baseline 재생성 불필요), URL 단언은 전부 `**`-glob·비앵커 정규식이라 `/ko` 프리픽스에 그대로 매칭.

---

## 출처

- next-intl 라우팅 설정: https://next-intl.dev/docs/routing/configuration
- next-intl 3.0 (기본값 `always` 전환): https://next-intl.dev/blog/next-intl-3-0
- Nuxt i18n 라우팅 전략: https://i18n.nuxtjs.org/docs/guide
- i18n SEO(hreflang/서브디렉터리): https://better-i18n.com/en/blog/i18n-seo-hreflang-locale-urls-guide/
- MDN·Samsung·Apple 리다이렉트 동작: 직접 측정(2026-06-21)
