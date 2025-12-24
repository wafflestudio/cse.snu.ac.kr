import { FormProvider, useForm } from 'react-hook-form';

import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import { NEWS_TAGS } from '~/constants/tag';
import type { EditorFile, EditorImage } from '~/types/form';

export interface NewsFormData {
  title: string;
  titleForMain: string;
  description: string;
  date: Date;
  image: EditorImage | null;
  attachments: EditorFile[];
  tags: string[];
  isPrivate: boolean;
  isImportant: boolean;
  isSlide: boolean;
}

interface Props {
  defaultValues?: NewsFormData;
  onCancel: () => void;
  onSubmit: (formData: NewsFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function NewsEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: Props) {
  const formMethods = useForm<NewsFormData>({
    defaultValues: defaultValues ?? {
      title: '',
      titleForMain: '',
      description: '',
      date: new Date(),
      image: null,
      attachments: [],
      tags: [],
      isPrivate: false,
      isImportant: false,
      isSlide: false,
    },
    shouldFocusError: false,
  });
  const { handleSubmit, setValue } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="제목" spacing="8" titleSpacing="2" required>
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
        <Fieldset title="시기" spacing="8" titleSpacing="2" required>
          <Form.Date name="date" hideTime />
        </Fieldset>
        <Fieldset.HTML>
          <Form.HTML
            name="description"
            options={{
              required: { value: true, message: '내용을 입력해주세요.' },
            }}
          />
        </Fieldset.HTML>
        <Fieldset title="대표 이미지" spacing="6" titleSpacing="2">
          <label
            htmlFor="image"
            className="mb-3 block text-sm font-normal tracking-wide text-neutral-500"
          >
            이미지는 글 우측 상단에 표시됩니다.
          </label>
          <Form.Image name="image" />
        </Fieldset>
        <Fieldset.File>
          <Form.File name="attachments" />
        </Fieldset.File>
        <Fieldset title="태그" spacing="8" titleSpacing="3">
          <div className="flex grow flex-wrap gap-x-6 gap-y-2.5">
            {NEWS_TAGS.map((tag) => (
              <Form.Checkbox key={tag} value={tag} name="tags" />
            ))}
          </div>
        </Fieldset>
        <Fieldset title="게시 설정" spacing="6" titleSpacing="3">
          <div className="flex flex-col gap-2">
            <Form.Checkbox
              label="비공개 글"
              name="isPrivate"
              onChange={(isPrivate) => {
                if (isPrivate) {
                  setValue('isImportant', false);
                  setValue('isSlide', false);
                }
              }}
            />
            <Form.Checkbox
              label="메인-중요 안내에 표시"
              name="isImportant"
              onChange={(isImportant) => {
                if (isImportant) setValue('isPrivate', false);
              }}
            />
            <Form.Checkbox
              label="메인-슬라이드쇼에 표시"
              name="isSlide"
              onChange={(isSlide) => {
                if (isSlide) setValue('isPrivate', false);
              }}
            />
            <p className="text-xs font-light tracking-wide text-neutral-700">
              * '슬라이드쇼에 표시' 글은 대표이미지가 첨부되어있는지 확인
              바랍니다.
            </p>
          </div>
        </Fieldset>
        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}
