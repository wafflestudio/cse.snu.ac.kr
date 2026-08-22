import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import SelectionList from '@/components/feature/selection/SelectionList';
import PageLayout from '@/components/layout/PageLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import Node from '@/components/ui/Nodes';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelectionList } from '@/hooks/useSelectionList';
import { useResearchSubNav } from '@/hooks/useSubNav';
import type { ResearchCentersResponse } from '@/types/api/v2/research/centers';
import { processHtmlForCsp } from '@/utils/cspServerFn';
import { fetchJson, fetchOk } from '@/utils/fetch';
import LinkIcon from './assets/link_icon.svg?react';

const META = {
  ko: {
    title: '연구 센터',
    description:
      '서울대학교 컴퓨터공학부의 연구 센터를 소개합니다. 다양한 연구 분야의 전문 센터와 그 활동 내용을 확인하실 수 있습니다.',
  },
  en: {
    title: 'Research Centers',
    description:
      'Research centers of the Department of Computer Science and Engineering at Seoul National University. Explore specialized centers and their research activities.',
  },
};

function ResearchCentersPage() {
  const centers = Route.useLoaderData();

  const { t, localizedPath, locale } = useLanguage({
    '연구 센터는 존재하지 않습니다.': 'Research center does not exist.',
  });
  const subNav = useResearchSubNav();
  const meta = META[locale];
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const { selectedItem: selectedCenter, selectionItems } = useSelectionList({
    items: centers,
    getItem: (center) => ({ id: center.id, label: center.name }),
  });

  const handleDelete = async () => {
    if (!selectedCenter) return;

    try {
      // 상세 정보를 가져와서 ko, en ID를 얻음
      const data = await fetchJson<{ ko: { id: number }; en: { id: number } }>(
        `${BASE_URL}/v2/research/${selectedCenter.id}`,
      );

      await fetchOk(`/api/v2/research/${data.ko.id}/${data.en.id}`, {
        method: 'DELETE',
      });

      toast.success('연구 센터를 삭제했습니다.');
      router.invalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('연구 센터')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <div className="page-gutter-x">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mt-11 text-right">
            <Button
              as="link"
              to={localizedPath('/research/centers/create')}
              variant="primary"
              size="md"
            >
              연구 센터 추가
            </Button>
          </div>
        </LoginVisible>
        <SelectionList items={selectionItems} />
      </div>
      {selectedCenter && (
        <div className="page-gutter-x pb-9 sm:pb-[100px]">
          <LoginVisible allow="ROLE_STAFF">
            <div className="mb-7 flex justify-end gap-3">
              <Button
                as="button"
                onClick={() => setShowDeleteDialog(true)}
                variant="secondary"
                size="md"
              >
                삭제
              </Button>
              <Button
                as="link"
                to={localizedPath(
                  `/research/centers/${selectedCenter.id}/edit`,
                )}
                variant="secondary"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
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
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="이 연구 센터를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
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

export const Route = createFileRoute('/$locale/research/centers/')({
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const query = new URLSearchParams();
    query.append('language', locale);

    const response = await fetch(
      `${BASE_URL}/v2/research/centers?${query.toString()}`,
    );
    if (!response.ok) throw new Error('Failed to fetch research centers');

    const data = (await response.json()) as ResearchCentersResponse;

    return Promise.all(
      data.map(async (center) => ({
        ...center,
        description: await processHtmlForCsp(center.description),
      })),
    );
  },
  component: ResearchCentersPage,
});
