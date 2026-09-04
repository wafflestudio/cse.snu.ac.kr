import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { NewsPostBody } from '@/types/api';
import { isLocalFile } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import NewsEditor, { type NewsFormData } from './-components/NewsEditor';

function NewsCreatePage() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const onCancel = () => {
    navigate({ to: localizedPath('/community/news') });
  };

  const onSubmit = async (content: NewsFormData) => {
    const formData = new ApiFormData();

    const request: NewsPostBody = {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      date: content.date.toISOString(),
      isPrivate: content.isPrivate,
      isImportant: content.isImportant,
      importantUntil: content.importantUntil
        ? dayjs(content.importantUntil).format('YYYY-MM-DD')
        : null,
      isSlide: content.isSlide,
      tags: content.tags,
    };

    formData.appendJson('request', request);

    formData.appendIfLocal('mainImage', content.image);
    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      const { id } = await api
        .post('v2/news', { body: formData })
        .json<{ id: number }>();
      toast.success('새소식을 게시했습니다.');
      navigate({ to: `/community/news/${id}` });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="새소식 작성" titleSize="xl" padding="default">
      <NewsEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/news/create')({
  component: NewsCreatePage,
});
