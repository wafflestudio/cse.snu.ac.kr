import { Info } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { useLanguage } from '~/hooks/useLanguage';
import useIsMobile from '~/hooks/useResponsive';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import AddCourseModal from '~/routes/academics/components/courses/AddCourseModal';
import CourseCardGrid from '~/routes/academics/components/courses/CourseCardGrid';
import CourseDetailModal from '~/routes/academics/components/courses/CourseDetailModal';
import CourseList from '~/routes/academics/components/courses/CourseList';
import CourseToolbar from '~/routes/academics/components/courses/CourseToolbar';
import courseTranslations from '~/routes/academics/components/courses/translations.json';
import type { Classification, SortOption, ViewOption } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics';

interface CoursesPageProps {
  courses: Course[];
  studentType: 'undergraduate' | 'graduate';
  hideSortOption?: boolean;
}

const VIEW_OPTIONS: ViewOption[] = ['카드형', '목록형'];
const SORT_OPTIONS: SortOption[] = ['학년', '교과목 구분', '학점'];

const classificationToIndexMap: { [key in Classification]: number } = {
  전공필수: 0,
  전공선택: 1,
  교양: 2,
};

const META = {
  undergraduate: {
    ko: {
      title: '교과과정',
      description:
        '서울대학교 컴퓨터공학부 학부 교과과정을 안내합니다. 전공필수, 전공선택, 교양 과목 등의 정보를 확인하실 수 있습니다.',
    },
    en: {
      title: 'Courses',
      description:
        'Undergraduate courses at the Department of Computer Science and Engineering, Seoul National University. Find information on required courses, elective courses, and liberal education courses.',
    },
  },
  graduate: {
    ko: {
      title: '교과과정',
      description:
        '서울대학교 컴퓨터공학부 대학원 교과과정을 안내합니다. 석사 및 박사 과정의 전공 과목 정보를 확인하실 수 있습니다.',
    },
    en: {
      title: 'Courses',
      description:
        'Graduate courses at the Department of Computer Science and Engineering, Seoul National University. Find information on courses for masters and doctoral programs.',
    },
  },
};

export default function CoursesPage({
  courses,
  studentType,
  hideSortOption,
}: CoursesPageProps) {
  const { t, isEnglish, locale } = useLanguage(courseTranslations);
  const subNav = useAcademicsSubNav();
  const title = t('교과과정');
  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const meta = META[studentType][locale];
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  const viewOption = getViewOption(searchParams);
  const sortOption = getSortOption(searchParams);
  const shouldHideSort = hideSortOption ?? studentType === 'graduate';
  const effectiveSortOption = shouldHideSort ? '학년' : sortOption;
  const effectiveViewOption = isMobile ? '목록형' : viewOption;

  const sortedCourses = getSortedCourses(courses, effectiveSortOption);

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 ml-auto flex justify-end">
          <Button
            variant="solid"
            tone="brand"
            onClick={() => setIsAddCourseModalOpen(true)}
          >
            새 교과목
          </Button>
        </div>
      </LoginVisible>
      <h4 className="mb-8 text-[17px] font-bold sm:pl-5">{t('교과목 정보')}</h4>
      <CourseToolbar
        hideViewOption={isMobile}
        hideSortOption={shouldHideSort}
      />
      {isEnglish && <ClassificationDescription />}
      {effectiveViewOption === '카드형' ? (
        <CourseCardGrid
          courses={sortedCourses}
          selectedOption={effectiveSortOption}
        />
      ) : (
        <CourseList
          courses={sortedCourses.flat()}
          onSelectCourse={setSelectedCourse}
        />
      )}
      <CourseDetailModal
        course={selectedCourse}
        open={Boolean(selectedCourse)}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      />
      {isAddCourseModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseModalOpen(false)}
          studentType={studentType}
        />
      )}
    </PageLayout>
  );
}

const getViewOption = (params: URLSearchParams): ViewOption => {
  const view = params.get('view');
  return VIEW_OPTIONS.includes(view as ViewOption)
    ? (view as ViewOption)
    : '목록형';
};

const getSortOption = (params: URLSearchParams): SortOption => {
  const sort = params.get('sort');
  return SORT_OPTIONS.includes(sort as SortOption)
    ? (sort as SortOption)
    : '학년';
};

function ClassificationDescription() {
  return (
    <div className="mb-3 ml-5 flex items-center gap-1.5 text-sm text-neutral-400">
      <Info className="h-[22px] w-[22px]" strokeWidth={1.5} />
      <span className="pt-px">
        RM: Required course for Major&nbsp;&nbsp;/&nbsp;&nbsp;EM: Elective
        course for Major&nbsp;&nbsp;/&nbsp;&nbsp;LE: Liberal Education course
      </span>
    </div>
  );
}

const getSortedCourses = (courses: Course[], sortOption: SortOption) => {
  const sortedCourses: Course[][] = [];

  const courseToIndexFnMap: {
    [key in SortOption]: (course: Course) => number;
  } = {
    학년: (course) => Math.max(0, course.grade - 1),
    '교과목 구분': (course) =>
      classificationToIndexMap[course.ko.classification],
    학점: (course) => course.credit - 1,
  };

  courses.forEach((course) => {
    const index = courseToIndexFnMap[sortOption](course);
    if (!sortedCourses[index]) {
      sortedCourses[index] = [];
    }
    sortedCourses[index].push(course);
  });

  return sortedCourses;
};
