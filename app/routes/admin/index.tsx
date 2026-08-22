import { createFileRoute, notFound } from '@tanstack/react-router';
import SelectionList from '@/components/feature/selection/SelectionList';
import PageLayout from '@/components/layout/PageLayout';
import { BASE_URL } from '@/constants/api';
import { useSelectionList } from '@/hooks/useSelectionList';
import {
  ADMIN_MENU_IMAGE_MODAL,
  ADMIN_MENU_IMPORTANT,
  ADMIN_MENU_SLIDE,
  type ImageModal,
  type ImportantPreviewList,
  type SlidePreviewList,
} from '@/types/api/v2/admin';
import { fetchSessionRoles } from '@/utils/auth';
import { fetchJson } from '@/utils/fetch';
import { searchLoaderDeps } from '@/utils/loaderDeps';
import { forwardAuthHeaders } from '@/utils/ssr';
import ImageModalManagement from './components/ImageModalManagement';
import ImportantManagement from './components/ImportantManagement';
import SlideManagement from './components/SlideManagement';

const MENU_LABELS = {
  [ADMIN_MENU_SLIDE]: '슬라이드쇼 관리',
  [ADMIN_MENU_IMPORTANT]: '중요 안내 관리',
  [ADMIN_MENU_IMAGE_MODAL]: '이미지 팝업 관리',
} as const;

function AdminPage() {
  const loaderData = Route.useLoaderData();

  const { selectionItems } = useSelectionList({
    items: [ADMIN_MENU_SLIDE, ADMIN_MENU_IMPORTANT, ADMIN_MENU_IMAGE_MODAL],
    getItem: (item) => ({
      id: item,
      label: MENU_LABELS[item as keyof typeof MENU_LABELS],
    }),
  });

  return (
    <PageLayout
      title="관리자 메뉴"
      titleSize="xl"
      subNav={{
        title: '관련 페이지',
        titlePath: '/admin',
        items: [
          { name: '공지사항', path: '/community/notice', depth: 1 },
          { name: '새 소식', path: '/community/news', depth: 1 },
          { name: '세미나', path: '/community/seminar', depth: 1 },
        ],
      }}
    >
      <SelectionList items={selectionItems} />

      {(() => {
        // 비로그인은 beforeLoad에서 404로 걸러지므로 여기선 항상 데이터가 있다.
        if (loaderData.type === 'slide') {
          return (
            <>
              <SlideDescription />
              <SlideManagement
                slides={loaderData.data.slides}
                total={loaderData.data.total}
              />
            </>
          );
        }
        if (loaderData.type === 'imageModal') {
          const modal = loaderData.data[0] ?? null;
          return (
            <>
              <ImageModalDescription />
              <ImageModalManagement key={modal?.id ?? 'new'} modal={modal} />
            </>
          );
        }
        return (
          <>
            <ImportantDescription />
            <ImportantManagement
              importants={loaderData.data.importants}
              total={loaderData.data.total}
            />
          </>
        );
      })()}
    </PageLayout>
  );
}

function SlideDescription() {
  return (
    <p className="mb-10 bg-neutral-100 px-6 py-5 text-md leading-loose">
      메인페이지의 슬라이드쇼에는 <strong>{`소식 > 새 소식`}</strong> 중{' '}
      <strong>{`'슬라이드쇼에 표시'`}</strong> 체크박스가 선택된 글들이
      올라갑니다. 이 목록에 20개 이상의 글이 포함되면 자동으로 최신글 20개만
      표시되지만, 원활한 유지보수를 위하여 주기적인 관리가 필요합니다.
      <br />
      <br />
      슬라이드쇼는 4개씩 표시되기 때문에, 개수를 4의 배수로 맞춰주시는 것이
      레이아웃에 최선입니다.
    </p>
  );
}

