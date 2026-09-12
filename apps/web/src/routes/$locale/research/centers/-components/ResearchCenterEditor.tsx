import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import type { EditorImage } from '@/types/form';

// 웹사이트 주소와 대표이미지는 센터에 하나뿐이라 언어 탭 밖에 있다.
interface ResearchCenterFormFields {
  name: string;
  description: string;
}

export interface ResearchCenterFormData {
  ko: ResearchCenterFormFields;
  en: ResearchCenterFormFields;
  websiteURL: string;
  image: EditorImage | null;
}

interface ResearchCenterEditorProps {
  defaultValues?: ResearchCenterFormData;
  onCancel: () => void;
  onSubmit: (formData: ResearchCenterFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ResearchCenterEditor({
  defaultValues,
  onCancel,
  onSubmit,
  onDelete,
}: ResearchCenterEditorProps) {
  const [language, setLanguage] = useState<Language>('ko');
  const formMethods = useForm<ResearchCenterFormData>({
    defaultValues: defaultValues ?? {
      ko: { name: '', description: '' },
      en: { name: '', description: '' },
      websiteURL: '',
      image: null,
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="웹사이트 주소" spacing="8" titleSpacing="2">
          <Form.Text name="websiteURL" />
        </Fieldset>

        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <Editor language="ko" />}
        {language === 'en' && <Editor language="en" />}

        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}

const Editor = ({ language }: { language: Language }) => {
  return (
    <>
      <Fieldset title="센터 이름" spacing="8" required>
        <Form.Text
          name={`${language}.name`}
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset.HTML>
        <Form.HTML
          name={`${language}.description`}
          options={{
            required: { value: true, message: '내용을 입력해주세요.' },
          }}
        />
      </Fieldset.HTML>

      <Fieldset.Image>
        <label
          htmlFor="image"
          className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
        >
          연구 센터 대표 이미지입니다.
        </label>
        <Form.Image name="image" />
      </Fieldset.Image>
    </>
  );
};
