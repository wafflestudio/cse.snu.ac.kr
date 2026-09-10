import {
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import StaffEditor, {
  type StaffFormData,
} from '@/routes/$locale/people/-components/StaffEditor';
import type { StaffPutBody, StaffWithLanguage } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function StaffEdit() {
  const loaderData = Route.useLoaderData();

  const { staff } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();
  const router = useRouter();

  const staffId = staff.id;

  const onSubmit = async (content: StaffFormData) => {
    const formData = new ApiFormData();
    const request: StaffPutBody = {
      phone: content.phone,
      email: content.email,
      removeImage: staff.imageURL !== null && content.image === null,
      ko: content.ko,
      en: content.en,
    };
    formData.appendJson('request', request);
    formData.appendIfLocal('newMainImage', content.image);

    try {
      await api.put(`v2/staff/${staffId}`, { body: formData });

      toast.success('행정직원을 수정했습니다.');
      navigate({ to: `/people/staff/${staffId}` });
    } catch (error) {
      toastError(error);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/staff/${staffId}`);

      toast.success('행정직원을 삭제했습니다.');
      navigate({ to: localizedPath('/people/staff') });
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <PageLayout title="행정직원 편집" titleSize="xl" padding="default">
      <StaffEditor
        defaultValues={staff}
        onCancel={() => router.history.go(-1)}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/people/staff/$id/edit')({
  loader: async ({ params }) => {
    const id = parseInt(params.id, 10);

    const staff = await api.get(`v2/staff/${id}`).json<StaffWithLanguage>();

    return { staff };
  },
  component: StaffEdit,
});
