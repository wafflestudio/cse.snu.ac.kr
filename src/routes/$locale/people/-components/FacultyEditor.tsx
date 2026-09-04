import { useState } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import LanguagePicker, {
  type Language,
} from '@/components/form/LanguagePicker';
import {
  FACULTY_STATUS,
  type FacultyStatus,
} from '@/routes/$locale/people/-constants';
import type {
  Faculty,
  ProfessorWithLanguage,
  SimpleResearchLab,
} from '@/types/api';
import type { EditorImage } from '@/types/form';

// 언어별로 다른 값만 언어 탭 안에 둔다. 사진·연락처·소속 연구실·재직 기간은
// 사람에게 하나뿐이라 밖에 있다.
interface FacultyTranslationFields {
  name: string;
  academicRank: string;
  department: string;
  // 호실은 주소 표기라 한/영이 다르다.
  office: string;
  educations: string[];
  researchAreas: string[];
  careers: string[];
}

export interface FacultyFormData {
  status: FacultyStatus;
  image: EditorImage | null;
  phone: string;
  email: string;
  fax: string;
  website: string;
  labId: number | null;
  startDate: Date;
  endDate: Date;
  ko: FacultyTranslationFields;
  en: FacultyTranslationFields;
}

interface FacultyEditorProps {
  // 응답 그대로 받는다 — 공유값이 최상위에 있다.
  defaultValues?: Partial<ProfessorWithLanguage>;
  status?: FacultyStatus;
  labs: { ko: SimpleResearchLab[]; en: SimpleResearchLab[] };
  onCancel: () => void;
  onSubmit: (formData: FacultyFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const translationOf = (faculty?: Faculty | null): FacultyTranslationFields => ({
  name: faculty?.name ?? '',
  academicRank: faculty?.academicRank ?? '',
  department: faculty?.department ?? '',
  office: faculty?.office ?? '',
  educations: faculty?.educations ?? [],
  researchAreas: faculty?.researchAreas ?? [],
  careers: faculty?.careers ?? [],
});

export default function FacultyEditor({
  defaultValues,
  status = 'ACTIVE',
  labs,
  onCancel,
  onSubmit,
  onDelete,
}: FacultyEditorProps) {
  const [language, setLanguage] = useState<Language>('ko');
  const formMethods = useForm<FacultyFormData>({
    defaultValues: {
      status: defaultValues?.status ?? status,
      image: defaultValues?.imageURL
        ? { type: 'UPLOADED_IMAGE', url: defaultValues.imageURL }
        : null,
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      fax: defaultValues?.fax ?? '',
      website: defaultValues?.website ?? '',
      labId: defaultValues?.labId ?? null,
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate)
        : new Date(),
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate)
        : new Date(),
      ko: translationOf(defaultValues?.ko),
      en: translationOf(defaultValues?.en),
    },
    shouldFocusError: false,
  });
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <Form>
        <Fieldset title="구분" spacing="11" titleSpacing="3" required>
          <div className="flex gap-3">
            {Object.entries(FACULTY_STATUS).map(([status, label]) => (
              <Form.Radio
                key={status}
                value={status}
                label={label}
                name="status"
              />
            ))}
          </div>
        </Fieldset>

        <SharedEditor labs={labs.ko} />

        <LanguagePicker selected={language} onChange={setLanguage} />
        {language === 'ko' && <TranslationEditor language="ko" />}
        {language === 'en' && <TranslationEditor language="en" />}

        <Form.Action
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmit)}
          onDelete={onDelete}
        />
      </Form>
    </FormProvider>
  );
}

const SharedEditor = ({ labs }: { labs: SimpleResearchLab[] }) => {
  const { control } = useFormContext<FacultyFormData>();
  const status = useWatch({ control, name: 'status' });

  return (
    <>
      {/* 재직 기간 (역대 교수진만 활성화) */}
      <Form.Section
        title="재직 기간"
        spacing="10"
        titleSpacing="2"
        hidden={status === 'ACTIVE'}
      >
        <div className="flex w-[400px]">
          <Fieldset title="시작 날짜" titleSpacing="2">
            <Form.Date name="startDate" hideTime />
          </Fieldset>
          <Fieldset title="종료 날짜" titleSpacing="2">
            <Form.Date name="endDate" hideTime />
          </Fieldset>
        </div>
      </Form.Section>

      <Fieldset title="사진" spacing="12" titleSpacing="2">
        <label
          htmlFor="image"
          className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
        >
          3:4 비율의 증명사진이 가장 적합합니다.
        </label>
        <Form.Image name="image" />
      </Fieldset>

      {/* 연구실 (현직 교수만 활성화) */}
      <Fieldset
        title="연구실"
        spacing="5"
        titleSpacing="2"
        hidden={status !== 'ACTIVE'}
      >
        <Form.Dropdown
          name="labId"
          contents={[
            { value: null, label: '선택 안 함' },
            ...labs.map((lab) => ({ value: lab.id, label: lab.name })),
          ]}
        />
      </Fieldset>

      <Form.Section title="연락처 정보" titleSpacing="3">
        <div className="flex w-2xl">
          <Fieldset title="전화번호" spacing="5" titleSpacing="2">
            <Form.Text
              name="phone"
              maxWidth="max-w-[20rem]"
              placeholder="예: (02) 880-7302"
            />
          </Fieldset>
          <Fieldset title="팩스" spacing="5" titleSpacing="2">
            <Form.Text name="fax" maxWidth="max-w-[20rem]" />
          </Fieldset>
        </div>

        <Fieldset title="이메일" spacing="5" titleSpacing="2">
          <Form.Text name="email" maxWidth="max-w-[25rem]" />
        </Fieldset>

        <Fieldset title="웹사이트 URL" spacing="5" titleSpacing="2">
          <Form.Text name="website" maxWidth="max-w-[25rem]" />
        </Fieldset>
      </Form.Section>
    </>
  );
};

const TranslationEditor = ({ language }: { language: Language }) => {
  return (
    <>
      <Fieldset title="이름" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.name`}
          maxWidth="max-w-[30rem]"
          options={{
            required: { value: true, message: '이름을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="직함" spacing="5" titleSpacing="2" required>
        <Form.Text
          name={`${language}.academicRank`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 교수, 조교수, 명예교수 등"
          options={{
            required: { value: true, message: '직함을 입력해주세요.' },
          }}
        />
      </Fieldset>

      <Fieldset title="소속" spacing="10" titleSpacing="2">
        <Form.Text
          name={`${language}.department`}
          maxWidth="max-w-[30rem]"
          placeholder="예: 컴퓨터공학부"
        />
      </Fieldset>

      <Fieldset title="위치" spacing="10" titleSpacing="2">
        <Form.Text
          name={`${language}.office`}
          maxWidth="max-w-[20rem]"
          placeholder="예: 301동 504호"
        />
      </Fieldset>

      <Fieldset title="학력" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.educations`}
          placeholder="예: 서울대학교 컴퓨터공학 학사 (2003)"
        />
      </Fieldset>

      <Fieldset title="연구 분야" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.researchAreas`}
          placeholder="예: 스마트 디바이스 최적화"
        />
      </Fieldset>

      <Fieldset title="경력" spacing="2.5" titleSpacing="2">
        <Form.TextList
          name={`${language}.careers`}
          placeholder="예: 2015.09. - 현재: 전임교수, 서울대학교 컴퓨터공학부"
        />
      </Fieldset>
    </>
  );
};
