import clsx from 'clsx';
import CourseList from '@/routes/$locale/academics/-components/courses/CourseList';
import PeopleProfileInfo from '@/routes/$locale/people/-components/PeopleProfileInfo';
import type { Course } from '@/types/api';
import {
  DocSection,
  DoDont,
  KnownGap,
  Lead,
  RuleList,
  SpecTable,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyCourseList } from '../-legacy/CourseList';
import { LegacyPeopleProfileInfo } from '../-legacy/PeopleProfileInfo';

// 색 페이지. 값은 app.css @theme 이 정본이다. 버튼·입력 칸처럼 부품이 정하는 색은 적지 않는다.
// 화면 목업 대신 역할 표로 보여 준다: 새 경우는 표의 역할 하나로 풀려야 한다.

// 역할별 색: 화면을 짜는 사람이 고르는 색만. [역할, 칩 클래스, 토큰, 쓰는 곳]
const ROLES: [role: string, chip: string, token: string, use: string][] = [
  ['글자', 'bg-neutral-950', 'neutral-950', '제목과 본문'],
  [
    '보조 글자',
    'bg-neutral-500',
    'neutral-500',
    '날짜·조회·출처처럼 훑어보는 정보',
  ],
  [
    '설명 글자',
    'bg-neutral-600',
    'neutral-600',
    '설명 문장, 회색 면 위의 보조 글자',
  ],
  [
    '비활성 글자',
    'bg-neutral-300',
    'neutral-300',
    '누를 수 없는 항목, 자리표시',
  ],
  ['링크', 'bg-link', 'link', '본문 속 링크(늘 밑줄)'],
  [
    '현재 위치',
    'bg-main-orange',
    'main-orange',
    '지금 있는 메뉴, 고른 항목, 태그, 필수 표시',
  ],
  [
    '호버',
    'bg-main-orange-dark',
    'main-orange-dark',
    '이동할 수 있는 글자에 마우스를 올렸을 때',
  ],
  ['오류', 'bg-red-600', 'red-600', '오류 문장과 오류가 난 칸'],
  ['선', 'bg-neutral-200', 'neutral-200', '표 줄, 구분선'],
  ['바탕', 'bg-white', 'white', '페이지 바탕'],
  [
    '옅은 면',
    'bg-neutral-50',
    'neutral-50',
    '표 줄무늬, 바탕과 살짝 구분할 영역',
  ],
  [
    '회색 띠',
    'bg-neutral-100',
    'neutral-100',
    '성격이 다른 내용을 띠로 나눌 때',
  ],
  [
    '어두운 면',
    'bg-neutral-900',
    'neutral-900',
    '카테고리 머리처럼 화면을 여는 영역',
  ],
];

// 전체 팔레트. 값은 app.css @theme 과 같다(red-600 만 Tailwind 기본값).
const PALETTE: [token: string, chip: string, hex: string][] = [
  ['white', 'bg-white', '#ffffff'],
  ['neutral-50', 'bg-neutral-50', '#fafafa'],
  ['neutral-100', 'bg-neutral-100', '#f5f5f5'],
  ['neutral-200', 'bg-neutral-200', '#e5e5e5'],
  ['neutral-300', 'bg-neutral-300', '#d4d4d4'],
  ['neutral-400', 'bg-neutral-400', '#a3a3a3'],
  ['neutral-500', 'bg-neutral-500', '#737373'],
  ['neutral-600', 'bg-neutral-600', '#525252'],
  ['neutral-700', 'bg-neutral-700', '#404040'],
  ['neutral-800', 'bg-neutral-800', '#262626'],
  ['neutral-850', 'bg-neutral-850', '#1e1e1e'],
  ['neutral-900', 'bg-neutral-900', '#171717'],
  ['neutral-950', 'bg-neutral-950', '#0a0a0a'],
  ['chrome-bar', 'bg-chrome-bar', '#2d2d30'],
  ['chrome-menu', 'bg-chrome-menu', '#323235'],
  ['main-orange', 'bg-main-orange', '#ff6914'],
  ['main-orange-dark', 'bg-main-orange-dark', '#e65817'],
  ['link', 'bg-link', '#2867cf'],
  ['red-600', 'bg-red-600', '#e7000b'],
];

// Do · Don't 견본 데이터. 교수 상세 연락처와 교과목 목록.
const CONTACT = [
  { icon: 'distance', label: '302동 314호' },
  { icon: 'phone_in_talk', label: '02-880-0000' },
  { icon: 'mail', label: 'prof@snu.ac.kr', href: 'mailto:prof@snu.ac.kr' },
  {
    icon: 'captive_portal',
    label: 'https://example.snu.ac.kr',
    href: 'https://example.snu.ac.kr',
  },
];

