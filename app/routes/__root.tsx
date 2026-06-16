import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from '@tanstack/react-router';
import clsx from 'clsx';
import { useEffect } from 'react';
import '~/app.css';
import '~/components/ui/sonner/styles.css';
import { useNavigate } from '@tanstack/react-router';
import Footer from '~/components/layout/Footer';
import Header from '~/components/layout/Header';
import LNB from '~/components/layout/LeftNav';
import MobileNav from '~/components/layout/MobileNav';
import NotFound from '~/components/system/NotFound';
import ErrorState from '~/components/ui/ErrorState';
import { Toaster } from '~/components/ui/sonner';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import useIsMobile from '~/hooks/useResponsive';
import { forwardAuthHeaders, readLangHeaders } from '~/lib/ssr';
import { type Role, useStore } from '~/store';
import { detectLangFromHeaders } from '~/utils/lang';

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname;
    const search = location.searchStr ?? '';

    // /ko 프리픽스는 ko=무프리픽스 정책상 항상 제거(클라/서버 공통, 검색 보존).
    if (pathname === '/ko' || pathname.startsWith('/ko/')) {
      const stripped = pathname.replace(/^\/ko/, '') || '/';
      throw redirect({ href: `${stripped}${search}` });
    }
    if (pathname === '/login/success') {
      throw redirect({ href: '/' });
    }

    // 쿠키/Accept-Language 기반 로케일 판정은 서버에서만(클라는 Link가 이미 localized).
    const langHeaders = readLangHeaders();
    if (!langHeaders) return;
    const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/';
    const lang = detectLangFromHeaders(langHeaders);
    if (lang === 'en' && !/^\/en/.test(pathname)) {
      throw redirect({ href: `/en${pathWithoutLocale}${search}` });
    }
    if (lang === 'ko' && /^\/en/.test(pathname)) {
      throw redirect({ href: `${pathWithoutLocale}${search}` });
    }
  },
  // my-role: 세션 역할(전 라우트 공통). 세션 내 안정적이라 staleTime으로 네비게이션마다 재요청 방지.
  loader: async (): Promise<Role[]> => {
    try {
      const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
        headers: forwardAuthHeaders(),
      });
      if (!response.ok) return [];
      const { roles }: { roles: string[] } = await response.json();
      return roles.filter((r) => r !== 'ROLE_ANONYMOUS') as Role[];
    } catch {
      return [];
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
  const roles = Route.useLoaderData();
  useEffect(() => {
    useStore.setState({ roles: roles ?? [] });
  }, [roles]);

  const { localizedPath, locale, pathWithoutLocale } = useLanguage();
  const isMain = pathWithoutLocale === '/';
  const paddingLeft = isMain ? 'sm:pl-[11rem]' : 'sm:pl-[6.25rem]';

  const isMobile = useIsMobile();
  const isOpen = useStore((s) => s.navbarState.type !== 'closed');
  const isScrollBlocked = isMobile && isOpen;

  return (
    <html lang={locale}>
      <head>
        <HeadContent />
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
