import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import NotFound from '@/components/layout/NotFound';

/**
 * 로케일 세그먼트 레이아웃. 필수 path param `$locale`은 첫 세그먼트를 locale로 매칭한다.
 * 유효 로케일('ko'|'en')이 아니면 notFound. 프리픽스 없는 bare 경로는 __root beforeLoad가
 * 먼저 `/{lang}`으로 리다이렉트하므로, 여기 도달하는 locale은 항상 실제 첫 세그먼트 값이다.
 *
 * notFoundComponent: 로케일 하위의 미존재 경로(`/ko/없는길`)와 잘못된 로케일의 notFound는
 * 발생한 라우트 레벨에서 처리되므로(__root로 안 올라감) 여기서 직접 NotFound를 렌더한다.
 */
export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params }) => {
    const locale = (params as { locale: string }).locale;
    if (locale !== 'ko' && locale !== 'en') {
      throw notFound();
    }
  },
  notFoundComponent: NotFound,
  component: Outlet,
});
