import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import FacultyEditor, {
  type FacultyFormData,
} from '@/routes/$locale/people/-components/FacultyEditor';
import type { FacultyStatus } from '@/routes/$locale/people/-constants';
import type {
  ProfessorPostBody,
  ProfessorWithLanguage,
  SimpleResearchLab,
} from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';
import { stringParam } from '@/utils/searchSchema';

function FacultyCreate() {
  const loaderData = Route.useLoaderData();

  const { status, labs } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const onSubmit = async (content: FacultyFormData) => {
    const formData = new ApiFormData();

    const request: ProfessorPostBody = {
      status: content.status,
      labId: content.labId,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate.toISOString(),
      phone: content.phone,
      fax: content.fax,
      email: content.email,
      website: content.website,
      ko: content.ko,
      en: content.en,
    };
    formData.appendJson('request', request);
    formData.appendIfLocal('mainImage', content.image);

    try {
      const response = await api
        .post('v2/professor', { body: formData })
        .json<ProfessorWithLanguage>();
      toast.success('교수진을 추가했습니다.');

      const path =
        content.status === 'INACTIVE'
          ? '/people/emeritus-faculty'
          : '/people/faculty';
      navigate({ to: localizedPath(`${path}/${response.id}`) });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="교수진 추가" titleSize="xl" padding="default">
      <FacultyEditor
        status={status}
        labs={labs}
        onCancel={() => navigate({ to: localizedPath('/people/faculty') })}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/people/faculty/create')({
  validateSearch: (search: Record<string, unknown>) => ({
    status: stringParam(search.status),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const status = (deps.status as FacultyStatus) ?? 'ACTIVE';

    const [labsKo, labsEn] = await Promise.all([
      api.get(`v2/research/lab?language=ko`).json<SimpleResearchLab[]>(),
      api.get(`v2/research/lab?language=en`).json<SimpleResearchLab[]>(),
    ]);

    return { status, labs: { ko: labsKo, en: labsEn } };
  },
  component: FacultyCreate,
});
