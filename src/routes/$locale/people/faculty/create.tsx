import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import FacultyEditor, {
  type FacultyFormData,
} from '@/routes/$locale/people/-components/FacultyEditor';
import type { Faculty, FacultyStatus } from '@/types/api/v2/professor';
import type { SimpleResearchLab } from '@/types/api/v2/research/labs';
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

    formData.appendJson('request', {
      ko: {
        ...content.ko,
        status: content.status,
        image: undefined,
        startDate: content.ko.startDate.toISOString(),
        endDate: content.ko.endDate.toISOString(),
      },
      en: {
        ...content.en,
        status: content.status,
        image: undefined,
        startDate: content.en.startDate.toISOString(),
        endDate: content.en.endDate.toISOString(),
      },
    });
    formData.appendIfLocal('mainImage', content.ko.image);

    try {
      const response = await api
        .post('v2/professor', { body: formData })
        .json<{ ko: Faculty; en: Faculty }>();
      toast.success('교수진을 추가했습니다.');

      const path =
        content.status === 'INACTIVE'
          ? '/people/emeritus-faculty'
          : '/people/faculty';
      navigate({ to: localizedPath(`${path}/${response.ko.id}`) });
    } catch {
      toast.error('추가에 실패했습니다.');
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
