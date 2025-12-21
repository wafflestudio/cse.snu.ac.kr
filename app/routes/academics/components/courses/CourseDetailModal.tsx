import Modal from '~/components/common/Modal';
import { useLanguage } from '~/hooks/useLanguage';
import { GRADE } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics/courses';
import BookmarkIcon from '../../assets/bookmark_icon.svg?react';
import translations from './translations.json';

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
}

export default function CourseDetailModal({
  course,
  open,
  onClose,
}: CourseDetailModalProps) {
  const { t, locale } = useLanguage(translations);
  const language = locale === 'en' ? 'en' : 'ko';

  if (!course) return null;

  return (
    <Modal open={open} onClose={onClose} ariaLabel={t('교과목 상세')}>
      <div className="flex flex-col gap-4">
        <CourseHeader
          name={course[language].name}
          code={course.code}
          classification={course[language].classification}
          credit={`${course.credit}${t('학점')}`}
          grade={t(GRADE[course.grade])}
        />
        <p className="text-md leading-loose">{course[language].description}</p>
      </div>
    </Modal>
  );
}

interface CourseHeaderProps {
  name: string;
  code: string;
  classification: string;
  credit: string;
  grade: string;
}

function CourseHeader({
  name,
  code,
  classification,
  credit,
  grade,
}: CourseHeaderProps) {
  return (
    <h4 className="flex flex-wrap items-center gap-2">
      <BookmarkIcon className="h-[24px] w-[24px]" />
      <span className="font-bold">{name}</span>
      <div className="flex items-center divide-x divide-neutral-200 pt-1 text-sm text-neutral-600 [&_span]:px-2">
        <span>{code}</span>
        <span>{classification}</span>
        <span>{credit}</span>
        <span>{grade}</span>
      </div>
    </h4>
  );
}
