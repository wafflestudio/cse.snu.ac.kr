import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import { toastError } from '@/components/ui/sonner';
import type { TagSuggestion } from '@/types/api';
import type { EditorFile } from '@/types/form';
import { api } from '@/utils/api';
import { NOTICE_TAGS } from '../-constants';

export interface NoticeFormData {
  title: string;
  titleForMain: string;
  description: string;
  attachments: EditorFile[];
  tags: string[];
  isPrivate: boolean;
  isPinned: boolean;
  pinnedUntil: Date | null;
  hasPinnedUntilDeadline: boolean;
  isImportant: boolean;
  importantUntil: Date | null;
  hasImportantUntilDeadline: boolean;
}

interface Props {
  defaultValues?: NoticeFormData;
  onCancel: () => void;
  onSubmit: (formData: NoticeFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function NoticeEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: Props) {
  const formMethods = useForm<NoticeFormData>({
    defaultValues: defaultValues ?? {
      title: '',
      titleForMain: '',
      description: '',
      attachments: [],
      tags: [],
      isPrivate: false,
      isPinned: false,
      pinnedUntil: null,
      isImportant: false,
      importantUntil: null,
    },
    shouldFocusError: false,
  });
  const { handleSubmit, setValue, getValues } = formMethods;
  const [suggestion, setSuggestion] = useState<TagSuggestion[] | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // 제안은 후보만 체크해줄 뿐 기존 선택을 지우지 않는다 — 사람이 이미 고른 걸 모델이 덮으면 안 된다.
  const suggestTags = async () => {
    const { title, description, tags } = getValues();
    setIsSuggesting(true);
    try {
      const suggested = await api
        .post('v2/notice/tag-suggestion', { json: { title, description } })
        .json<TagSuggestion[]>();
      setSuggestion(suggested);
      setValue('tags', [...new Set([...tags, ...suggested.map((s) => s.tag)])]);
    } catch (error) {
      toastError(error);
    } finally {
      setIsSuggesting(false);
    }
  };
  const [isPinned, pinnedUntil, isImportant, importantUntil] = useWatch({
    name: ['isPinned', 'pinnedUntil', 'isImportant', 'importantUntil'],
    control: formMethods.control,
  });

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset
          title="제목"
          spacing="8"
          titleSpacing="2"
          required
          errorName="title"
        >
          <Form.Text
            name="title"
            placeholder="제목을 입력하세요."
            options={{
              required: { value: true, message: '제목을 입력해주세요.' },
            }}
          />
        </Fieldset>
        <Fieldset title="메인-중요 안내용 제목" spacing="8" titleSpacing="2">
          <Form.Text
            name="titleForMain"
            placeholder="미입력시 제목과 동일하게 표시됩니다."
          />
        </Fieldset>
        <Fieldset.HTML errorName="description">
          <Form.HTML
            name="description"
            options={{
              required: { value: true, message: '내용을 입력해주세요.' },
            }}
          />
        </Fieldset.HTML>
        <Fieldset.File>
          <Form.File name="attachments" />
        </Fieldset.File>
        <Fieldset title="태그" spacing="8" titleSpacing="3">
          <div className="flex grow flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <button
                type="button"
                className="h-8 shrink-0 rounded-sm border border-neutral-300 px-[.62rem] text-xs hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={suggestTags}
                disabled={isSuggesting}
              >
                {isSuggesting ? '제안받는 중…' : '태그 제안받기'}
              </button>
              {suggestion && (
                <p className="text-xs font-normal tracking-wide text-neutral-700">
                  {suggestion.length
                    ? `제목·본문 기준 ${suggestion
                        .map((s) => `${s.tag}(${s.confidence.toFixed(2)})`)
                        .join(' · ')}`
                    : '추천할 태그를 찾지 못했습니다. 직접 골라주세요.'}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2.5">
              {NOTICE_TAGS.map((tag) => (
                <Form.Checkbox key={tag} value={tag} name="tags" />
              ))}
            </div>
          </div>
        </Fieldset>
        <Fieldset title="게시 설정" spacing="6" titleSpacing="3">
          <div className="flex flex-col gap-2">
            <Form.Checkbox
              label="비공개 글"
              name="isPrivate"
              onChange={(isPrivate) => {
                if (isPrivate) {
                  setValue('isPinned', false);
                  setValue('isImportant', false);
                }
              }}
            />
            <Form.Checkbox
              label="목록 상단에 고정"
              name="isPinned"
              onChange={(isPinned) => {
                if (isPinned) setValue('isPrivate', false);
                setValue('pinnedUntil', null);
                setValue('hasPinnedUntilDeadline', false);
              }}
            />
            {isPinned && (
              <div className="ml-6 flex flex-col gap-2">
                <Form.Checkbox
                  label="만료일 설정"
                  name="hasPinnedUntilDeadline"
                  onChange={(checked) => {
                    if (checked) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(0, 0, 0, 0);
                      setValue('pinnedUntil', tomorrow);
                    } else {
                      setValue('pinnedUntil', null);
                    }
                  }}
                />
                {pinnedUntil && (
                  <div className="ml-6">
                    <Form.Date name="pinnedUntil" hideTime disablePast />
                  </div>
                )}
                <p className="text-xs font-normal tracking-wide text-neutral-700">
                  * 만료일 설정 시 해당 날짜까지만 상단에 고정됩니다.
                </p>
              </div>
            )}
            <Form.Checkbox
              label="메인-중요 안내에 표시"
              name="isImportant"
              onChange={(isImportant) => {
                if (isImportant) setValue('isPrivate', false);
                setValue('importantUntil', null);
                setValue('hasImportantUntilDeadline', false);
              }}
            />
            {isImportant && (
              <div className="ml-6 flex flex-col gap-2">
                <Form.Checkbox
                  label="만료일 설정"
                  name="hasImportantUntilDeadline"
                  onChange={(checked) => {
                    if (checked) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(0, 0, 0, 0);
                      setValue('importantUntil', tomorrow);
                    } else {
                      setValue('importantUntil', null);
                    }
                  }}
                />
                {importantUntil && (
                  <div className="ml-6">
                    <Form.Date name="importantUntil" hideTime disablePast />
                  </div>
                )}
                <p className="text-xs font-normal tracking-wide text-neutral-700">
                  * 만료일 설정 시 해당 날짜까지만 중요 안내로 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </Fieldset>
        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="게시하기"
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}
