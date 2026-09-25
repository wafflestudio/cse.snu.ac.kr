import type { ReactNode } from 'react';

type Level = {
  role: string;
  cls: string;
  spec: string;
  sample: string;
  use: string;
  preview: string;
};

const LEVELS: Level[] = [
  {
    role: '페이지 제목',
    cls: 'type-page-title',
    spec: '32 · 700 (모바일 24)',
    sample: '학부 소개',
    use: '페이지 맨 위 어두운 제목 영역(PageTitle)',
    preview: 'type-page-title',
  },
  {
    role: '메인 섹션 제목',
    cls: 'type-headline',
    spec: '24 · 700',
    sample: '공지사항',
    use: '메인 화면의 공지·새 소식·링크 섹션 제목만',
    preview: 'type-headline',
  },
  {
    role: '섹션 제목',
    cls: 'type-section',
    spec: '20 · 700',
    sample: '연구 분야',
    use: '본문 안 큰 구획, 게시물 상세 제목, 모달 제목',
    preview: 'type-section',
  },
  {
    role: '항목 제목',
    cls: 'type-item',
    spec: '16 · 700',
    sample: '2026학년도 후기 대학원 입학 설명회',
    use: '피드형 목록(새 소식·세미나·검색)·카드·인물 이름·소제목',
    preview: 'type-item',
  },
  {
    role: '본문',
    cls: 'type-body',
    spec: '14 · 400 · 줄높이 28',
    sample:
      '컴퓨터공학부는 컴퓨터 과학과 공학의 기초 이론부터 응용까지 폭넓게 교육합니다.',
    use: '여러 줄로 읽는 문단, 설명 문단',
    preview: 'type-body',
  },
  {
    role: 'UI 글자',
    cls: 'type-ui',
    spec: '14 · 400',
    sample: '2026학년도 1학기 수강신청 안내',
    use: '한 줄 UI 글자: 표형 목록의 행 제목, 표 셀, 내비·푸터 링크, 드롭다운 항목, 입력 글자',
    preview: 'type-ui',
  },
  {
    role: '라벨',
    cls: 'type-label',
    spec: '14 · 500',
    sample: '제목 · 작성자 · 첨부파일',
    use: '폼 필드명, 표 헤더, 탭, 버튼 글자',
    preview: 'type-label',
  },
  {
    role: '보조',
    cls: 'type-meta',
    spec: '13 · 400',
    sample: '2026/09/25 · 행정실 · 조회수 1,024',
    use: '날짜·작성자·조회수, 도움말, 짧은 설명',
    preview: 'type-meta text-neutral-500',
  },
  {
    role: '캡션',
    cls: 'type-caption',
    spec: '12 · 400',
    sample: '필수 입력 항목입니다',
    use: '아주 작은 표시, breadcrumb(모바일)',
    preview: 'type-caption text-neutral-500',
  },
];

// 지금 콘텐츠 섹션 제목에 쓰이는 조합(조사 결과). 모두 섹션 제목 하나로 모은다.
const SECTION_VARIANTS = [
  ['16 · 700', 'text-base font-bold', '교수진 연락처(PeopleInfoList)'],
  ['17 · 700', 'text-[17px] font-bold', '교과목(CoursesPage)'],
  ['18 · 700', 'text-lg font-bold', '졸업 규정(degree-requirements)'],
  ['20 · 700', 'text-[20px] font-bold', '장학·교수진·세미나 연도'],
  [
    '16 → 24 · 700',
    'text-base font-bold sm:text-[24px]',
    '선택형 상세(SelectionTitle)',
  ],
  ['24 · 700', 'text-2xl font-bold', '예약 달력'],
  ['16 · 600', 'text-base font-semibold', '학부 소개·찾아오는 길'],
];

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Pair({ before, after }: { before: ReactNode; after: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-sm text-neutral-500">정리 전</p>
        {before}
      </div>
      <div>
        <p className="mb-1 text-sm text-neutral-500">정리 후</p>
        {after}
      </div>
    </div>
  );
}

