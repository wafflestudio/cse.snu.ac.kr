import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { useAcademicsSubNav } from '@/hooks/useSubNav';
import TimelineEditor, {
  type TimelineFormData,
} from '@/routes/$locale/academics/-components/timeline/TimelineEditor';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function GeneralStudiesCreatePage() {
  const { localizedPath, t } = useLanguage({
    '필수 교양 과목 추가': 'Add General Studies',
  });
  const subNav = useAcademicsSubNav();
  const navigate = useNavigate();

  const title = t('필수 교양 과목 추가');
  const onSubmit = async (data: TimelineFormData) => {
    const formData = new ApiFormData();
    formData.appendJson('request', {
      year: data.year,
      description: data.description,
      name: '', // TODO: 백엔드에서 name 필드 제거 필요
    });
    formData.appendIfLocal('attachments', data.file);

    try {
      await api.post(
        `v2/academics/undergraduate/general-studies-requirements`,
        { body: formData },
      );
      toast.success('추가에 성공했습니다.');
      navigate({
        to: localizedPath(
          '/academics/undergraduate/general-studies-requirements',
        ),
      });
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <TimelineEditor
        onSubmit={onSubmit}
        cancelPath="/academics/undergraduate/general-studies-requirements"
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/academics/undergraduate/general-studies-requirements/create',
)({
  component: GeneralStudiesCreatePage,
});
