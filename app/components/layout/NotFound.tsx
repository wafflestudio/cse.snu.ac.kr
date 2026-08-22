import { useLocation, useNavigate } from '@tanstack/react-router';
import Header from '@/components/layout/Header';
import ErrorState from '@/components/ui/ErrorState';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * 404 화면. `__root`와 `$locale` 두 라우트의 notFoundComponent가 공유한다.
 *
 * HTTP 404 상태는 **TanStack Start가 붙인다** — 여기서 setResponseStatus를 부르지 않는다.
 * 프레임워크 동작에 기대는 셈이므로 `tests/security.spec.ts`가 상태 코드를 직접 지킨다.
 *
 * `<title>`·`noindex`가 없으면 제목 없는 문서가 탭·검색결과에 URL로 노출되고, robots.txt가
 * 크롤링을 허용하므로 크롤러가 soft 404로 색인한다.
 */
export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { localizedPath, t } = useLanguage({
    '존재하지 않는 경로입니다': 'Page not found',
    '메인으로 이동': 'Go to home',
  });

  return (
    <>
      <title>{t('존재하지 않는 경로입니다')}</title>
      <meta name="robots" content="noindex" />
      <Header />
      <ErrorState
        title="404"
        message={`${t('존재하지 않는 경로입니다')}: ${pathname}`}
        action={{
          label: t('메인으로 이동'),
          onClick: () => navigate({ to: localizedPath('/') }),
        }}
      />
    </>
  );
}
