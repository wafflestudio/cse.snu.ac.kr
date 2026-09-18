import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import LanguagePicker from '@/components/form/LanguagePicker';
import Text from '@/components/form/Text';
import TextArea from '@/components/form/TextArea';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/sonner';

export function FieldDemo() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const methods = useForm({
    defaultValues: {
      ko: { title: '', description: '' },
      en: { title: '', description: '' },
    },
  });
  const error = methods.formState.errors[language]?.title;
  return (
    <FormProvider {...methods}>
      <form
        className="leading-[1.2] max-w-[560px] flex flex-col items-start gap-5 [&>div:first-child]:mb-0 [&_input[type=radio]:focus-visible+label]:outline-2 [&_input[type=radio]:focus-visible+label]:outline-link [&_input[type=radio]:focus-visible+label]:outline-offset-4 [&>label]:w-full [&>label]:max-w-110 [&>label_input]:w-full [&>label_input]:min-w-0 [&_input[aria-invalid=true]]:border-error"
        onSubmit={async (event) => {
          event.preventDefault();
          if (await methods.trigger(`${language}.title`)) {
            toast.success('입력 내용을 확인했습니다.');
          }
        }}
        noValidate
      >
        <LanguagePicker selected={language} onChange={setLanguage} />
        <label
          className="flex min-w-0 flex-1 flex-col gap-2 [&>span]:text-xs/[inherit] [&>span]:font-medium [&>span]:text-neutral-600"
          htmlFor="specimen-title"
        >
          <span>
            {'제목'} <span className="text-main-orange">*</span>
          </span>
          <Text
            key={language}
            id="specimen-title"
            name={`${language}.title`}
            options={{ required: true }}
            placeholder={
              language === 'ko' ? '연구실 소개' : 'Laboratory overview'
            }
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'specimen-title-error' : undefined}
          />
        </label>
        {error && (
          <p
            id="specimen-title-error"
            className="-mt-2.5 text-xs/[inherit] text-error"
            role="alert"
          >
            {'제목을 입력해 주세요.'}
          </p>
        )}
        <label
          className="flex min-w-0 flex-1 flex-col gap-2 [&>span]:text-xs/[inherit] [&>span]:font-medium [&>span]:text-neutral-600"
          htmlFor="specimen-description"
        >
          <span>{'설명'}</span>
          <TextArea
            key={language}
            id="specimen-description"
            name={`${language}.description`}
          />
        </label>
        <Button type="submit" variant="neutral">
          {'입력 확인'}
        </Button>
      </form>
    </FormProvider>
  );
}
