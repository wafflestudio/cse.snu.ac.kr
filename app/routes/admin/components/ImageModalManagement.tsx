import { useRouter } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import { toast } from '~/components/ui/sonner';
import type { ImageModal } from '~/types/api/v2/admin';
import type { EditorImage } from '~/types/form';
import { fetchOk } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

interface ImageModalManagementProps {
  modal: ImageModal | null;
}

interface FormValues {
  displayUntil: string; // datetime-local format
  externalLink: string;
  image: EditorImage;
}

// "2026-05-01T07:00:00Z" -> "2026-05-01T16:00" (로컬 timezone)
const isoToInputLocal = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const inputLocalToIso = (s: string): string | null => {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const blankToNull = (s: string) => (s.trim() === '' ? null : s);

export default function ImageModalManagement({
  modal,
}: ImageModalManagementProps) {
  const router = useRouter();
  const isEditing = modal !== null;

  const defaultValues: FormValues = {
    displayUntil: isoToInputLocal(modal?.displayUntil ?? null),
    externalLink: modal?.externalLink ?? '',
    image: modal ? { type: 'UPLOADED_IMAGE', url: modal.imageUrl } : null,
  };

  const methods = useForm<FormValues>({
    defaultValues,
    shouldFocusError: false,
  });

  const onCancel = () => {
    methods.reset(defaultValues);
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    const request = {
      titleKo: modal?.titleKo ?? null,
      titleEn: modal?.titleEn ?? null,
      imageAltKo: modal?.imageAltKo ?? null,
      imageAltEn: modal?.imageAltEn ?? null,
      displayUntil: inputLocalToIso(values.displayUntil),
      externalLink: blankToNull(values.externalLink),
    };

    const formData = new FormData2();
    formData.appendJson('request', request);

    try {
      if (isEditing) {
        if (values.image && values.image.type === 'LOCAL_IMAGE') {
          formData.append('newMainImage', values.image.file);
        }
        await fetchOk(`/api/v2/image-modal/${modal.id}`, {
          method: 'PATCH',
          body: formData,
        });
        toast.success('이미지 팝업을 수정했습니다.');
      } else {
        if (!values.image || values.image.type !== 'LOCAL_IMAGE') {
          toast.error('이미지를 등록해주세요.');
          return;
        }
        formData.append('mainImage', values.image.file);
        await fetchOk(`/api/v2/image-modal`, {
          method: 'POST',
          body: formData,
        });
        toast.success('이미지 팝업을 등록했습니다.');
      }
      router.invalidate();
    } catch {
      toast.error(isEditing ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    }
  });

  const onDelete = async () => {
    if (!isEditing) return;
    try {
      await fetchOk(`/api/v2/image-modal/${modal.id}`, { method: 'DELETE' });
      toast.success('이미지 팝업을 삭제했습니다.');
      router.invalidate();
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <FormProvider {...methods}>
      <Form>
        <Fieldset title="표시 종료일" spacing="6">
          <input
            type="datetime-local"
            {...methods.register('displayUntil')}
            className="h-8 w-fit rounded-xs border border-neutral-300 bg-white px-2 text-sm outline-none"
          />
          <span className="mt-1 text-xs text-neutral-500">
            비워두면 종료일 없이 계속 표시됩니다.
          </span>
        </Fieldset>

        <Fieldset title="외부 링크" spacing="6">
          <Form.Text
            name="externalLink"
            placeholder="https:// (입력 시 '자세히 보기' 버튼이 노출됩니다)"
          />
        </Fieldset>

        <Fieldset.Image>
          <Form.Image name="image" />
        </Fieldset.Image>

        <Form.Action
          onCancel={onCancel}
          onSubmit={onSubmit}
          onDelete={isEditing ? onDelete : undefined}
          submitLabel={isEditing ? '저장하기' : '등록하기'}
        />
      </Form>
    </FormProvider>
  );
}
