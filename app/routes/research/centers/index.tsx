import type { Route } from '.react-router/types/app/routes/research/centers/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import Node from '~/components/common/Nodes';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useSelectionList } from '~/hooks/useSelectionList';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { ResearchCentersResponse } from '~/types/api/v2/research/centers';
import { getLocaleFromPathname } from '~/utils/string';
import LinkIcon from './assets/link_icon.svg?react';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const params = new URLSearchParams();
  params.append('language', locale);

  const response = await fetch(
    `${BASE_URL}/v2/research/centers?${params.toString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch research centers');

  return (await response.json()) as ResearchCentersResponse;
}

export default function ResearchCentersPage({
  loaderData: centers,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '연구 센터는 존재하지 않습니다.': 'Research center does not exist.',
  });
  const subNav = useResearchSubNav();

  const { selectedItem: selectedCenter, selectionItems } = useSelectionList({
    items: centers,
    getItem: (center) => ({ id: center.id, label: center.name }),
  });

  return (
    <PageLayout
      title={t('연구 센터')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        { name: t('연구 센터'), path: '/research/centers' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <div className="px-7 sm:pl-[100px] sm:pr-[320px]">
        <SelectionList items={selectionItems} />
      </div>
      {selectedCenter && (
        <div className="px-7 pb-9 sm:pb-[100px] sm:pl-[100px] sm:pr-[320px]">
          <ResearchCenterTitle
            name={selectedCenter.name}
            link={selectedCenter.websiteURL}
          />
          <div className="px-2.5">
            <HTMLViewer
              html={selectedCenter.description}
              image={
                selectedCenter.mainImageUrl && {
                  src: selectedCenter.mainImageUrl,
                  width: 320,
                  height: 200,
                  mobileFullWidth: true,
                }
              }
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}

function ResearchCenterTitle({ name, link }: { name: string; link: string }) {
  return (
    <div className="mb-5 sm:w-fit" key={name}>
      <h4 className="px-2.5 text-base font-bold leading-loose text-neutral-800 sm:text-[24px]">
        <a
          href={link}
          target="_blank"
          className="group flex cursor-pointer items-center gap-1"
          rel="noopener noreferrer"
        >
          <span className="text-base font-bold sm:text-[24px]">{name}</span>
          <LinkIcon className="mt-0.5 fill-neutral-500 group-hover:fill-main-orange" />
        </a>
      </h4>
      <div className="animate-stretch">
        <Node variant="straight" />
      </div>
    </div>
  );
}
