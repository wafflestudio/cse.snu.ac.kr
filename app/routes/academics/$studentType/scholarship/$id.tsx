import type { Route } from '.react-router/types/app/routes/academics/$studentType/scholarship/+types/$id';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AlertDialog from '~/components/common/AlertDialog';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { StudentType } from '~/types/api/v2/academics';
import type { ScholarshipWithLanguage } from '~/types/api/v2/academics/scholarship';
import { fetchJson, fetchOk } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const res = await fetchJson<{ first: any; second: any }>(
    `${BASE_URL}/v2/academics/scholarship/${id}`,
  );
  const isFirstKo = res.first.language === 'ko';
  return isFirstKo
    ? { ko: res.first, en: res.second }
    : { ko: res.second, en: res.first };
}

export default function ScholarshipDetailPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType, id } = params;
  const { locale, t } = useLanguage({
    '장학금을 삭제했습니다.': 'Scholarship deleted successfully.',
    '장학금을 삭제하지 못했습니다.': 'Failed to delete scholarship.',
  });
  const navigate = useNavigate();
  const subNav = useAcademicsSubNav();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const scholarship = loaderData[locale];
  const name = scholarship.name;
  // 타이틀이 긴 경우 괄호 내부 내용을 제거
  const shortTitle = name.length > 20 ? name.replace(/\([^)]*\)/g, '') : name;

  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: studentLabel },
    { path: `/academics/${studentType}/scholarship`, name: t('장학 제도') },
    { path: `/academics/${studentType}/scholarship/${id}`, name: shortTitle },
  ];

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/scholarship/${id}`, {
        method: 'DELETE',
      });
      toast.success(t('장학금을 삭제했습니다.'));
      navigate(`/academics/${studentType}/scholarship`);
    } catch {
      toast.error(t('장학금을 삭제하지 못했습니다.'));
    }
  };

  return (
    <PageLayout
      title={shortTitle}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 flex justify-end gap-3">
          <Button
            variant="outline"
            tone="neutral"
            onClick={() => setShowDeleteDialog(true)}
          >
            삭제
          </Button>
          <Button variant="outline" tone="neutral" as="link" to="edit">
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={scholarship.description} />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="장학금을 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
