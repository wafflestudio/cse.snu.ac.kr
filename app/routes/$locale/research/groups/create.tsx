import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchOk } from '@/utils/fetch';
import { FormData2 } from '@/utils/form';
import ResearchGroupEditor, {
  type ResearchGroupFormData,
} from './components/ResearchGroupEditor';

function ResearchGroupCreate() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const onCancel = () => {
    navigate({ to: localizedPath('/research/groups') });
  };

  const onSubmit = async ({ ko, en, image }: ResearchGroupFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', { ko, en });
    formData.appendIfLocal('newMainImage', image);

    try {
      await fetchOk(`${BASE_URL}/v2/research`, {
        method: 'POST',
        body: formData,
      });

      toast.success('연구 스트림을 추가했습니다.');
      navigate({ to: localizedPath('/research/groups') });
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구 스트림 추가" titleSize="xl" padding="default">
      <ResearchGroupEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/research/groups/create')({
  component: ResearchGroupCreate,
});
