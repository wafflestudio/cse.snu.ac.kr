import { useRouter } from '@tanstack/react-router';
import { Bookmark } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import Form from '@/components/form/Form';
import Button from '@/components/ui/Button';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import {
  CLASSIFICATION,
  type ClassificationEn,
  GRADE,
} from '@/routes/$locale/academics/-constants';
import type { Course } from '@/types/api';
import { api } from '@/utils/api';

const CREDIT = [1, 2, 3, 4];

export default function CourseEditor({
  defaultValues,
  toggleEditMode,
  setCourse,
}: {
  defaultValues: Course;
  toggleEditMode: () => void;
  setCourse: (course: Course) => void;
}) {
  const { t } = useLanguage({
    '교과목을 수정했습니다.': 'Course updated successfully.',
    '교과목을 수정하지 못했습니다.': 'Failed to update course.',
    '교과목 코드는 수정할 수 없습니다.': 'Course code cannot be changed.',
    교과목명: 'Course Name',
    '교과목 설명': 'Course Description',
    취소: 'Cancel',
    저장: 'Save',
    '교과목명을 입력해 주세요.': 'Enter the course name.',
    '교과목 설명을 입력해 주세요.': 'Enter the course description.',
    영문: 'English',
  });
  const router = useRouter();

  const formMethods = useForm<Course>({
    defaultValues,
    shouldFocusError: false,
  });
  const { setValue, handleSubmit } = formMethods;
  const gradeDropdownContents =
    defaultValues.grade === 0 ? [GRADE[0]] : GRADE.slice(1);

  const onSubmit = async (course: Course) => {
    try {
      await api.put(`v2/academics/courses`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      setCourse(course);
      toggleEditMode();
      toast.success(t('교과목을 수정했습니다.'));
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      {/* type-section 은 아이콘 크기(옆 교과목명과 같은 섹션 제목 역할)를 정한다 — 입력칸들은 제 글자 역할을 따로 갖는다. */}
      <h4 className="flex flex-wrap items-center gap-2 type-section">
        <Bookmark className="text-main-orange" fill="currentColor" />
        <Form.Text
          name="ko.name"
          size="md"
          placeholder={t('교과목명')}
          options={{
            required: { value: true, message: t('교과목명을 입력해 주세요.') },
          }}
        />
        <button
          type="button"
          className="h-8 w-[120px] cursor-default rounded-xs border border-neutral-300 pl-2 text-left type-ui text-neutral-500"
          onClick={() => toast.error(t('교과목 코드는 수정할 수 없습니다.'))}
        >
          {defaultValues.code}
        </button>
        <Form.Dropdown
          contents={Object.keys(CLASSIFICATION).map((value) => ({
            label: value,
            value,
          }))}
          name="ko.classification"
          onChange={(value) =>
            setValue('en.classification', value as ClassificationEn)
          }
        />
        <Form.Dropdown
          contents={CREDIT.map((value) => ({ label: value.toString(), value }))}
          name="credit"
        />
        <Form.Dropdown
          contents={gradeDropdownContents.map((label, idx) => ({
            value: defaultValues.grade === 0 ? 0 : idx + 1,
            label,
          }))}
          name="grade"
        />
      </h4>
      <Form.TextArea
        name="ko.description"
        placeholder={t('교과목 설명')}
        options={{
          required: { value: true, message: t('교과목 설명을 입력해 주세요.') },
        }}
      />
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="type-label text-neutral-500">{t('영문')}</span>
          <Form.Text
            name="en.name"
            size="md"
            placeholder="course name"
            options={{
              required: {
                value: true,
                message: '영문 교과목명을 입력해 주세요.',
              },
            }}
          />
        </div>
        <Form.TextArea
          name="en.description"
          placeholder="course description"
          options={{
            required: {
              value: true,
              message: '영문 교과목 설명을 입력해 주세요.',
            },
          }}
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={toggleEditMode}>
          {t('취소')}
        </Button>
        <Button variant="primary" onClick={handleSubmit(onSubmit)}>
          {t('저장')}
        </Button>
      </div>
    </FormProvider>
  );
}
