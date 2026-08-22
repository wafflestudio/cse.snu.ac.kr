import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import type { FacultyRecruitment } from '@/types/api/v2/recruit';
import type { EditorImage } from '@/types/form';
import { fetchJson, fetchOk } from '@/utils/fetch';
import { FormData2 } from '@/utils/form';

interface FormData {
  title: string;
  description: string;
  image: EditorImage | null;
}

function FacultyRecruitmentEditPage() {
  const data = Route.useLoaderData();

  const navigate = useNavigate();
  const { localizedPath } = useLanguage();

  const methods = useForm<FormData>({
    defaultValues: {
      description: data.description,
      image: data.mainImageUrl && {
        type: 'UPLOADED_IMAGE',
        url: data.mainImageUrl,
      },
    },
    shouldFocusError: false,
  });

  const onCancel = () => {
    navigate({ to: localizedPath('/community/faculty-recruitment') });
  };

  const onSubmit = methods.handleSubmit(
    async ({ title, description, image }) => {
      try {
        const formData = new FormData2();
        formData.appendJson('request', {
          title,
          description,
          removeImage: data.mainImageUrl !== null && image === null,
        });
        formData.appendIfLocal('newMainImage', image);

        await fetchOk(`${BASE_URL}/v2/recruit`, {
          method: 'PUT',
          body: formData,
        });

        toast.success('신임교수초빙을 수정했습니다.');
        navigate({ to: localizedPath('/community/faculty-recruitment') });
      } catch {
        toast.error('신임교수초빙을 수정하지 못했습니다.');
      }
    },
  );

  return (
    <PageLayout title="신임교수초빙 편집" titleSize="xl">
      <FormProvider {...methods}>
        <Form>
          <Fieldset.Title>
            <Form.Text
              name="title"
              options={{
                required: { value: true, message: '제목을 입력해주세요.' },
              }}
            />
          </Fieldset.Title>
          <Fieldset.HTML>
            <Form.HTML
              name="description"
              options={{
                required: { value: true, message: '내용을 입력해주세요.' },
              }}
            />
          </Fieldset.HTML>

          <Fieldset.Image>
            <Form.Image name="image" />
          </Fieldset.Image>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/community/faculty-recruitment/edit',
)({
  loader: async () => {
    return fetchJson<FacultyRecruitment>(`${BASE_URL}/v2/recruit`);
  },
  component: FacultyRecruitmentEditPage,
});
