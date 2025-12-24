import type { Route } from '.react-router/types/app/routes/about/directions/+types/index';
import { Link } from 'react-router';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import SelectionList from '~/components/common/SelectionList';
import footerTranslations from '~/components/layout/Footer/translations.json';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useSelectionList } from '~/hooks/useSelectionList';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { DirectionsResponse } from '~/types/api/v2/about/directions';
import { encodeParam } from '~/utils/string';
import KakaoMap from './components/KakaoMap';

export async function loader() {
  const response = await fetch(`${BASE_URL}/v2/about/directions`);
  if (!response.ok) throw new Error('Failed to fetch directions');

  return (await response.json()) as DirectionsResponse;
}

export default function DirectionsPage({
  loaderData: directions,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage({
    ...footerTranslations,
    '찾아오는 길': 'Directions',
    주소: 'Address',
    전화: 'Tel',
    '컴퓨터공학부는 서울대학교 관악 301동(신공학관1)에 있습니다.':
      'The Department of Computer Science and Engineering is located in Building 301 (Engineering Building 1) on the Gwanak campus of Seoul National University.',
  });
  const subNav = useAboutSubNav();

  const { selectedItem: selectedDirection, selectionItems } = useSelectionList({
    items: directions,
    getItem: (direction) => ({
      id: direction.en.name || direction.ko.name,
      label: direction[locale]?.name ?? direction.ko.name,
    }),
  });

  return (
    <PageLayout
      title={t('찾아오는 길')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('찾아오는 길'), path: '/about/directions' },
      ]}
      subNav={subNav}
      padding="noTop"
    >
      <div className="mb-12 pt-7 sm:pt-11">
        <p className="mb-8 text-md leading-[200%] text-neutral-700">
          {t('컴퓨터공학부는 서울대학교 관악 301동(신공학관1)에 있습니다.')}
          <br />
          {t('주소')}:{' '}
          {t(
            '08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부 행정실(301동 316호)',
          )}
          <br />
          {t('전화')}:{' '}
          {
            <Link
              to={localizedPath('/people/staff')}
              className="text-link hover:underline"
            >
              {t('학부 연락처')}
            </Link>
          }
        </p>
        <KakaoMap />
      </div>

      <SelectionList items={selectionItems} />

      {selectedDirection && (
        <div>
          <div className="mb-4 justify-between sm:flex">
            <h4 className="text-base font-semibold sm:text-2xl">
              {selectedDirection[locale]?.name}
            </h4>
            <LoginVisible allow="ROLE_STAFF">
              <Button
                as="link"
                to={localizedPath(
                  `/about/directions/edit?selected=${encodeParam(selectedDirection.en.name || selectedDirection.ko.name)}`,
                )}
                variant="outline"
                tone="neutral"
                size="md"
              >
                편집
              </Button>
            </LoginVisible>
          </div>
          <HTMLViewer html={selectedDirection[locale]?.description} />
        </div>
      )}
    </PageLayout>
  );
}
