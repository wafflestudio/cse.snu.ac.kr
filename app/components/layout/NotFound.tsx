import { useLocation, useNavigate } from '@tanstack/react-router';
import Header from '@/components/layout/Header';
import ErrorState from '@/components/ui/ErrorState';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * 404 화면. HTTP 상태 404는 **TanStack Start가 알아서 붙인다** — 별도로 setResponseStatus를
 * 부르지 않는다(중복. 실측으로 확인: 이 컴포넌트 수정 전 빌드도 `/docs`·`/ko/없는길`·
 * `/en/no-such` 전부 404였다). 대신 그 동작에 의존하므로 tests/security.spec.ts가 지킨다.
 *
 * 여기서 <title>·noindex를 다는 건 실제로 비어 있었기 때문이다(수정 전 staging 실측:
 * title 없음, noindex 없음). 제목 없는 문서는 브라우저 탭·검색결과에 URL이 그대로 노출된다.
 */
export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { localizedPath, t } = useLanguage({
    '존재하지 않는 경로입니다': 'Page not found',
    '메인으로 이동': 'Go to home',
    '페이지를 찾을 수 없습니다': 'Page not found',
  });

  return (
    <>
      <title>{t('페이지를 찾을 수 없습니다')}</title>
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