const course = (
  name: string,
  classification: string,
  code: string,
  credit: number,
  grade: number,
): Course => ({
  code,
  credit,
  grade,
  studentType: 'undergraduate',
  ko: { name, classification, description: '' },
  en: { name, classification, description: '' },
});

const COURSES = [
  course('컴퓨터의 개념 및 실습', '전공필수', '4190.101', 3, 1),
  course('자료구조', '전공필수', '4190.210', 3, 2),
];

const LEGACY_COURSES = COURSES.map((c) => ({
  name: c.ko.name,
  classification: c.ko.classification,
  code: c.code,
  credit: c.credit,
  grade: `${c.grade}학년`,
}));

function Chip({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={clsx('shrink-0 border border-neutral-200', className)}
    />
  );
}

function Palette() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-4 type-meta sm:grid-cols-4">
      {PALETTE.map(([token, chip, hex]) => (
        <li key={token} className="flex items-center gap-3">
          <Chip className={clsx('size-10', chip)} />
          <span>
            <span className="block text-neutral-950">{token}</span>
            <span className="block text-neutral-500">{hex}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ColorSection() {
  return (
    <>
      <Lead>글자·링크·면처럼 화면 요소의 역할마다 정해 둔 색입니다.</Lead>

      <DocSection title="역할별 색">
        <SpecTable
          head={['역할', '토큰', '쓰는 곳']}
          rows={ROLES.map(([role, chip, token, use]) => [
            role,
            <span key={token} className="flex items-center gap-3">
              <Chip className={clsx('size-6', chip)} />
              {token}
            </span>,
            use,
          ])}
        />
      </DocSection>

      <DocSection title="원칙">
        <RuleList
          items={[
            '새 요소의 색은 위 표의 역할 중 하나로 정합니다. 맞는 역할이 없으면 팔레트에서 새로 고르기 전에 역할을 먼저 정합니다. 같은 역할이 같은 색이어야 사용자가 색을 보고 뜻을 짐작할 수 있습니다.',
            '누르는 것(버튼·입력 값)은 회색, 상태를 알리는 것(현재 위치·선택·필수)은 주황입니다. 한 색이 두 역할을 맡으면 누를 수 있는 것과 이미 고른 것이 구분되지 않습니다.',
            '읽어야 하는 글자는 반드시 바탕과 4.5:1 이상 대비가 나야 합니다. 그래서 바탕이 짙어지면 글자도 한 단계 짙게, 어두운 면 위에서는 밝게 고릅니다. 비활성 글자와 자리표시만 예외입니다.',
            '색만으로 뜻을 전하지 않습니다. 링크에는 밑줄을, 주황으로 표시한 선택에는 굵기를 함께 씁니다. 색을 구분하기 어려운 사용자도 알아볼 수 있어야 합니다.',
            '면은 위로 올라올수록 밝은 바탕에서는 짙게, 어두운 바탕에서는 밝게 칠해 겹친 순서를 보여 줍니다.',
          ]}
        />
        <KnownGap>
          주황과 흰색의 대비는 2.88:1로 기준 미달이지만 사이트의 인상이라
          유지합니다. 그래서 주황 글자는 짧은 표시(현재 위치·태그)에만 씁니다.
        </KnownGap>
        <KnownGap>
          왼쪽 내비와 모바일 메뉴는 막대가 펼침 패널보다 밝아 면 원칙과
          반대입니다. 원칙대로 바꿔 보니 어색해 되돌렸습니다.
        </KnownGap>
      </DocSection>

      <DocSection title="팔레트">
        <Palette />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <div onClickCapture={stay}>
                <PeopleProfileInfo imageURL={null} items={CONTACT} />
              </div>
            ),
            caption: '링크 색은 흰 바탕과 대비 5.3:1입니다.',
          }}
          bad={{
            example: (
              <LegacyPeopleProfileInfo imageURL={null} items={CONTACT} />
            ),
            caption:
              '예전 교수 상세의 연락처 링크 색(#3c7be4)은 흰 바탕 대비 4.1:1로 기준에 못 미쳤습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              // 데스크톱 표는 다섯 칸이라 견본 칸보다 넓다. 칸 안에서 가로로 밀어 본다.
              <div className="w-full overflow-x-auto">
                <div className="sm:min-w-[32rem]">
                  <CourseList
                    courses={COURSES}
                    onSelectCourse={() => undefined}
                  />
                </div>
              </div>
            ),
            caption: '흰 바탕의 보조 글자는 대비 4.7:1인 neutral-500입니다.',
          }}
          bad={{
            example: (
              <div className="w-full overflow-x-auto">
                <div className="sm:min-w-[32rem]">
                  <LegacyCourseList courses={LEGACY_COURSES} />
                </div>
              </div>
            ),
            caption:
              '예전 교과목 목록의 구분·학점·학년은 neutral-400이라 흰 바탕 대비가 2.5:1에 그쳤습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
