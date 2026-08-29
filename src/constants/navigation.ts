export interface NavItem {
  key: string; // unique, 번역 키 (예: "소개")
  path?: string; // 페이지 경로 (있으면 Link, 없으면 카테고리 헤더)
  children?: NavItem[]; // 하위 메뉴
}

export const navigationTree: NavItem[] = [
  {
    key: '소개',
    path: '/about',
    children: [
      { key: '학부 소개', path: '/about/overview' },
      { key: '학부장 인사말', path: '/about/greetings' },
      { key: '연혁', path: '/about/history' },
      { key: '졸업생 진로', path: '/about/future-careers' },
      { key: '동아리 소개', path: '/about/student-clubs' },
      { key: '시설 안내', path: '/about/facilities' },
      { key: '연락처', path: '/about/contact' },
      { key: '찾아오는 길', path: '/about/directions' },
    ],
  },
  {
    key: '소식',
    path: '/community',
    children: [
      { key: '공지사항', path: '/community/notice' },
      { key: '새 소식', path: '/community/news' },
      { key: '세미나', path: '/community/seminar' },
      {
        key: '신임교수초빙',
        path: '/community/faculty-recruitment',
      },
    ],
  },
  {
    key: '구성원',
    path: '/people',
    children: [
      { key: '교수진', path: '/people/faculty' },
      { key: '역대 교수진', path: '/people/emeritus-faculty' },
      { key: '행정직원', path: '/people/staff' },
    ],
  },
  {
    key: '연구·교육',
    path: '/research',
    children: [
      { key: '연구·교육 스트림', path: '/research/groups' },
      { key: '연구 센터', path: '/research/centers' },
      { key: '연구실 목록', path: '/research/labs' },
      {
        key: 'Top Conference List',
        path: '/research/top-conference-list',
      },
    ],
  },
  {
    key: '입학',
    path: '/admissions',
    children: [
      {
        key: '학부',
        children: [
          {
            key: '수시 모집',
            path: '/admissions/undergraduate/early-admission',
          },
          {
            key: '정시 모집',
            path: '/admissions/undergraduate/regular-admission',
          },
        ],
      },
      {
        key: '대학원',
        children: [
          {
            key: '전기/후기 모집',
            path: '/admissions/graduate/regular-admission',
          },
        ],
      },
      {
        key: 'International',
        children: [
          {
            key: 'Undergraduate',
            path: '/admissions/international/undergraduate',
          },
          {
            key: 'Graduate',
            path: '/admissions/international/graduate',
          },
          {
            key: 'Exchange/Visiting Program',
            path: '/admissions/international/exchange',
          },
          {
            key: 'Scholarships',
            path: '/admissions/international/scholarships',
          },
        ],
      },
    ],
  },
  {
    key: '학사 및 교과',
    path: '/academics',
    children: [
      {
        key: '학부',
        children: [
          {
            key: '학부 안내',
            path: '/academics/undergraduate/guide',
          },
          {
            key: '교과과정',
            path: '/academics/undergraduate/courses',
          },
          {
            key: '전공 이수 표준 형태',
            path: '/academics/undergraduate/curriculum',
          },
          {
            key: '필수 교양 과목',
            path: '/academics/undergraduate/general-studies-requirements',
          },
          {
            key: '졸업 규정',
            path: '/academics/undergraduate/degree-requirements',
          },
          {
            key: '교과목 변경 내역',
            path: '/academics/undergraduate/course-changes',
          },
          {
            key: '장학 제도',
            path: '/academics/undergraduate/scholarship',
          },
        ],
      },
      {
        key: '대학원',
        children: [
          {
            key: '대학원 안내',
            path: '/academics/graduate/guide',
          },
          {
            key: '교과과정',
            path: '/academics/graduate/courses',
          },
          {
            key: '교과목 변경 내역',
            path: '/academics/graduate/course-changes',
          },
          {
            key: '장학 제도',
            path: '/academics/graduate/scholarship',
          },
        ],
      },
    ],
  },
  {
    key: '시설 예약',
    path: '/reservations',
    children: [
      {
        key: '시설 예약 안내',
        path: '/reservations/introduction',
      },
      {
        key: '세미나실 예약',
        children: [
          {
            key: '301-417 (20석)',
            path: '/reservations/seminar-room/301-417',
          },
          {
            key: '301-MALDIVES (301-521, 11석)',
            path: '/reservations/seminar-room/301-521',
          },
          {
            key: '301-HAWAII (301-551-4, 20석)',
            path: '/reservations/seminar-room/301-551-4',
          },
          {
            key: '301-BAEKDU (301-552-1, 4석)',
            path: '/reservations/seminar-room/301-552-1',
          },
          {
            key: '301-ALPS (301-552-2, 5석)',
            path: '/reservations/seminar-room/301-552-2',
          },
          {
            key: '301-SANTORINI (301-552-3, 4석)',
            path: '/reservations/seminar-room/301-552-3',
          },
          {
            key: '301-JEJU (301-553-6, 6석)',
            path: '/reservations/seminar-room/301-553-6',
          },
          {
            key: '301-교수회의실 (301-317, 20석)',
            path: '/reservations/seminar-room/301-317',
          },
          {
            key: '302-308 (46석)',
            path: '/reservations/seminar-room/302-308',
          },
          {
            key: '302-309-1 (48석)',
            path: '/reservations/seminar-room/302-309-1',
          },
          {
            key: '302-309-2 (8석)',
            path: '/reservations/seminar-room/302-309-2',
          },
          {
            key: '302-309-3 (8석)',
            path: '/reservations/seminar-room/302-309-3',
          },
        ],
      },
      {
        key: '실습실 예약',
        children: [
          {
            key: '소프트웨어 실습실 (302-311-1, 102석)',
            path: '/reservations/lab/302-311-1',
          },
          {
            key: '하드웨어 실습실 (302-310-2, 30석)',
            path: '/reservations/lab/302-310-2',
          },
        ],
      },
      {
        key: '공과대학 강의실 예약',
        children: [
          {
            key: '302-208 (116석)',
            path: '/reservations/lecture-room/302-208',
          },
          {
            key: '302-209 (90석)',
            path: '/reservations/lecture-room/302-209',
          },
        ],
      },
    ],
  },
];
