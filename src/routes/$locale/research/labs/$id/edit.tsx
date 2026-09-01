import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import ResearchLabEditor, {
  type ResearchLabFormData,
} from '@/routes/$locale/research/labs/-components/ResearchLabEditor';
import type {
  ResearchGroup,
  ResearchLabWithLanguage,
  SimpleFaculty,
} from '@/types/api';
import { api } from '@/utils/api';
import { ApiFormData } from '@/utils/apiFormData';

function ResearchLabEdit() {
  const loaderData = Route.useLoaderData();

  const { lab, groups, professors } = loaderData;
  const navigate = useNavigate();
  const { localizedPath } = useLanguage({});

  const defaultValues: ResearchLabFormData = {
    ko: {
      name: lab.ko.name,
      description: lab.ko.description ?? '',
      groupId: lab.ko.group?.id ?? null,
      professorId: lab.ko.professors[0]?.id ?? null,
      location: lab.ko.location || '',
    },
    en: {
      name: lab.en.name,
      description: lab.en.description ?? '',
      groupId: lab.en.group?.id ?? null,
      professorId: lab.en.professors[0]?.id ?? null,
      location: lab.en.location || '',
    },
    acronym: lab.ko.acronym ?? '',
    tel: lab.ko.tel || '',
    websiteURL: lab.ko.websiteURL || '',
    youtube: lab.ko.youtube || '',
    pdf: lab.ko.pdf ? [{ type: 'UPLOADED_FILE', file: lab.ko.pdf }] : [],
  };

  const onSubmit = async ({ ko, en, ...common }: ResearchLabFormData) => {
    const removePdf = lab.ko.pdf !== null && common.pdf.length === 0;

    const formData = new ApiFormData();

    formData.appendJson('request', {
      ko: {
        ...ko,
        ...common,
        professorIds: ko.professorId ? [ko.professorId] : [],
        removePdf,
      },
      en: {
        ...en,
        ...common,
        professorIds: en.professorId ? [en.professorId] : [],
        removePdf,
      },
    });

    formData.appendIfLocal('pdf', common.pdf);

    try {
      await api.put(`v2/research/lab/${lab.ko.id}/${lab.en.id}`, {
        body: formData,
      });

      toast.success('연구실을 수정했습니다.');
      navigate({ to: localizedPath(`/research/labs/${lab.ko.id}`) });
    } catch {
      toast.error('수정에 실패했습니다.');
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`v2/research/lab/${lab.ko.id}/${lab.en.id}`);

      toast.success('연구실을 삭제했습니다.');
      navigate({ to: localizedPath('/research/labs') });
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout title="연구실 편집" titleSize="xl" padding="default">
      <ResearchLabEditor
        groups={groups}
        professors={professors}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute('/$locale/research/labs/$id/edit')({
  loader: async ({ params }) => {
    const id = parseInt(params.id, 10);

    if (!id || Number.isNaN(id)) {
      throw new Response('Invalid ID', { status: 400 });
    }

    const [lab, groupsKo, groupsEn, professorsKo, professorsEn] =
      await Promise.all([
        api.get(`v2/research/lab/${id}`).json<ResearchLabWithLanguage>(),
        api.get(`v2/research/groups?language=ko`).json<ResearchGroup[]>(),
        api.get(`v2/research/groups?language=en`).json<ResearchGroup[]>(),
        api
          .get(`v2/professor/active?language=ko`)
          .json<{ description: string; professors: SimpleFaculty[] }>(),
        api
          .get(`v2/professor/active?language=en`)
          .json<{ description: string; professors: SimpleFaculty[] }>(),
      ]);

    if (!lab || !lab.ko || !lab.en) {
      throw new Response('Lab not found', { status: 404 });
    }

    return {
      lab,
      groups: { ko: groupsKo, en: groupsEn },
      professors: { ko: professorsKo.professors, en: professorsEn.professors },
    };
  },
  component: ResearchLabEdit,
});
