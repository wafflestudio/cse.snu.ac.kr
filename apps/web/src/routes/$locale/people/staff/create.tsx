import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import StaffEditor, {
  type StaffFormData,
} from '@/routes/$locale/people/-components/StaffEditor';
import type { StaffPostBody, StaffWithLanguage } from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function StaffCreate() {
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const onSubmit = async (content: StaffFormData) => {
    const formData = new ApiFormData();

    // 요청 타입을 달아 둔다 — 백엔드 스키마가 바뀌면 여기서 컴파일이 막힌다.
    const request: StaffPostBody = {
      phone: content.phone,
      email: content.email,
      ko: content.ko,
      en: content.en,
    };
    formData.appendJson('request', request);
    formData.appendIfLocal('mainImage', content.image);

    try {
      const response = await api
        .post('v2/staff', { body: formData })
        .json<StaffWithLanguage>();

      toast.success('행정직원을 추가했습니다.');
      navigate({ to: localizedPath(`/people/staff/${response.id}`) });
    } catch (error) {
      toastError(error);
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
