// d1baf83c 의 apps/web/src/routes/$locale/academics/-components/courses/CourseList.tsx 를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 교과목 목록(목록형)의 머리 행과 행.
// 번역·학년 표는 빼고 글자를 그대로 받는다. 데스크톱 칸 폭(16·10·13·6·5.25rem, 합 800px)은
// 견본 칸에 들어가도록 같은 비율의 %로 바꿨다. 보조 칸 글자는 예전 그대로 neutral-400.

interface LegacyCourse {
  name: string;
  classification: string;
  code: string;
  credit: number;
  grade: string;
}

const COURSE_ROW_ITEM_WIDTH = {
  name: 'sm:w-[32%]',
  classification: 'sm:w-[20%]',
  code: 'sm:w-[26%]',
  credit: 'sm:w-[12%]',
  grade: 'sm:w-[10%]',
} as const;

export function LegacyCourseList({ courses }: { courses: LegacyCourse[] }) {
  return (
    <div className="border-b border-neutral-200">
      <h5 className="hidden h-11 items-center whitespace-nowrap border-y border-neutral-100 bg-neutral-100 px-4 text-md sm:flex">
        <span className={COURSE_ROW_ITEM_WIDTH.name}>교과목명</span>
        <span className={COURSE_ROW_ITEM_WIDTH.classification}>
          교과목 구분
        </span>
        <span className={COURSE_ROW_ITEM_WIDTH.code}>교과목 번호</span>
        <span className={COURSE_ROW_ITEM_WIDTH.credit}>학점</span>
        <span className={COURSE_ROW_ITEM_WIDTH.grade}>학년</span>
      </h5>
      <ul className="sm:divide-y sm:divide-dashed sm:divide-neutral-200">
        {courses.map((course) => (
          <li
            key={course.code}
            className="grid grid-cols-[auto_auto_1fr] grid-rows-3 gap-1 px-7 py-6 text-md odd:bg-neutral-50 sm:flex sm:h-14 sm:items-center sm:gap-0 sm:px-4 sm:py-0 sm:odd:bg-white"
          >
            <span
              className={`${COURSE_ROW_ITEM_WIDTH.name} order-1 col-span-3 pr-2 text-base font-semibold sm:text-md sm:font-normal`}
            >
              <button className="text-left" type="button">
                {course.name}
              </button>
            </span>
            <span
              className={`${COURSE_ROW_ITEM_WIDTH.classification} order-3 whitespace-nowrap pr-1 text-neutral-400 sm:order-2 sm:pr-0`}
            >
              {course.classification}
            </span>
            <span
              className={`${COURSE_ROW_ITEM_WIDTH.code} order-2 col-span-3 text-neutral-500 sm:order-3 sm:text-neutral-400`}
            >
              {course.code}
            </span>
            <span
              className={`${COURSE_ROW_ITEM_WIDTH.credit} order-5 text-neutral-400 sm:order-4 sm:pl-2`}
            >
              {course.credit}
              <span className="sm:hidden">학점</span>
            </span>
            <span
              className={`${COURSE_ROW_ITEM_WIDTH.grade} order-4 whitespace-nowrap pr-1 text-neutral-400 sm:order-5 sm:pr-0`}
            >
              {course.grade}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