export function TypeSection() {
  return (
    <div className="space-y-12 text-md leading-7">
      <Sub title="단계">
        <p>
          역할마다 크기·굵기·줄높이를 한 벌로 묶은 클래스(<code>type-*</code>)가
          있다. 화면을 만들 때는 역할을 고르고 그 클래스 하나만 쓴다.
          크기·굵기·줄높이 클래스를 따로 쓰지 않는다. 색은 따로 붙인다. 크기는
          12·13·14·16·20·24·32 일곱 가지, 굵기는 400·500·700 세 가지다.
        </p>
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {LEVELS.map((l) => (
            <div
              key={l.role}
              className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
            >
              <div>
                <p className="font-medium">{l.role}</p>
                <p className="text-sm text-neutral-500">{l.spec}</p>
                <code className="text-xs text-neutral-500">{l.cls}</code>
              </div>
              <div>
                <p className={l.preview}>{l.sample}</p>
                <p className="mt-1 text-xs text-neutral-500">{l.use}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          예외(그래픽 역할): 카테고리 대제목 64(모바일 32), 메인 슬로건 Gowun
          Batang, 404 숫자. 이 셋 말고는 위 단계 밖 크기를 쓰지 않는다.
        </p>
      </Sub>

      <Sub title="줄간격">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            줄간격은 여러 줄로 읽는 본문(<code>type-body</code>)에만 준다:
            14px에 28px. 이 사이트의 기존 값이다.
          </li>
          <li>
            나머지 역할(제목·UI 글자·라벨·보조·캡션)은 줄높이 1.2다. 사이트
            기본값이고, 한 줄짜리 컴포넌트 글자가 위아래로 부풀지 않는다.
          </li>
          <li>
            여러 줄로 읽히는 작은 보조 글(카드 설명·요약)에만{' '}
            <code>type-meta leading-normal</code>
            (1.5)을 쓴다.
          </li>
          <li>
            버튼·컨트롤의 높이는 줄높이가 아니라 <code>h-*</code>로 정한다.
          </li>
        </ul>
      </Sub>

      <Sub title="정리 전: 섹션 제목 7가지">
        <p>
          본문 안 섹션 제목이 지금 7가지 조합이다. 모두 섹션 제목(20 · 700)
          하나로 모은다.
        </p>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {SECTION_VARIANTS.map(([spec, cls, where]) => (
            <div key={spec + where} className="flex items-baseline gap-3">
              <span className={cls}>연구 분야</span>
              <span className="text-xs text-neutral-500">
                {spec} — {where}
              </span>
            </div>
          ))}
        </div>
      </Sub>

      <Sub title="뒤집힌 위계 바로잡기">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="font-medium">교수진: 이름이 섹션 제목보다 크다</p>
            <Pair
              before={
                <div>
                  <p className="text-base font-bold">연락처</p>
                  <p className="text-[18px] font-bold">홍길동 교수</p>
                </div>
              }
              after={
                <div>
                  <p className="text-[20px] font-bold leading-8">연락처</p>
                  <p className="text-base font-bold leading-6">홍길동 교수</p>
                </div>
              }
            />
          </div>
          <div className="space-y-2">
            <p className="font-medium">
              게시물 상세 제목(20 · 600)이 세미나 연도 제목(20 · 700)보다 약하다
            </p>
            <Pair
              before={
                <div className="flex gap-6">
                  <span className="text-[20px] font-semibold">
                    2026 입학 설명회
                  </span>
                  <span className="text-[20px] font-bold">2026</span>
                </div>
              }
              after={
                <div className="flex gap-6">
                  <span className="text-[20px] font-bold">
                    2026 입학 설명회
                  </span>
                  <span className="text-base font-bold">2026</span>
                </div>
              }
            />
            <p className="text-sm text-neutral-500">
              연도는 목록을 나누는 소제목이라 항목 제목(16 · 700)으로 내린다.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">
              편집 폼: 묶음 제목(14 · 600)과 필드명(14 · 500)이 거의 같고, 검색
              라벨(14 · 700)이 더 굵다
            </p>
            <Pair
              before={
                <div className="space-y-1">
                  <p className="text-md font-semibold">기본 정보</p>
                  <p className="text-md font-medium">제목</p>
                  <p className="text-md font-bold">검색어</p>
                </div>
              }
              after={
                <div className="space-y-1">
                  <p className="text-base font-bold leading-6">기본 정보</p>
                  <p className="text-md font-medium leading-5">제목</p>
                  <p className="text-md font-medium leading-5">검색어</p>
                </div>
              }
            />
          </div>
          <p className="text-sm text-neutral-500">
            메인 링크 섹션의 제목이 항목보다 약한 문제는 3-6 메인에서 배치와
            함께 고친다.
          </p>
        </div>
      </Sub>

      <Sub title="목록의 행 제목">
        <p>
          표형 목록(공지·연구실·교과목)은 데스크톱에서 표로 보여 행 제목이 UI
          글자(type-ui)고, 모바일에서는 카드처럼 쌓여 항목 제목(type-item)이다:{' '}
          <code>type-item sm:type-ui</code>. 관리자 표는 데스크톱 전용이라 UI
          글자만. 피드형 목록(새 소식·세미나·검색 결과)은 모든 폭에서 항목
          제목이다.
        </p>
      </Sub>
    </div>
  );
}
