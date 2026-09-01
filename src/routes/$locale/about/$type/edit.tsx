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
import { useLanguage } from '@/hooks/useLanguage';
import type { AboutContent } from '@/types/api';
import type { EditorFile, EditorImage } from '@/types/form';
import { LOCALES } from '@/types/i18n';
import { api } from '@/utils/api';
import { ApiFormData, getDeleteIds } from '@/utils/apiFormData';

interface AboutFormData {
  htmlKo: string;
  htmlEn: string;
  image: EditorImage;
  files: EditorFile[];
}

const ABOUT_TYPES: Record<string, { title: string; endpoint: string }> = {
  overview: { title: '학부 소개 편집', endpoint: 'overview' },
  greetings: { title: '학부장 인사말 편집', endpoint: 'greetings' },
  history: { title: '연혁 편집', endpoint: 'history' },
  contact: { title: '연락처 편집', endpoint: 'contact' },
};

function AboutEdit() {
  const loaderData = Route.useLoaderData();

  const { koData, enData, type } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const { title, endpoint } = ABOUT_TYPES[type];

  const defaultValues: AboutFormData = {
    htmlKo: koData.description,
    htmlEn: enData.description,
    image: koData.imageURL && { type: 'UPLOADED_IMAGE', url: koData.imageURL },
    files: (koData.attachments ?? []).map((file) => ({
      type: 'UPLOADED_FILE',
      file,
    })),
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate({ to: localizedPath(`/about/${type}`) });
  };

  const onSubmit = methods.handleSubmit(
    async ({ htmlKo, htmlEn, image, files }) => {
      const formData = new ApiFormData();

      const deleteIds = getDeleteIds({ prev: defaultValues.files, cur: files });

      formData.appendJson('request', {
        ko: { description: htmlKo, deleteIds },
        en: { description: htmlEn, deleteIds: [] },
        removeImage: defaultValues.image !== null && image === null,
      });
      formData.appendIfLocal('newMainImage', image);
      formData.appendIfLocal('newAttachments', files);

      try {
        await api.put(`v2/about/${endpoint}`, { body: formData });

        navigate({ to: localizedPath(`/about/${type}`) });
      } catch {
        toast.error('수정에 실패했습니다.');
      }
    },
  );

  return (
    <PageLayout title={title} titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.HTML>
            <Form.HTML
              name="htmlKo"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="htmlEn"
              options={{
                required: { value: true, message: '영문 내용을 입력해주세요.' },
              }}
              isHidden={language === 'ko'}
            />
          </Fieldset.HTML>

          <Fieldset.Image>
            <label
              htmlFor="image"
              className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
            >
              글 우측 상단에 들어가는 이미지입니다.
            </label>
            <Form.Image name="image" />
          </Fieldset.Image>

          {type === 'overview' && (
            <Fieldset.File>
              <Form.File name="files" />
            </Fieldset.File>
          )}

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/about/$type/edit')({
  loader: async ({ params }) => {
    const { type } = params;
    const endpoint = ABOUT_TYPES[type].endpoint;

    const [koData, enData] = await Promise.all(
      LOCALES.map((locale) =>
        api.get(`v2/about/${endpoint}?language=${locale}`).json<AboutContent>(),
      ),
    );

    return { koData, enData, type };
  },
  component: AboutEdit,
});
