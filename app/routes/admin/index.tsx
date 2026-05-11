import type { Route } from '.react-router/types/app/routes/admin/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import SelectionList from '~/components/feature/selection/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useSelectionList } from '~/hooks/useSelectionList';
import {
  ADMIN_MENU_IMAGE_MODAL,
  ADMIN_MENU_IMPORTANT,
  ADMIN_MENU_SLIDE,
  type ImageModal,
  type ImportantPreviewList,
  type SlidePreviewList,
} from '~/types/api/v2/admin';
import { fetchJson } from '~/utils/fetch';
import ImageModalManagement from './components/ImageModalManagement';
import ImportantManagement from './components/ImportantManagement';
import SlideManagement from './components/SlideManagement';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const selected = url.searchParams.get('selected') || ADMIN_MENU_SLIDE;
  const pageNum = url.searchParams.get('pageNum') || '1';

  // Get cookies from request to pass to API (required for JSESSIONID)
  const cookie = request.headers.get('cookie');
  if (!cookie) return;

  const headers: HeadersInit = { Cookie: cookie };

  if (selected === ADMIN_MENU_SLIDE) {
    const data = await fetchJson<SlidePreviewList>(
      `${BASE_URL}/v2/admin/slide?pageNum=${pageNum}`,
      { headers },
    );
    return { type: 'slide' as const, data };
  } else if (selected === ADMIN_MENU_IMAGE_MODAL) {
    const data = await fetchJson<ImageModal[]>(
      `${BASE_URL}/v2/image-modal`,
      { headers },
    );
    return { type: 'imageModal' as const, data };
  } else {
    const data = await fetchJson<ImportantPreviewList>(
      `${BASE_URL}/v2/admin/important?pageNum=${pageNum}`,
      { headers },
    );
    return { type: 'important' as const, data };
  }
}

const MENU_LABELS = {
  [ADMIN_MENU_SLIDE]: '슬라이드쇼 관리',
  [ADMIN_MENU_IMPORTANT]: '중요 안내 관리',
  [ADMIN_MENU_IMAGE_MODAL]: '이미지 팝업 관리',
} as const;

export default function AdminPage({ loaderData }: Route.ComponentProps) {
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
        // TODO: 문구
        if (!loaderData) return <p>로그인이 필요합니다.</p>;
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
              <ImageModalManagement
                key={modal?.id ?? 'new'}
                modal={modal}
              />
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
