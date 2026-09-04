import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { useAcademicsSubNav } from '@/hooks/useSubNav';
import type { ScholarshipList } from '@/types/api';
import { api } from '@/utils/api';

interface ScholarshipGuideFormData {
  description: string;
}

function ScholarshipEditPage() {
  const loaderData = Route.useLoaderData();
  const params = Route.useParams();

  const { studentType } = params;
  const { t } = useLanguage({
    '장학 제도를 수정했습니다.': 'Scholarship guide updated successfully.',
    '장학 제도를 수정하지 못했습니다.': 'Failed to update scholarship guide.',
  });

  const formMethods = useForm<ScholarshipGuideFormData>({
    defaultValues: loaderData,
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  const navigate = useNavigate();
  const subNav = useAcademicsSubNav();
  const title = t('장학 제도');
  const _studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const onCancel = () =>
    navigate({ to: `/academics/${studentType}/scholarship` });

  const onSubmit = async (content: ScholarshipGuideFormData) => {
    try {
      await api.put(`v2/academics/${studentType}/scholarship`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: content.description }),
      });
      toast.success(t('장학 제도를 수정했습니다.'));
      navigate({ to: `/academics/${studentType}/scholarship` });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <FormProvider {...formMethods}>
        <Form>
          <Fieldset.HTML>
            <Form.HTML name="description" />
          </Fieldset.HTML>
          <Form.Action onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/academics/$studentType/scholarship/edit',
)({
  loader: async ({ params }) => {
    const { studentType } = params;
    const data = await api
      .get(`v2/academics/${studentType}/scholarship`)
      .json<ScholarshipList>();

    return {
      description: data.description,
    };
  },
  component: ScholarshipEditPage,
});
