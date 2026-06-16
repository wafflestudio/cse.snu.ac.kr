import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

/**
 * 로케일 세그먼트 레이아웃. optional path param `{-$locale}`은 임의의 첫 세그먼트를
 * locale로 매칭하므로(`/nope` → locale='nope'), 유효 로케일이 아니면 notFound로 보낸다.
 * - undefined: ko(무프리픽스) · 'en': 영어. 그 외(예: 'ko'는 root beforeLoad가 strip,
 *   임의 문자열)는 404. → 알 수 없는 경로가 메인으로 매칭되는 버그 방지.
 */
export const Route = createFileRoute('/{-$locale}')({
  beforeLoad: ({ params }) => {
    const locale = (params as { locale?: string }).locale;
    if (locale !== undefined && locale !== 'en') {
      throw notFound();
    }
  },
  component: Outlet,
});
