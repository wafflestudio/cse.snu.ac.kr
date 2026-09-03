import {
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import StaffEditor, {
  type StaffFormData,
} from '@/routes/$locale/people/-components/StaffEditor';
import type { Staff } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function StaffEdit() {
  const loaderData = Route.useLoaderData();

  const { staff } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage();
  const router = useRouter();

  const defaultValues = {
    ko: staff.ko,
    en: staff.en,
  };

  const onSubmit = async (content: StaffFormData) => {
    const formData = new ApiFormData();
    const removeImage =
      defaultValues.ko?.imageURL !== null && content.ko.image === null;

    formData.appendJson('request', {
      ko: { ...content.ko, image: undefined, removeImage },
      en: { ...content.en, image: undefined, removeImage },
    });
    formData.appendIfLocal('newMainImage', content.ko.image);

    try {
      await api.put(`v2/staff/${staff.ko.id}/${staff.en.id}`, {
        body: formData,
      });

      toast.success('행정직원을 수정했습니다.');
      navigate({ to: `/people/staff/${staff.ko.id}` });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/staff/${staff.ko.id}/${staff.en.id}`);

      toast.success('행정직원을 삭제했습니다.');
      navigate({ to: localizedPath('/people/staff') });
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="행정직원 편집" titleSize="xl" padding="default">
      <StaffEditor
        defaultValues={defaultValues}
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

    const staff = await api
      .get(`v2/staff/${id}`)
      .json<{ ko: Staff; en: Staff }>();

    return { staff };
  },
  component: StaffEdit,
});
