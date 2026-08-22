import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import type { Notice } from '@/types/api/v2/notice';
import { isLocalFile } from '@/types/form';
import { fetchJson, fetchOk } from '@/utils/fetch';
import { FormData2, getDeleteIds } from '@/utils/form';
import { forwardAuthHeaders } from '@/utils/ssr';
import NoticeEditor, { type NoticeFormData } from './components/NoticeEditor';

dayjs.extend(customParseFormat);

function NoticeEditPage() {
  const loaderData = Route.useLoaderData();

  const { id, data } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const defaultValues: NoticeFormData = {
    title: data.title,
    titleForMain: data.titleForMain ?? '',
    description: data.description,
    attachments: data.attachments.map((file) => ({
      type: 'UPLOADED_FILE',
      file,
    })),
    tags: data.tags,
    isPrivate: data.isPrivate,
    isPinned: data.isPinned,
    pinnedUntil: data.pinnedUntil
      ? dayjs(data.pinnedUntil, 'YYYY-MM-DD').toDate()
      : null,
    hasPinnedUntilDeadline: data.pinnedUntil !== null,
    isImportant: data.isImportant,
    importantUntil: data.importantUntil
      ? dayjs(data.importantUntil, 'YYYY-MM-DD').toDate()
      : null,
    hasImportantUntilDeadline: data.importantUntil !== null,
  };

  const onCancel = () => {
    navigate({ to: `/community/notice/${id}` });
  };

  const onSubmit = async (content: NoticeFormData) => {
    const deleteIds = getDeleteIds({
      prev: defaultValues.attachments,
      cur: content.attachments,
    });

    const formData = new FormData2();

    formData.appendJson('request', {
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
      deleteIds,
    });

    formData.appendIfLocal(
      'newAttachments',
      content.attachments.filter(isLocalFile),
    );

    try {
      await fetchOk(`${BASE_URL}/v2/notice/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      toast.success('공지사항을 수정했습니다.');
      navigate({ to: `/community/notice/${id}` });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/notice/${id}`, {
        method: 'DELETE',
      });

      toast.success('공지사항을 삭제했습니다.');
      navigate({ to: localizedPath('/community/notice') });
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="공지사항 편집" titleSize="xl" padding="default">
      <NoticeEditor
        onCancel={onCancel}
        onSubmit={onSubmit}
        onDelete={onDelete}
        defaultValues={defaultValues}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/community/notice/edit/$id')({
  loader: async ({ params }) => {
    const id = Number(params.id);

    const data = await fetchJson<Notice>(`${BASE_URL}/v2/notice/${id}`, {
      headers: forwardAuthHeaders(),
    });

    return { id, data };
  },
  component: NoticeEditPage,
});
