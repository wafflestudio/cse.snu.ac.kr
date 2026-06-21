import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect } from 'react';
import '@/app.css';
import '@/components/ui/sonner/styles.css';
import { useNavigate } from '@tanstack/react-router';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LNB from '@/components/layout/LeftNav';
import MobileNav from '@/components/layout/MobileNav';
import NotFound from '@/components/layout/NotFound';
import ErrorState from '@/components/ui/ErrorState';
import { Toaster } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useNonce } from '@/hooks/useNonce';
import useIsMobile from '@/hooks/useResponsive';
import { type Role, useStore } from '@/store';
import { detectLangFromHeaders } from '@/utils/lang';
import {
  forwardAuthHeaders,
  getSiteOrigin,
  readLangHeaders,
} from '@/utils/ssr';

// 로케일 프리픽스를 부여하지 않는 최상위(비로케일) 라우트. 정적 에셋은 SSR 전에 서빙돼 여기 도달 안 함.
const NON_LOCALE_SEGMENTS = new Set([
  'admin',
  '.internal',
  'img',
  'sitemap.xml',
  'assets',
]);

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname;
    const search = location.searchStr ?? '';
    const firstSeg = pathname.split('/')[1] ?? '';

    // 이미 로케일 프리픽스가 있으면 통과($locale route가 검증·렌더).
    if (firstSeg === 'ko' || firstSeg === 'en') return;
    // 비로케일 최상위 라우트는 프리픽스 부여 대상이 아님.
    if (NON_LOCALE_SEGMENTS.has(firstSeg)) return;

    // 프리픽스 없는 bare 경로 → /{lang} 부여(로케일-프리픽스 불변식을 서버·클라 양쪽에서 보장).
    // - 서버: 쿠키/Accept-Language로 감지(사용자별로 갈리므로 캐시 금지, 302).
    // - 클라 네비: readLangHeaders=null → 네비 전 현재 URL의 로케일을 유지. 대부분의 링크는
    //   localizedPath로 이미 프리픽스되지만, bare로 새는 navigate(예: mutation 후 상세 이동)도
    //   여기서 일관되게 보정된다(개별 호출부 땜질 대신 라우터 차원 보장).
    const langHeaders = readLangHeaders();
    const lang = langHeaders
      ? detectLangFromHeaders(langHeaders)
      : typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/en')
        ? 'en'
        : 'ko';

    // OAuth 콜백은 로케일 홈으로.
    if (pathname === '/login/success') {
      throw redirect({ href: `/${lang}` });
    }
    const base = pathname === '/' ? '' : pathname;
    throw redirect({ href: `/${lang}${base}${search}` });
  },
  // my-role: 세션 역할(전 라우트 공통). 세션 내 안정적이라 staleTime으로 네비게이션마다 재요청 방지.
  loader: async (): Promise<{ roles: Role[]; origin: string }> => {
    const origin = getSiteOrigin();
    try {
      const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
        headers: forwardAuthHeaders(),
      });
      if (!response.ok) return { roles: [], origin };
      const { roles }: { roles: string[] } = await response.json();
      return {
        roles: roles.filter((r) => r !== 'ROLE_ANONYMOUS') as Role[],
        origin,
      };
    } catch {
      return { roles: [], origin };
    }
  },
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        as: 'style',
        crossOrigin: 'anonymous',
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RootErrorBoundary,
});

function RootDocument() {
  const nonce = useNonce();
  const { roles, origin } = Route.useLoaderData();
  useEffect(() => {
    useStore.setState({ roles: roles ?? [] });
  }, [roles]);

  const { locale, pathWithoutLocale } = useLanguage();
  const altPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
  const isMain = pathWithoutLocale === '/';
  const paddingLeft = isMain ? 'sm:pl-[11rem]' : 'sm:pl-[6.25rem]';

  const isMobile = useIsMobile();
  const isOpen = useStore((s) => s.navbarState.type !== 'closed');
  const isScrollBlocked = isMobile && isOpen;

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
        {/* 로케일 대체 링크(SEO). 모든 페이지가 ko/en 프리픽스로 대칭, x-default=ko. */}
        <link rel="alternate" hrefLang="ko" href={`${origin}/ko${altPath}`} />
        <link rel="alternate" hrefLang="en" href={`${origin}/en${altPath}`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${origin}/ko${altPath}`}
        />
        {/* 클라가 SPA 네비 시 주입 스타일에 쓸 nonce 전달(useNonce가 읽음) */}
        {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
      </head>
      <body className="sm:min-w-[1200px] bg-neutral-900 font-normal text-neutral-950">
        <LNB />
        <MobileNav />
        <main
          className={clsx(
            'flex min-h-full min-w-full flex-col',
            paddingLeft,
            isScrollBlocked ? 'overflow-hidden h-full' : '',
          )}
        >
          <Outlet />
          <Footer />
          <Toaster />
        </main>
        <Scripts />
      </body>
    </html>
  );
}

/** 던져진 Response류({ status, statusText }) 판별(RR isRouteErrorResponse 대체). */
function isErrorResponse(
  error: unknown,
): error is { status: number; statusText: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    'statusText' in error
  );
}

function RootErrorBoundary({ error }: { error: unknown }) {
  const { t, localizedPath } = useLanguage({ '메인으로 이동': 'Go to home' });
  const navigate = useNavigate();
  const message = isErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body className="sm:min-w-[1200px] bg-neutral-900 font-normal text-neutral-950">
        <Header />
        <ErrorState
          title="500"
          message={`Error: ${message}`}
          action={{
            label: t('메인으로 이동'),
            onClick: () => navigate({ to: localizedPath('/') }),
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
