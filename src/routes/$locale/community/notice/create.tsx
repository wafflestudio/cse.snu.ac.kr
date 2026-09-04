import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { NoticePostBody } from '@/types/api';
import { isLocalFile } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import NoticeEditor, { type NoticeFormData } from './-components/NoticeEditor';

function NoticeCreatePage() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const onCancel = () => {
    navigate({ to: localizedPath('/community/notice') });
  };

  const onSubmit = async (content: NoticeFormData) => {
    const formData = new ApiFormData();

    const request: NoticePostBody = {
      title: content.title,
      titleForMain: content.titleForMain || null,
      description: content.description,
      isPrivate: content.isPrivate,
      isPinned: content.isPinned,
      pinnedUntil: content.pinnedUntil
        ? dayjs(content.pinnedUntil).format('YYYY-MM-DD')
        : null,
      isImportant: content.isImportant,
      importantUntil: content.importantUntil
        ? dayjs(content.importantUntil).format('YYYY-MM-DD')
        : null,
      tags: content.tags,
    };

    formData.appendJson('request', request);

    formData.appendIfLocal(
      'attachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      const { id } = await api
        .post('v2/notice', { body: formData })
        .json<{ id: number }>();
      toast.success('공지사항을 게시했습니다.');
      navigate({ to: `/community/notice/${id}` });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="공지사항 작성" titleSize="xl" padding="default">
      <NoticeEditor onCancel={onCancel} onSubmit={onSubmit} />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/notice/create')({
  component: NoticeCreatePage,
});
