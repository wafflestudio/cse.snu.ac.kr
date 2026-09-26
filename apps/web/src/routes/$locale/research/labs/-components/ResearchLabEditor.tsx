import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import { useLanguage } from '@/hooks/useLanguage';
import type { ResearchGroup, SimpleFaculty } from '@/types/api';
import type { EditorFile } from '@/types/form';

type LanguageSpecificLabData = {
  name: string;
  description: string;
  location: string;
};

export type ResearchLabFormData = {
  ko: LanguageSpecificLabData;
  en: LanguageSpecificLabData;
  // 소속 그룹·지도교수는 연구실에 하나뿐이라 언어 탭 밖에 있다.
  groupId: number | null;
  professorId: number | null;
  acronym: string;
  tel: string;
  websiteURL: string;
  youtube: string;
  pdf: EditorFile[];
};

interface ResearchLabEditorProps {
  professors: { ko: SimpleFaculty[]; en: SimpleFaculty[] };
  groups: { ko: ResearchGroup[]; en: ResearchGroup[] };
  defaultValues?: ResearchLabFormData;
  onSubmit: (formData: ResearchLabFormData) => void;
  onDelete?: () => Promise<void>;
}

const defaultLabValue: LanguageSpecificLabData = {
  name: '',
  description: '',
  location: '',
};

export default function ResearchLabEditor({
  onSubmit,
  professors,
  groups,
  defaultValues,
  onDelete,
}: ResearchLabEditorProps) {
  const formMethods = useForm<ResearchLabFormData>({
    defaultValues: defaultValues ?? {
      ko: defaultLabValue,
      en: defaultLabValue,
      groupId: null,
      professorId: null,
      tel: '',
      acronym: '',
      youtube: '',
      websiteURL: '',
      pdf: [],
    },
    shouldFocusError: false,
  });

  const { handleSubmit } = formMethods;
  const [language, setLanguage] = useState<Language>('ko');
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const onCancel = () => navigate({ to: localizedPath('/research/labs') });

  return (
    <FormProvider {...formMethods}>
      <Form>
        <SharedEditor professors={professors.ko} groups={groups.ko} />

        <LanguagePicker onChange={setLanguage} selected={language} />
        {language === 'ko' && <TranslationEditor language="ko" />}
        {language === 'en' && <TranslationEditor language="en" />}
        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
          deleteLabel={`‘${defaultValues?.ko.name}’ 연구실`}
        />
      </Form>
    </FormProvider>
  );
}

const SharedEditor = ({
  professors,
  groups,
}: {
  professors: SimpleFaculty[];
  groups: ResearchGroup[];
}) => {
  return (
    <>
      <Form.Row>
        <Fieldset title="지도교수">
          <Form.Dropdown
            name="professorId"
            contents={[
              { label: '선택 안 함', value: null },
              ...professors.map((prof) => ({
                label: prof.name,
                value: prof.id,
              })),
            ]}
          />
        </Fieldset>
        <Fieldset title="연구실 약자">
          <Form.Text name="acronym" size="md" />
        </Fieldset>
      </Form.Row>
      <Form.Row>
        <Fieldset title="전화">
          <Form.Text name="tel" size="md" placeholder="예: (02) 880-7302" />
        </Fieldset>
        <Fieldset title="웹사이트 주소">
          <Form.Text
            name="websiteURL"
            size="md"
            placeholder="예: https://www.example.com"
          />
        </Fieldset>
      </Form.Row>

      <Fieldset title="연구·교육 스트림" required>
        <Form.Dropdown
          name="groupId"
          contents={[
            { label: '선택 안 함', value: null },
            ...groups.map((group) => ({
              label: `${group.name} 스트림`,
              value: group.id,
            })),
          ]}
          rules={{
            required: {
              value: true,
              message: '연구·교육 스트림을 선택해 주세요.',
            },
          }}
        />
      </Fieldset>

      <Fieldset title="소개 자료">
        <div className="mb-3 flex max-w-120 items-center">
          <span className="w-14 type-label text-neutral-500">| 문서</span>
          <Form.File name="pdf" multiple={false} />
        </div>
        <div className="flex max-w-120 items-center">
          <span className="w-14 type-label text-neutral-500">| 유튜브</span>
          <Form.Text
            name="youtube"
            placeholder="예: https://www.youtube.com/watch?v=bCLWYhurBuo"
          />
        </div>
      </Fieldset>
    </>
  );
};

const TranslationEditor = ({ language }: { language: Language }) => {
  return (
    <>
      <Fieldset title="연구실명" required>
        <Form.Text
          name={`${language}.name`}
          size="lg"
          options={{
            required: { value: true, message: '연구실명을 입력해 주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="연구실 위치">
        <Form.Text
          name={`${language}.location`}
          placeholder='복수일 경우 " / "로 구분해 주세요. 예: 301동 515호 / 518호 / 551-1호'
        />
      </Fieldset>

      <Fieldset title="연구실 설명 및 이미지" required>
        <Form.HTML
          name={`${language}.description`}
          options={{
            required: { value: true, message: '연구실 설명을 입력해 주세요.' },
          }}
        />
      </Fieldset>
    </>
  );
};
