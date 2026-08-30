import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
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

    formData.appendJson('request', {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description || null,
      location: content.location,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate ? content.endDate.toISOString() : null,
      host: content.host || null,
      name: content.name || null,
      speakerURL: content.speakerURL || null,
      speakerTitle: content.speakerTitle || null,
      affiliation: content.affiliation || null,
      affiliationURL: content.affiliationURL || null,
      introduction: content.introduction || null,
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
    });

    formData.appendIfLocal('mainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await api.post('v2/seminar', { body: formData });

      toast.success('세미나를 게시했습니다.');
      navigate({ to: localizedPath('/community/seminar') });
    } catch {
      toast.error('게시에 실패했습니다.');
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
