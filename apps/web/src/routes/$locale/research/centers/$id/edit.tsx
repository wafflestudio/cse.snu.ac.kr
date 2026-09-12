import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchPutBody, ResearchWithLanguage } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import ResearchCenterEditor, {
  type ResearchCenterFormData,
} from '../-components/ResearchCenterEditor';

function ResearchCenterEdit() {
  const loaderData = Route.useLoaderData();

  const research = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const defaultValues: ResearchCenterFormData = {
    ko: {
      name: research.ko?.name ?? '',
      description: research.ko?.description ?? '',
    },
    en: {
      name: research.en?.name ?? '',
      description: research.en?.description ?? '',
    },
    websiteURL: research.websiteURL ?? '',
    image: research.mainImageUrl
      ? { type: 'UPLOADED_IMAGE', url: research.mainImageUrl }
      : null,
  };

  const onCancel = () => {
    navigate({ to: localizedPath('/research/centers') });
  };

  const onSubmit = async (formData: ResearchCenterFormData) => {
    const data = new ApiFormData();

    const removeImage = defaultValues.image !== null && formData.image === null;

    const request: ResearchPutBody = {
      websiteURL: formData.websiteURL,
      removeImage,
      ko: formData.ko,
      en: formData.en,
    };
    data.appendJson('request', request);
    data.appendIfLocal('newMainImage', formData.image);

    try {
      await api.put(`v2/research/${research.id}`, { body: data });

      toast.success('연구 센터를 수정했습니다.');
      navigate({ to: localizedPath('/research/centers') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="연구 센터 편집" titleSize="xl" padding="default">
      <ResearchCenterEditor
        defaultValues={defaultValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/research/centers/$id/edit')({
  loader: async ({ params }) => {
    const id = params.id;

    const data = await api
      .get(`v2/research/${id}`)
      .json<ResearchWithLanguage>();

    return data;
  },
  component: ResearchCenterEdit,
});
