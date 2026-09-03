import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { Seminar, SeminarPatchBody } from '@/types/api';
import { isLocalFile } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData, getAttachmentIds } from '@/utils/apiFormData';
import SeminarEditor, {
  type SeminarFormData,
} from './-components/SeminarEditor';

function SeminarEditPage() {
  const loaderData = Route.useLoaderData();

  const { id, data } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const defaultValues: SeminarFormData = {
    title: data.title,
    titleForMain: data.titleForMain ?? '',
    description: data.description ?? '',
    location: data.location,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
    host: data.host ?? '',
    name: data.name ?? '',
    speakerURL: data.speakerURL ?? '',
    speakerTitle: data.speakerTitle ?? '',
    affiliation: data.affiliation ?? '',
    affiliationURL: data.affiliationURL ?? '',
    introduction: data.introduction ?? '',
    image: data.imageURL
      ? { type: 'UPLOADED_IMAGE', url: data.imageURL }
      : null,
    attachments: (data.attachments ?? []).map((file) => ({
      type: 'UPLOADED_FILE',
      file,
    })),
    isPrivate: data.isPrivate,
    isImportant: data.isImportant,
    isEndDateVisible: data.endDate !== null,
  };

  const onCancel = () => {
    navigate({ to: localizedPath(`/community/seminar/${id}`) });
  };

  const onSubmit = async (content: SeminarFormData) => {
    const formData = new ApiFormData();

    const request: SeminarPatchBody = {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      location: content.location,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate ? content.endDate.toISOString() : null,
      host: content.host || null,
      name: content.name,
      speakerURL: content.speakerURL || null,
      speakerTitle: content.speakerTitle || null,
      affiliation: content.affiliation,
      affiliationURL: content.affiliationURL || null,
      introduction: content.introduction,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
      attachmentIds: getAttachmentIds(content.attachments),
      removeImage: defaultValues.image !== null && content.image === null,
    };

    formData.appendJson('request', request);

    formData.appendIfLocal('newMainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await api.patch(`v2/seminar/${id}`, { body: formData });

      toast.success('세미나를 수정했습니다.');
      navigate({ to: localizedPath(`/community/seminar/${id}`) });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/seminar/${id}`);

      toast.success('세미나를 삭제했습니다.');
      navigate({ to: localizedPath('/community/seminar') });
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="세미나 편집" titleSize="xl" padding="default">
      <SeminarEditor
        onCancel={onCancel}
        onSubmit={onSubmit}
        onDelete={onDelete}
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/seminar/edit/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id);
    const data = await api.get(`v2/seminar/${id}`).json<Seminar>();
    return { id, data };
  },
  component: SeminarEditPage,
});
