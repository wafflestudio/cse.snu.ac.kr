import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchPutBody, ResearchWithLanguage } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import ResearchGroupEditor, {
  type ResearchGroupFormData,
} from '../-components/ResearchGroupEditor';

function ResearchGroupEdit() {
  const loaderData = Route.useLoaderData();

  const research = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const defaultValues: ResearchGroupFormData = {
    ko: {
      name: research.ko?.name ?? '',
      description: research.ko?.description ?? '',
    },
    en: {
      name: research.en?.name ?? '',
      description: research.en?.description ?? '',
    },
    image: research.mainImageUrl
      ? { type: 'UPLOADED_IMAGE', url: research.mainImageUrl }
      : null,
  };

  const onCancel = () => {
    navigate({ to: localizedPath('/research/groups') });
  };

  const onSubmit = async (formData: ResearchGroupFormData) => {
    const data = new ApiFormData();

    const removeImage = defaultValues.image !== null && formData.image === null;

    const request: ResearchPutBody = {
      removeImage,
      ko: formData.ko,
      en: formData.en,
    };
    data.appendJson('request', request);
    data.appendIfLocal('newMainImage', formData.image);

    try {
      await api.put(`v2/research/${research.id}`, { body: data });

      toast.success('연구 스트림을 수정했습니다.');
      navigate({ to: localizedPath('/research/groups') });
    } catch (error) {
      toastError(error);
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

    const data = await api
      .get(`v2/research/${id}`)
      .json<ResearchWithLanguage>();

    return data;
  },
  component: ResearchGroupEdit,
});
