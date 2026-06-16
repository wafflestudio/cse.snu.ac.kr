import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '~/components/layout/PageLayout';
import { toast } from '~/components/ui/sonner';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import TimelineEditor, {
  type TimelineFormData,
} from '~/routes/{-$locale}/academics/components/timeline/TimelineEditor';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

function CourseChangesCreatePage() {
  const { studentType } = Route.useParams();
  const { t } = useLanguage({
    '학부 교과목 변경 내역 추가': 'Add Undergraduate Course Changes',
    '대학원 교과목 변경 내역 추가': 'Add Graduate Course Changes',
    '저장에 성공했습니다.': 'Successfully saved.',
    '저장에 실패했습니다.': 'Failed to save.',
  });
  const navigate = useNavigate();

  const title =
    studentType === 'graduate'
      ? t('대학원 교과목 변경 내역 추가')
      : t('학부 교과목 변경 내역 추가');

  const onSubmit = async (data: TimelineFormData) => {
    const formData = new FormData2();
    formData.appendJson('request', {
      name: '',
      year: data.year,
      description: data.description,
    });
    formData.appendIfLocal('attachments', data.file);

    try {
      await fetchOk(`${BASE_URL}/v2/academics/${studentType}/course-changes`, {
        method: 'POST',
        body: formData,
      });
      toast.success(t('저장에 성공했습니다.'));
      navigate({ to: `/academics/${studentType}/course-changes` });
    } catch {
      toast.error(t('저장에 실패했습니다.'));
    }
  };

  return (
    <PageLayout title={title} titleSize="xl">
      <TimelineEditor
        cancelPath={`/academics/${studentType}/course-changes`}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/{-$locale}/academics/$studentType/course-changes/create',
)({
  component: CourseChangesCreatePage,
});
