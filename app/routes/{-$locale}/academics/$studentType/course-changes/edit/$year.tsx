import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import TimelineEditor, {
  type TimelineFormData,
} from '@/routes/{-$locale}/academics/components/timeline/TimelineEditor';
import type { TimelineContent } from '@/types/api/v2/academics';
import { fetchJson, fetchOk } from '@/utils/fetch';
import { FormData2, getDeleteIds } from '@/utils/form';

function CourseChangesEditPage() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType, year } = params;
  const { t } = useLanguage({
    '학부 교과목 변경 내역 편집': 'Edit Undergraduate Course Changes',
    '대학원 교과목 변경 내역 편집': 'Edit Graduate Course Changes',
    '수정에 성공했습니다.': 'Successfully updated.',
    '수정에 실패했습니다.': 'Failed to update.',
  });
  const navigate = useNavigate();

  const title =
    studentType === 'graduate'
      ? t('대학원 교과목 변경 내역 편집')
      : t('학부 교과목 변경 내역 편집');

  const defaultValues: TimelineFormData = {
    year: loaderData.year,
    description: loaderData.description,
    file: loaderData.attachments.map((file: any) => ({
      type: 'UPLOADED_FILE' as const,
      file,
    })),
  };

  const onSubmit = async (data: TimelineFormData) => {
    const deleteIds = getDeleteIds({
      prev: defaultValues.file,
      cur: data.file,
    });

    const formData = new FormData2();
    formData.appendJson('request', {
      description: data.description,
      deleteIds,
    });
    formData.appendIfLocal('newAttachments', data.file);

    try {
      await fetchOk(
        `${BASE_URL}/v2/academics/${studentType}/course-changes/${year}`,
        {
          method: 'PUT',
          body: formData,
        },
      );
      toast.success(t('수정에 성공했습니다.'));
      navigate({ to: `/academics/${studentType}/course-changes` });
    } catch {
      toast.error(t('수정에 실패했습니다.'));
    }
  };

  return (
    <PageLayout title={title} titleSize="xl">
      <TimelineEditor
        cancelPath={`/academics/${studentType}/course-changes`}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/{-$locale}/academics/$studentType/course-changes/edit/$year',
)({
  loader: async ({ params }) => {
    const { studentType, year } = params;
    const data = await fetchJson<TimelineContent[]>(
      `${BASE_URL}/v2/academics/${studentType}/course-changes`,
    );
    const yearNum = Number(year);
    const selected = data.find((x) => x.year === yearNum);

    if (!selected) {
      throw new Response('해당 연도 내용이 존재하지 않습니다.', {
        status: 404,
      });
    }

    return selected;
  },
  component: CourseChangesEditPage,
});
