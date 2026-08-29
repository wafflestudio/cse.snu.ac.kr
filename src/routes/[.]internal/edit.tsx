import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { BASE_URL } from '@/constants/api';
import { fetchJson, fetchOk } from '@/utils/fetch';

interface InternalFormData {
  description: string;
}

function InternalEdit() {
  const loaderData = Route.useLoaderData();

  const navigate = useNavigate();

  const defaultValues: InternalFormData = {
    description: loaderData.description,
  };

  const methods = useForm({ defaultValues, shouldFocusError: false });

  const onCancel = () => {
    navigate({ to: '/.internal' });
  };

  const onSubmit = methods.handleSubmit(async ({ description }) => {
    try {
      await fetchOk(`/api/v2/internal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      navigate({ to: '/.internal' });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  });

  return (
    <PageLayout title="학부 메일링리스트 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <Fieldset.HTML>
            <Form.HTML
              name="description"
              options={{
                required: { value: true, message: '내용을 입력해주세요.' },
              }}
            />
          </Fieldset.HTML>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute('/.internal/edit')({
  loader: async () => {
    const data = await fetchJson<{ description: string }>(
      `${BASE_URL}/v2/internal`,
    );
    return { description: data.description };
  },
  component: InternalEdit,
});
