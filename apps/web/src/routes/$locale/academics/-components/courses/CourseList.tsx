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
    <div className="border-b border-neutral-200 lg:ml-5">
      <Header />
      <ul className="lg:divide-y lg:divide-dashed lg:divide-neutral-200">
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

const COURSE_ROW_ITEM_WIDTH = {
  name: 'lg:w-[16rem]',
  classification: 'lg:w-[10rem]',
  code: 'lg:w-[13rem]',
  credit: 'lg:w-[6rem]',
  grade: 'lg:w-[5.25rem]',
} as const;

const Header = () => {
  const { t } = useLanguage(translations);

  return (
    <h5 className="hidden h-11 items-center whitespace-nowrap border-y border-neutral-100 bg-neutral-100 px-4 text-md lg:flex">
      <span className={COURSE_ROW_ITEM_WIDTH.name}>{t('교과목명')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.classification}>
        {t('교과목 구분')}
      </span>
      <span className={COURSE_ROW_ITEM_WIDTH.code}>{t('교과목 번호')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.credit}>{t('학점')}</span>
      <span className={COURSE_ROW_ITEM_WIDTH.grade}>{t('학년')}</span>
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
    <li className="grid grid-cols-[auto_auto_1fr] grid-rows-3 gap-1 px-7 py-6 text-md odd:bg-neutral-50 lg:flex lg:h-14 lg:items-center lg:gap-0 lg:px-4 lg:py-0 lg:odd:bg-white">
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.name} order-1 col-span-3 pr-2 text-base font-semibold lg:text-md lg:font-normal`}
      >
        <button
          className="text-left"
          type="button"
          onClick={() => onSelectCourse(course)}
        >
          {course[locale].name}
        </button>
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.classification} order-3 whitespace-nowrap pr-1 text-neutral-500 lg:order-2 lg:pr-0`}
      >
        {course[locale].classification}
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.code} order-2 col-span-3 text-neutral-500 lg:order-3`}
      >
        {course.code}
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.credit} order-5 text-neutral-500 lg:order-4 lg:pl-2`}
      >
        {course.credit}
        <span className="lg:hidden">{t('학점')}</span>
      </span>
      <span
        className={`${COURSE_ROW_ITEM_WIDTH.grade} order-4 whitespace-nowrap pr-1 text-neutral-500 lg:order-5 lg:pr-0`}
      >
        {t(GRADE[course.grade])}
      </span>
    </li>
  );
};
