import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '~/components/layout/PageLayout';
import { toast } from '~/components/ui/sonner';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import ResearchLabEditor, {
  type ResearchLabFormData,
} from '~/routes/{-$locale}/research/labs/components/ResearchLabEditor';
import type { SimpleFaculty } from '~/types/api/v2/professor';
import type { ResearchGroup } from '~/types/api/v2/research/groups';
import { fetchJson } from '~/utils/fetch';
import { FormData2 } from '~/utils/form';

function ResearchLabCreate() {
  const loaderData = Route.useLoaderData();

  const { groups, professors } = loaderData;
  const navigate = useNavigate();
  const { localizedPath, locale } = useLanguage({});

  const onSubmit = async ({ ko, en, ...common }: ResearchLabFormData) => {
    const formData = new FormData2();

    formData.appendJson('request', {
      ko: {
        ...ko,
        ...common,
        professorIds: ko.professorId ? [ko.professorId] : [],
      },
      en: {
        ...en,
        ...common,
        professorIds: en.professorId ? [en.professorId] : [],
      },
    });

    formData.appendIfLocal('pdf', common.pdf);

    try {
      await fetchJson(`${BASE_URL}/v2/research/lab`, {
        method: 'POST',
        body: formData,
      });

      toast.success('연구실을 추가했습니다.');
      navigate({ to: localizedPath('/research/labs') });
    } catch {
      toast.error('추가에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구실 추가" titleSize="xl" padding="default">
      <ResearchLabEditor
        professors={professors}
        groups={groups}
        onSubmit={onSubmit}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/{-$locale}/research/labs/create')({
  loader: async () => {
    const [groupsKo, groupsEn, professorsKo, professorsEn] = await Promise.all([
      fetchJson<ResearchGroup[]>(`${BASE_URL}/v2/research/groups?language=ko`),
      fetchJson<ResearchGroup[]>(`${BASE_URL}/v2/research/groups?language=en`),
      fetchJson<{ description: string; professors: SimpleFaculty[] }>(
        `${BASE_URL}/v2/professor/active?language=ko`,
      ),
      fetchJson<{ description: string; professors: SimpleFaculty[] }>(
        `${BASE_URL}/v2/professor/active?language=en`,
      ),
    ]);

    return {
      groups: { ko: groupsKo, en: groupsEn },
      professors: { ko: professorsKo.professors, en: professorsEn.professors },
    };
  },
  component: ResearchLabCreate,
});
