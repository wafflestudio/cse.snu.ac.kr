import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '~/components/form/Fieldset';
import Form from '~/components/form/Form';
import LanguagePicker from '~/components/form/LanguagePicker';
import type { Locale } from '~/types/i18n';

export interface ScholarshipFormData {
  koName: string;
  koDescription: string;
  enName: string;
  enDescription: string;
}

interface ScholarshipEditorProps {
  defaultValues?: ScholarshipFormData;
  cancelPath: string;
  onSubmit: (data: ScholarshipFormData) => Promise<void>;
}

export default function ScholarshipEditor({
  defaultValues,
  cancelPath,
  onSubmit: _onSubmit,
}: ScholarshipEditorProps) {
  const methods = useForm<ScholarshipFormData>({
    defaultValues: defaultValues ?? {
      koName: '',
      koDescription: '',
      enName: '',
      enDescription: '',
    },
    shouldFocusError: false,
  });
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Locale>('ko');

  const onSubmit = async (formData: ScholarshipFormData) => {
    await _onSubmit(formData);
  };

  const onCancel = () => navigate({ to: cancelPath });

  return (
    <FormProvider {...methods}>
      <Form>
        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <Editor language="ko" />}
        {language === 'en' && <Editor language="en" />}
        <Form.Action
          onCancel={onCancel}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      </Form>
    </FormProvider>
  );
}

function Editor({ language }: { language: Locale }) {
  return (
    <>
      <Fieldset.Title>
        <Form.Text
          name={`${language}Name`}
          options={{
            required: { value: true, message: '장학금 이름을 입력해주세요.' },
          }}
        />
      </Fieldset.Title>
      <Fieldset.HTML>
        <Form.HTML
          name={`${language}Description`}
          options={{
            required: { value: true, message: '장학금 설명을 입력해주세요.' },
          }}
        />
      </Fieldset.HTML>
    </>
  );
}