function ImportantDescription() {
  return (
    <p className="mb-10 bg-neutral-100 px-6 py-5 text-md leading-loose">
      메인페이지의 중요 안내에는{' '}
      <strong>{`소식 > 공지사항, 새 소식, 세미나`}</strong> 중{' '}
      <strong>{`'중요 안내에 표시'`}</strong> 체크박스가 선택된 글들이
      올라갑니다.
      <br />
      메인페이지에 보이는 중요 안내 개수 제한은 없지만, 원활한 유지보수를 위하여
      주기적인 관리가 필요합니다.
    </p>
  );
}

function ImageModalDescription() {
  return (
    <p className="mb-10 bg-neutral-100 px-6 py-5 text-md leading-loose">
      메인페이지 진입 시 노출되는 이미지 팝업을 관리합니다. 한 번에 하나의
      팝업만 표시되며, 표시 종료일이 지난 팝업은 자동으로 숨겨집니다.
      <br />
      <br />
      외부 링크를 입력하면 팝업에 <strong>{`'자세히 보기'`}</strong> 버튼이
      노출됩니다. 사용자가 <strong>{`'다시 보지 않기'`}</strong>를 선택한 경우,
      해당 팝업이 삭제·재등록되기 전까지는 다시 노출되지 않습니다.
    </p>
  );
}

export const Route = createFileRoute('/admin/')({
  /**
   * 비로그인에게는 관리자 페이지의 존재를 드러내지 않는다(404). 인가 강제는 백엔드 몫이고
   * 여기서는 "무엇을 렌더할지"만 정한다.
   *
   * 게이트 없이 loader가 그냥 백엔드를 부르면 **500**이 나간다 — 백엔드가 비로그인에
   * 401/403이 아니라 302 OAuth 리다이렉트를 주는데 앱이 그 최종 URL에 도달할 수 없기
   * 때문이다. SSR 시점엔 store의 roles가 비어 있어 `LoginVisible`로는 서버 상태를 못 정한다.
   *
   * ⚠️ `__root` loader도 my-role을 부르므로 이 페이지는 my-role을 두 번 탄다. 자식
   * beforeLoad에서 부모 loader 결과를 읽을 방법이 없어서다. root의 beforeLoad로 올리면
   * 중복은 사라지지만 loader의 staleTime(5분)을 잃어 **모든 네비게이션**이 my-role을 타므로,
   * 저빈도 스태프 페이지인 여기서 한 번 더 부르는 편이 전체 비용이 낮다.
   */
  beforeLoad: async () => {
    const roles = await fetchSessionRoles();
    if (roles.length === 0) throw notFound();
  },
  loaderDeps: searchLoaderDeps,
  loader: async ({ location }) => {
    const searchStr = location.searchStr;
    const sp = new URLSearchParams(searchStr);
    const selected = sp.get('selected') || ADMIN_MENU_SLIDE;
    const pageNum = sp.get('pageNum') || '1';

    // 인증 헤더: 서버(SSR)는 요청 쿠키를 포워딩, 클라(revalidate/SPA)는 same-origin
    // fetch가 JSESSIONID를 자동 첨부한다. RR은 loader가 항상 서버 실행이라 request.headers
    // 에 쿠키가 있었지만, TanStack은 클라에서도 loader가 돌아 synthetic request엔 쿠키가
    // 없다 → forwardAuthHeaders로 양쪽 모두 인증되게 한다(이 early-return이 admin 목록
    // revalidate 미반영 버그의 원인이었음).
    const headers = forwardAuthHeaders();

    if (selected === ADMIN_MENU_SLIDE) {
      const data = await fetchJson<SlidePreviewList>(
        `${BASE_URL}/v2/admin/slide?pageNum=${pageNum}`,
        { headers },
      );
      return { type: 'slide' as const, data };
    } else if (selected === ADMIN_MENU_IMAGE_MODAL) {
      const data = await fetchJson<ImageModal[]>(`${BASE_URL}/v2/image-modal`, {
        headers,
      });
      return { type: 'imageModal' as const, data };
    } else {
      const data = await fetchJson<ImportantPreviewList>(
        `${BASE_URL}/v2/admin/important?pageNum=${pageNum}`,
        { headers },
      );
      return { type: 'important' as const, data };
    }
  },
  component: AdminPage,
});
