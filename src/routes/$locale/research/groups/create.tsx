import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchPostBody } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import ResearchGroupEditor, {
  type ResearchGroupFormData,
} from './-components/ResearchGroupEditor';

function ResearchGroupCreate() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const onCancel = () => {
    navigate({ to: localizedPath('/research/groups') });
  };

  const onSubmit = async ({ ko, en, image }: ResearchGroupFormData) => {
    const formData = new ApiFormData();

    const request: ResearchPostBody = {
      type: 'groups',
      ko,
      en,
    };
    formData.appendJson('request', request);
    formData.appendIfLocal('newMainImage', image);

    try {
      await api.post(`v2/research`, { body: formData });

      toast.success('연구 스트림을 추가했습니다.');
      navigate({ to: localizedPath('/research/groups') });
    } catch (error) {
      toastError(error);
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
