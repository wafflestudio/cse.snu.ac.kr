import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import SelectionList from '@/components/feature/selection/SelectionList';
import SelectionTitle from '@/components/feature/selection/SelectionTitle';
import PageLayout from '@/components/layout/PageLayout';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { useSelectionList } from '@/hooks/useSelectionList';
import { useResearchSubNav } from '@/hooks/useSubNav';
import { prepareHtmlForViewer } from '@/serverFns/prepareHtmlForViewer';
import type { ResearchCentersResponse } from '@/types/api';
import { api } from '@/utils/api';
import { stringParam } from '@/utils/searchSchema';

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
      await api.delete(`v2/research/${selectedCenter.id}`);

      toast.success('연구 센터를 삭제했습니다.');
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout
      title={t('연구 센터')}
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
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

      {selectedCenter && (
        <div>
          <SelectionTitle
            title={selectedCenter.name}
            href={selectedCenter.websiteURL || undefined}
            actions={
              <LoginVisible allow="ROLE_STAFF">
                <div className="flex gap-3">
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
            }
          />
          <div className="px-3">
            <HTMLViewer
              html={selectedCenter.description}
              image={
                selectedCenter.mainImageUrl && {
                  src: selectedCenter.mainImageUrl,
                  width: 320,
                  height: 200,
                }
              }
            />
          </div>
        </div>
      )}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={`‘${selectedCenter?.name}’ 연구 센터를 삭제하시겠습니까?\n되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/research/centers/')({
  validateSearch: (search: Record<string, unknown>) => ({
    selected: stringParam(search.selected),
  }),
  loader: async ({ params }) => {
    const locale = params.locale === 'en' ? 'en' : 'ko';
    const query = new URLSearchParams();
    query.append('language', locale);

    const data = await api
      .get(`v2/research/centers?${query.toString()}`)
      .json<ResearchCentersResponse>();

    return Promise.all(
      data.map(async (center) => ({
        ...center,
        description: await prepareHtmlForViewer({ data: center.description }),
      })),
    );
  },
  component: ResearchCentersPage,
});
