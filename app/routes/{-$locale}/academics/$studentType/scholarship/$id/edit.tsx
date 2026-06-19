import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import ScholarshipEditor, {
  type ScholarshipFormData,
} from '@/routes/{-$locale}/academics/components/scholarship/ScholarshipEditor';
import type { Scholarship } from '@/types/api/v2/academics/scholarship';
import { fetchJson, fetchOk } from '@/utils/fetch';

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
      await fetchOk(`${BASE_URL}/v2/academics/scholarship`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ko: {
            ...loaderData.ko,
            name: content.koName,
            description: content.koDescription,
          },
          en: {
            ...loaderData.en,
            name: content.enName,
            description: content.enDescription,
          },
        }),
      });
      toast.success(t('장학금을 수정했습니다.'));
      navigate({ to: `/academics/${studentType}/scholarship/${id}` });
    } catch {
      toast.error(t('장학금을 수정하지 못했습니다.'));
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
  '/{-$locale}/academics/$studentType/scholarship/$id/edit',
)({
  loader: async ({ params }) => {
    const { id } = params;
    const res = await fetchJson<{ first: Scholarship; second: Scholarship }>(
      `${BASE_URL}/v2/academics/scholarship/${id}`,
    );
    const isFirstKo = res.first.language === 'ko';
    return isFirstKo
      ? { ko: res.first, en: res.second }
      : { ko: res.second, en: res.first };
  },
  component: ScholarshipEditPage,
});
