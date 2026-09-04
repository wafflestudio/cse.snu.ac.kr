import {
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import FacultyEditor, {
  type FacultyFormData,
} from '@/routes/$locale/people/-components/FacultyEditor';
import type { Faculty, SimpleResearchLab } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function EmeritusFacultyEdit() {
  const loaderData = Route.useLoaderData();

  const { faculty, labs } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();
  const router = useRouter();

  const defaultValues = {
    status: faculty.ko.status,
    ko: faculty.ko,
    en: faculty.en,
  };

  const onSubmit = async (content: FacultyFormData) => {
    const formData = new ApiFormData();
    const removeImage =
      defaultValues.ko?.imageURL !== null && content.ko.image === null;

    formData.appendJson('request', {
      ko: {
        ...content.ko,
        status: content.status,
        image: undefined,
        startDate: content.ko.startDate.toISOString(),
        endDate: content.ko.endDate.toISOString(),
        removeImage,
      },
      en: {
        ...content.en,
        status: content.status,
        image: undefined,
        startDate: content.en.startDate.toISOString(),
        endDate: content.en.endDate.toISOString(),
        removeImage,
      },
    });
    formData.appendIfLocal('newMainImage', content.ko.image);

    try {
      await api.put(`v2/professor/${faculty.ko.id}/${faculty.en.id}`, {
        body: formData,
      });

      toast.success('역대 교수진을 수정했습니다.');
      navigate({ to: `/people/emeritus-faculty/${faculty.ko.id}` });
    } catch (error) {
      toastError(error);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/professor/${faculty.ko.id}/${faculty.en.id}`);

      toast.success('역대 교수진을 삭제했습니다.');
      navigate({ to: localizedPath('/people/emeritus-faculty') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="역대 교수진 편집" titleSize="xl" padding="default">
      <FacultyEditor
        defaultValues={defaultValues}
        labs={labs}
        onCancel={() => router.history.go(-1)}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute(
  '/$locale/people/emeritus-faculty/$id/edit',
)({
  loader: async ({ params }) => {
    const id = parseInt(params.id, 10);

    const [faculty, labsKo, labsEn] = await Promise.all([
      api.get(`v2/professor/${id}`).json<{ ko: Faculty; en: Faculty }>(),
      api.get(`v2/research/lab?language=ko`).json<SimpleResearchLab[]>(),
      api.get(`v2/research/lab?language=en`).json<SimpleResearchLab[]>(),
    ]);

    return {
      faculty,
      labs: { ko: labsKo, en: labsEn },
    };
  },
  component: EmeritusFacultyEdit,
});
