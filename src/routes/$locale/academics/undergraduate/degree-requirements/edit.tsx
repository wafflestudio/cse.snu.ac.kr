import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { useAcademicsSubNav } from '@/hooks/useSubNav';
import type { DegreeRequirements } from '@/types/api';
import type { EditorFile } from '@/types/form';
import { api } from '@/utils/api';
import { ApiFormData, getAttachmentIds } from '@/utils/apiFormData';

interface DegreeRequirementsFormData {
  description: string;
  files: EditorFile[];
}

function DegreeRequirementsEditPage() {
  const loaderData = Route.useLoaderData();

  const { localizedPath, t } = useLanguage({
    '학부 졸업규정을 수정했습니다.':
      'Degree requirements updated successfully.',
    '학부 졸업규정을 수정하지 못했습니다.':
      'Failed to update degree requirements.',
  });

  const formMethods = useForm<DegreeRequirementsFormData>({
    defaultValues: loaderData,
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  const navigate = useNavigate();
  const subNav = useAcademicsSubNav();
  const title = t('졸업 규정');
  const onCancel = () =>
    navigate({
      to: localizedPath('/academics/undergraduate/degree-requirements'),
    });

  const onSubmit = async (content: DegreeRequirementsFormData) => {
    const formData = new ApiFormData();
    formData.appendJson('request', {
      description: content.description,
      attachmentIds: getAttachmentIds(content.files),
    });
    formData.appendIfLocal('attachments', content.files);

    try {
      await api.put(`v2/academics/undergraduate/degree-requirements`, {
        body: formData,
      });
      toast.success(t('학부 졸업규정을 수정했습니다.'));
      navigate({
        to: localizedPath('/academics/undergraduate/degree-requirements'),
      });
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
          <Fieldset.File>
            <Form.File name="files" />
          </Fieldset.File>
          <Form.Action onCancel={onCancel} onSubmit={handleSubmit(onSubmit)} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/academics/undergraduate/degree-requirements/edit',
)({
  loader: async () => {
    const data = await api
      .get(`v2/academics/undergraduate/degree-requirements`)
      .json<DegreeRequirements>();

    return {
      description: data.description,
      files: data.attachments.map((file) => ({
        type: 'UPLOADED_FILE' as const,
        file,
      })),
    };
  },
  component: DegreeRequirementsEditPage,
});
