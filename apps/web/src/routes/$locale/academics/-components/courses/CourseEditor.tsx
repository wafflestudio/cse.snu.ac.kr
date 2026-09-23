import { useRouter } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FieldErrorMessage,
  FieldErrorScope,
} from '@/components/form/FieldError';
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
import BookmarkIcon from './assets/bookmark_icon.svg?react';

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
    '교과목 코드는 수정할 수 없습니다': 'Course code cannot be modified',
    교과목명: 'Course Name',
    '교과목 설명': 'Course Description',
    '한국어 교과목명을 입력해 주세요.': 'Please enter the Korean course name.',
    '한국어 교과목 설명을 입력해 주세요.':
      'Please enter the Korean course description.',
    '영어 교과목명을 입력해 주세요.': 'Please enter the English course name.',
    '영어 교과목 설명을 입력해 주세요.':
      'Please enter the English course description.',
    취소: 'Cancel',
    확인: 'Confirm',
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
      <div className="flex flex-wrap items-center gap-2">
        <BookmarkIcon />
        <FieldErrorScope name="ko.name">
          <div className="flex w-[180px] flex-col">
            <Form.Text
              name="ko.name"
              maxWidth="w-full"
              placeholder={t('교과목명')}
              options={{
                required: {
                  value: true,
                  message: t('한국어 교과목명을 입력해 주세요.'),
                },
              }}
            />
            <FieldErrorMessage name="ko.name" />
          </div>
        </FieldErrorScope>
        <button
          type="button"
          className="h-8 w-[120px] cursor-default rounded-sm border border-neutral-300 pl-2 text-left text-sm leading-[31px] text-neutral-400"
          onClick={() => toast.error(t('교과목 코드는 수정할 수 없습니다'))}
        >
          {defaultValues.code}
        </button>
        <Form.Dropdown
          contents={Object.keys(CLASSIFICATION).map((value) => ({
            label: value,
            value,
          }))}
          name="ko.classification"
          borderStyle="border-neutral-300"
          height="h-8"
          width="w-[94px]"
          onChange={(value) =>
            setValue('en.classification', value as ClassificationEn)
          }
        />
        <Form.Dropdown
          contents={CREDIT.map((value) => ({ label: value.toString(), value }))}
          name="credit"
          borderStyle="border-neutral-300"
          height="h-8"
        />
        <Form.Dropdown
          contents={gradeDropdownContents.map((label, idx) => ({
            value: defaultValues.grade === 0 ? 0 : idx + 1,
            label,
          }))}
          name="grade"
          borderStyle="border-neutral-300"
          height="h-8"
          width="w-[90px]"
        />
      </div>
      <FieldErrorScope name="ko.description">
        <div className="flex flex-col">
          <Form.TextArea
            name="ko.description"
            placeholder={t('교과목 설명')}
            options={{
              required: {
                value: true,
                message: t('한국어 교과목 설명을 입력해 주세요.'),
              },
            }}
          />
          <FieldErrorMessage name="ko.description" />
        </div>
      </FieldErrorScope>
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="text-md text-neutral-400">{t('영문')}</span>
          <FieldErrorScope name="en.name">
            <div className="flex w-[308px] flex-col">
              <Form.Text
                name="en.name"
                maxWidth="w-full"
                placeholder="course name"
                options={{
                  required: {
                    value: true,
                    message: t('영어 교과목명을 입력해 주세요.'),
                  },
                }}
              />
              <FieldErrorMessage name="en.name" />
            </div>
          </FieldErrorScope>
        </div>
        <FieldErrorScope name="en.description">
          <Form.TextArea
            name="en.description"
            placeholder="course description"
            options={{
              required: {
                value: true,
                message: t('영어 교과목 설명을 입력해 주세요.'),
              },
            }}
          />
          <FieldErrorMessage name="en.description" />
        </FieldErrorScope>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={toggleEditMode}>
          {t('취소')}
        </Button>
        <Button variant="neutral" onClick={handleSubmit(onSubmit)}>
          {t('확인')}
        </Button>
      </div>
    </FormProvider>
  );
}
