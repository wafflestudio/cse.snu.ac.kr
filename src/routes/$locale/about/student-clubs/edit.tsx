import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { ClubPutBody, StudentClubsResponse } from '@/types/api';
import type { EditorImage } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import { stringParam } from '@/utils/searchSchema';

interface ClubFormData {
  ko: { name: string; description: string };
  en: { name: string; description: string };
  image: EditorImage;
}

function StudentClubsEdit() {
  const loaderData = Route.useLoaderData();

  const { club } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  // 사진은 동아리 하나에 한 장이라 최상위에서 온다.
  const empty = { name: '', description: '' };
  const defaultValues: ClubFormData = {
    ko: club.ko ?? empty,
    en: club.en ?? empty,
    image: club.imageURL && {
      type: 'UPLOADED_IMAGE',
      url: club.imageURL,
    },
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate({ to: localizedPath('/about/student-clubs') });
  };

  const onSubmit = methods.handleSubmit(async ({ ko, en, image }) => {
    const formData = new ApiFormData();

    const removeImage = !!defaultValues.image && !image;
    // 요청 타입을 달아 둔다 — 백엔드 스키마가 바뀌면 여기서 컴파일이 막힌다.
    const request: ClubPutBody = { id: club.id, removeImage, ko, en };
    formData.appendJson('request', request);
    formData.appendIfLocal('newMainImage', image);

    try {
      await api.put(`v2/about/student-clubs`, { body: formData });

      toast.success('동아리를 수정했습니다.');
      navigate({ to: localizedPath('/about/student-clubs') });
    } catch (error) {
      toastError(error);
    }
  });

  return (
    <PageLayout title="동아리 소개 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.Title>
            <Form.Text
              name="ko.name"
              options={{
                required: {
                  value: true,
                  message: '한국어 제목을 입력해주세요.',
                },
              }}
              hidden={language === 'en'}
            />
            <Form.Text
              name="en.name"
              options={{
                required: { value: true, message: '영문 제목을 입력해주세요.' },
              }}
              hidden={language === 'ko'}
            />
          </Fieldset.Title>

          <Fieldset.HTML>
            <Form.HTML
              name="ko.description"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="en.description"
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

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/about/student-clubs/edit')({
  validateSearch: (search: Record<string, unknown>) => ({
    selected: stringParam(search.selected),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const selectedParam = deps.selected;

    const clubs = await api
      .get(`v2/about/student-clubs`)
      .json<StudentClubsResponse>();

    // selected param으로 club 찾기
    const selectedClub =
      clubs.find((item) => item.id.toString() === selectedParam) ?? clubs[0];

    return { club: selectedClub };
  },
  component: StudentClubsEdit,
});
