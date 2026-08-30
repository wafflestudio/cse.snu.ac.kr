import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchGroup } from '@/types/api/v2/research/groups';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import ResearchGroupEditor, {
  type ResearchGroupFormData,
} from '../-components/ResearchGroupEditor';

interface ResearchGroupData {
  ko: ResearchGroup;
  en: ResearchGroup;
}

function ResearchGroupEdit() {
  const loaderData = Route.useLoaderData();

  const { ko, en } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const defaultValues: ResearchGroupFormData = {
    ko: { name: ko.name, description: ko.description, type: 'groups' },
    en: { name: en.name, description: en.description, type: 'groups' },
    image: ko.mainImageUrl
      ? { type: 'UPLOADED_IMAGE', url: ko.mainImageUrl }
      : null,
  };

  const onCancel = () => {
    navigate({ to: localizedPath('/research/groups') });
  };

  const onSubmit = async (formData: ResearchGroupFormData) => {
    const data = new ApiFormData();

    const removeImage = defaultValues.image !== null && formData.image === null;

    data.appendJson('request', {
      ko: { ...formData.ko, removeImage },
      en: { ...formData.en, removeImage },
    });
    data.appendIfLocal('newMainImage', formData.image);

    try {
      await api.put(`v2/research/${ko.id}/${en.id}`, { body: data });

      toast.success('연구 스트림을 수정했습니다.');
      navigate({ to: localizedPath('/research/groups') });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구 스트림 편집" titleSize="xl" padding="default">
      <ResearchGroupEditor
        defaultValues={defaultValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/research/groups/$id/edit')({
  loader: async ({ params }) => {
    const id = params.id;

    const data = await api.get(`v2/research/${id}`).json<ResearchGroupData>();

    return data;
  },
  component: ResearchGroupEdit,
});
