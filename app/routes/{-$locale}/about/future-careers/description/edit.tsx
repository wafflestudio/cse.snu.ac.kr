import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import type { FutureCareersResponse } from '@/types/api/v2/about/future-careers';
import { LOCALES } from '@/types/i18n';
import { fetchJson, fetchOk } from '@/utils/fetch';

interface CareerDescriptionFormData {
  ko: string;
  en: string;
}

function CareerDescriptionEdit() {
  const loaderData = Route.useLoaderData();

  const { ko, en } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: CareerDescriptionFormData = { ko, en };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate({ to: localizedPath('/about/future-careers') });
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en }) => {
    try {
      await fetchOk(`/api/v2/about/future-careers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          koDescription: ko,
          enDescription: en,
        }),
      });

      toast.success('졸업생 진로 본문을 수정했습니다.');
      navigate({ to: localizedPath('/about/future-careers') });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  return (
    <PageLayout title="졸업생 진로 본문 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.HTML>
            <Form.HTML
              name="ko"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="en"
              options={{
                required: { value: true, message: '영문 내용을 입력해주세요.' },
              }}
              isHidden={language === 'ko'}
            />
          </Fieldset.HTML>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/{-$locale}/about/future-careers/description/edit',
)({
  loader: async () => {
    const [koData, enData] = await Promise.all(
      LOCALES.map((locale) =>
        fetchJson<FutureCareersResponse>(
          `${BASE_URL}/v2/about/future-careers?language=${locale}`,
        ),
      ),
    );

    return { ko: koData.description, en: enData.description };
  },
  component: CareerDescriptionEdit,
});
