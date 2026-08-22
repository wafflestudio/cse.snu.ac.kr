import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import ScholarshipEditor, {
  type ScholarshipFormData,
} from '@/routes/$locale/academics/components/scholarship/ScholarshipEditor';
import { fetchOk } from '@/utils/fetch';

function ScholarshipCreatePage() {
  const { studentType } = Route.useParams();
  const { t } = useLanguage({
    '장학금을 추가했습니다.': 'Scholarship created successfully.',
    '장학금을 추가하지 못했습니다.': 'Failed to create scholarship.',
    '학부 장학금 추가': 'Create Undergraduate Scholarship',
    '대학원 장학금 추가': 'Create Graduate Scholarship',
  });
  const navigate = useNavigate();

  const title =
    studentType === 'graduate'
      ? t('대학원 장학금 추가')
      : t('학부 장학금 추가');

  const onSubmit = async (content: ScholarshipFormData) => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/${studentType}/scholarship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      toast.success(t('장학금을 추가했습니다.'));
      navigate({ to: `/academics/${studentType}/scholarship` });
    } catch {
      toast.error(t('장학금을 추가하지 못했습니다.'));
    }
  };

  return (
    <PageLayout title={title} titleSize="xl">
      <ScholarshipEditor
        cancelPath={`/academics/${studentType}/scholarship`}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/academics/$studentType/scholarship/create',
)({
  component: ScholarshipCreatePage,
});
