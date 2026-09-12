import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { SeminarPostBody } from '@/types/api';
import { isLocalFile } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import SeminarEditor, {
  type SeminarFormData,
} from './-components/SeminarEditor';

function SeminarCreatePage() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const onCancel = () => {
    navigate({ to: localizedPath('/community/seminar') });
  };

  const onSubmit = async (content: SeminarFormData) => {
    const formData = new ApiFormData();

    const request: SeminarPostBody = {
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
    };

    formData.appendJson('request', request);

    formData.appendIfLocal('mainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await api.post('v2/seminar', { body: formData });

      toast.success('세미나를 게시했습니다.');
      navigate({ to: localizedPath('/community/seminar') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="세미나 작성" titleSize="xl" padding="default">
      <SeminarEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/seminar/create')({
  component: SeminarCreatePage,
});
