import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import StaffEditor, {
  type StaffFormData,
} from '@/routes/$locale/people/-components/StaffEditor';
import type { Staff } from '@/types/api/v2/staff';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function StaffCreate() {
  const navigate = useNavigate();
  const { localizedPath, locale } = useLanguage({});

  const onSubmit = async (content: StaffFormData) => {
    const formData = new ApiFormData();

    formData.appendJson('request', {
      ko: { ...content.ko, image: undefined },
      en: { ...content.en, image: undefined },
    });
    formData.appendIfLocal('mainImage', content.ko.image);

    try {
      const response = await api
        .post('v2/staff', { body: formData })
        .json<{ ko: Staff; en: Staff }>();

      toast.success('행정직원을 추가했습니다.');
      navigate({ to: localizedPath(`/people/staff/${response[locale].id}`) });
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="행정직원 추가" titleSize="xl" padding="default">
      <StaffEditor
        onCancel={() => navigate({ to: localizedPath('/people/staff') })}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/people/staff/create')({
  component: StaffCreate,
});
