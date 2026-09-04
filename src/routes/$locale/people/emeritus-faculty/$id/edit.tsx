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
import type {
  ProfessorPutBody,
  ProfessorWithLanguage,
  SimpleResearchLab,
} from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function EmeritusFacultyEdit() {
  const loaderData = Route.useLoaderData();

  const { faculty, labs } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();
  const router = useRouter();

  const onSubmit = async (content: FacultyFormData) => {
    const formData = new ApiFormData();
    // 요청 타입을 달아 둔다 — 백엔드 스키마가 바뀌면 여기서 컴파일이 막힌다.
    const request: ProfessorPutBody = {
      status: content.status,
      labId: content.labId,
      startDate: content.startDate.toISOString(),
      endDate: content.endDate.toISOString(),
      phone: content.phone,
      fax: content.fax,
      email: content.email,
      website: content.website,
      removeImage: faculty.imageURL !== null && content.image === null,
      ko: content.ko,
      en: content.en,
    };
    formData.appendJson('request', request);
    formData.appendIfLocal('newMainImage', content.image);

    try {
      await api.put(`v2/professor/${faculty.id}`, { body: formData });

      toast.success('역대 교수진을 수정했습니다.');
      navigate({ to: `/people/emeritus-faculty/${faculty.id}` });
    } catch (error) {
      toastError(error);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/professor/${faculty.id}`);

      toast.success('역대 교수진을 삭제했습니다.');
      navigate({ to: localizedPath('/people/emeritus-faculty') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="역대 교수진 편집" titleSize="xl" padding="default">
      <FacultyEditor
        defaultValues={faculty}
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
      api.get(`v2/professor/${id}`).json<ProfessorWithLanguage>(),
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
