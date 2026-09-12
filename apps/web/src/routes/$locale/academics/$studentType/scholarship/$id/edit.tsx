import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import ScholarshipEditor, {
  type ScholarshipFormData,
} from '@/routes/$locale/academics/-components/scholarship/ScholarshipEditor';
import type { ScholarshipPutBody, ScholarshipWithLanguage } from '@/types/api';
import { api } from '@/utils/api';

function ScholarshipEditPage() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType, id } = params;
  const { t } = useLanguage({
    '장학금을 수정했습니다.': 'Scholarship updated successfully.',
    '장학금을 수정하지 못했습니다.': 'Failed to update scholarship.',
    '학부 장학금 수정': 'Edit Undergraduate Scholarship',
    '대학원 장학금 수정': 'Edit Graduate Scholarship',
  });
  const navigate = useNavigate();

  const title =
    studentType === 'graduate'
      ? t('대학원 장학금 수정')
      : t('학부 장학금 수정');

  const onSubmit = async (content: ScholarshipFormData) => {
    try {
      // 요청 타입을 달아 둔다 — 백엔드 스키마가 바뀌면 여기서 컴파일이 막힌다.
      const request: ScholarshipPutBody = {
        ko: { name: content.koName, description: content.koDescription },
        en: { name: content.enName, description: content.enDescription },
      };
      await api.put(`v2/academics/scholarship/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      toast.success(t('장학금을 수정했습니다.'));
      navigate({ to: `/academics/${studentType}/scholarship/${id}` });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title={title} titleSize="xl">
      <ScholarshipEditor
        defaultValues={{
          koName: loaderData.ko.name,
          koDescription: loaderData.ko.description,
          enName: loaderData.en.name,
          enDescription: loaderData.en.description,
        }}
        cancelPath={`/academics/${studentType}/scholarship/${id}`}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/academics/$studentType/scholarship/$id/edit',
)({
  loader: async ({ params }) => {
    const { id } = params;
    const res = await api
      .get(`v2/academics/scholarship/${id}`)
      .json<ScholarshipWithLanguage>();
    if (!res.ko || !res.en) throw new Error('장학금 번역본이 없습니다.');
    return { ko: res.ko, en: res.en };
  },
  component: ScholarshipEditPage,
});
