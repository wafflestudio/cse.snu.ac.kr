import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import type { Staff, StaffWithLanguage } from '@/types/api';
import type { EditorImage } from '@/types/form';

// 언어별로 다른 값만 언어 탭 안에 둔다. 사진·전화·이메일은 사람에게 하나뿐이라 밖에 있다.
// 위치는 예외 — 주소 표기가 한/영이 달라("301동 316호" / "301 Building, Room 316") 탭 안이다.
interface StaffTranslationFields {
  name: string;
  role: string;
  office: string;
  tasks: string[];
}

export interface StaffFormData {
  phone: string;
  email: string;
  image: EditorImage | null;
  ko: StaffTranslationFields;
  en: StaffTranslationFields;
}

interface StaffEditorProps {
  // 응답 그대로 받는다 — 공유값이 최상위에 있어 어느 언어에서 꺼낼지 고민할 일이 없다.
  defaultValues?: Partial<StaffWithLanguage>;
  onCancel: () => void;
  onSubmit: (formData: StaffFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const translationOf = (staff?: Staff | null): StaffTranslationFields => ({
  name: staff?.name ?? '',
  role: staff?.role ?? '',
  office: staff?.office ?? '',
  tasks: staff?.tasks ?? [],
});

export default function StaffEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: StaffEditorProps) {
  const formMethods = useForm<StaffFormData>({
    defaultValues: {
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      image: defaultValues?.imageURL
        ? { type: 'UPLOADED_IMAGE', url: defaultValues.imageURL }
        : null,
      ko: translationOf(defaultValues?.ko),
      en: translationOf(defaultValues?.en),
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;
  const [language, setLanguage] = useState<Language>('ko');

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="사진" spacing="12" titleSpacing="2">
          <label
            htmlFor="image"
            className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
          >
            3:4 비율의 증명사진이 가장 적합합니다.
          </label>
          <Form.Image name="image" />
        </Fieldset>

        <Form.Section title="연락처 정보" titleSpacing="3" spacing="12">
          <Fieldset title="전화번호" spacing="5" titleSpacing="2" required>
            <Form.Text
              name="phone"
              maxWidth="max-w-[20rem]"
              placeholder="예: (02) 880-7302"
              options={{
                required: { value: true, message: '전화번호를 입력해주세요.' },
              }}
            />
          </Fieldset>
          <Fieldset title="이메일" titleSpacing="2" required>
            <Form.Text
              name="email"
              maxWidth="max-w-[25rem]"
              options={{
                required: { value: true, message: '이메일을 입력해주세요.' },
              }}
            />
          </Fieldset>
        </Form.Section>

        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <TranslationEditor language="ko" />}
        {language === 'en' && <TranslationEditor language="en" />}
        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}

const TranslationEditor = ({ language }: { language: Language }) => {
  return (
    <>
      <Fieldset title="이름" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.name`}
          maxWidth="max-w-[30rem]"
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>
      <Fieldset title="위치" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.office`}
          maxWidth="max-w-[20rem]"
          placeholder="예: 301동 316호"
          options={{
            required: { value: true, message: '위치를 입력해주세요.' },
          }}
        />
      </Fieldset>
      <Fieldset title="업무 요약" spacing="10" titleSpacing="2" required>
        <Form.Text
          name={`${language}.role`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 교원인사, 일반서무 등"
          options={{
            required: { value: true, message: '업무 요약을 입력해주세요.' },
          }}
        />
      </Fieldset>
      <Fieldset title="주요 업무" spacing="2.5" titleSpacing="2" required>
        <Form.TextList
          name={`${language}.tasks`}
          placeholder="예: 학부생 수료, 졸업사정 및 논문 관리"
        />
      </Fieldset>
    </>
  );
};
