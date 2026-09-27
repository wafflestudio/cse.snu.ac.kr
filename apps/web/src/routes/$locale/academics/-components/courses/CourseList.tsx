import { ROW_LINK, ROW_LINK_TARGET } from '@/components/ui/rowLink';
import { useLanguage } from '@/hooks/useLanguage';
import { GRADE } from '@/routes/$locale/academics/-constants';
import type { Course } from '@/types/api';
import translations from './translations.json';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export default function CourseList({
  courses,
  onSelectCourse,
}: CourseListProps) {
  return (
    // 칸 틀은 목록에 한 번만 — 머리 행·행이 같이 쓴다(subgrid). 교과목명 칸만 남는 자리.
    <div className="border-y border-neutral-200 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] sm:gap-x-6">
      <Header />
      <ul className="sm:col-span-full sm:grid sm:grid-cols-subgrid">
        {courses.map((course) => (
          <Row
            key={course.code}
            course={course}
            onSelectCourse={onSelectCourse}
          />
        ))}
      </ul>
    </div>
  );
}

const Header = () => {
  const { t } = useLanguage(translations);

  return (
    <h5 className="hidden h-11 items-center whitespace-nowrap border-b border-neutral-200 px-4 type-label text-neutral-950 sm:col-span-full sm:grid sm:grid-cols-subgrid">
      <span>{t('교과목명')}</span>
      <span>{t('교과목 구분')}</span>
      <span>{t('교과목 번호')}</span>
      <span>{t('학점')}</span>
      <span>{t('학년')}</span>
    </h5>
  );
};

const Row = ({
  course,
  onSelectCourse,
}: {
  course: Course;
  onSelectCourse: (course: Course) => void;
}) => {
  const { locale } = useLanguage(translations);
  const { t } = useLanguage(translations);

  return (
    // 행 전체가 교과목명 버튼의 누르는 영역이다(/design-system/list).
    <li
      className={`${ROW_LINK} grid grid-cols-[auto_auto_1fr] grid-rows-3 gap-x-1 gap-y-2 px-6 py-6 type-ui odd:bg-neutral-50 sm:col-span-full sm:h-11 sm:grid-cols-subgrid sm:grid-rows-1 sm:items-center sm:gap-x-6 sm:gap-y-0 sm:px-4 sm:py-0 hover:bg-neutral-100`}
    >
      <span
        className={`order-1 col-span-3 pr-2 type-item sm:col-span-1 sm:type-ui`}
      >
        <button
          className={`text-left group-hover:text-main-orange ${ROW_LINK_TARGET}`}
          type="button"
          onClick={() => onSelectCourse(course)}
        >
          {course[locale].name}
        </button>
      </span>
      <span
        className={`order-3 whitespace-nowrap pr-1 text-neutral-500 sm:order-2 sm:pr-0`}
      >
        {course[locale].classification}
      </span>
      <span
        className={`order-2 col-span-3 text-neutral-500 sm:order-3 sm:col-span-1`}
      >
        {course.code}
      </span>
      <span className={`order-5 text-neutral-500 sm:order-4`}>
        {course.credit}
        <span className="sm:hidden">{t('학점')}</span>
      </span>
      <span
        className={`order-4 whitespace-nowrap pr-1 text-neutral-500 sm:order-5 sm:pr-0`}
      >
        {t(GRADE[course.grade])}
      </span>
    </li>
  );
};
