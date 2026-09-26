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
    use: '날짜·작성자·조회수, 도움말, 짧은 설명, breadcrumb, 뱃지, 달력 칸 같은 가장 작은 글자',
    preview: 'type-meta text-neutral-500',
  },
];

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
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
          13·14·16·20·24·32 여섯 가지, 굵기는 400·500·700 세 가지다. 12px 이하는
          쓰지 않는다(한글이 너무 작다).
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
          예외(그래픽 역할): 카테고리 대제목 64(모바일 32,{' '}
          <code>type-display</code>), 메인 슬로건 Gowun Batang, 404 숫자. 이 셋
          말고는 위 단계 밖 크기를 쓰지 않는다.
        </p>
      </Sub>

      <Sub title="줄간격">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            줄간격은 여러 줄로 읽는 본문(<code>type-body</code>)에만 준다:
            14px에 28px.
          </li>
          <li>
            나머지 역할(제목·UI 글자·라벨·보조)은 줄높이 1.2다. 사이트
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

      <Sub title="줄바꿈 — 어절 단위">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            사이트 전체(에디터 본문 포함)가 어절 단위로 줄을 바꾼다(
            <code>word-break: keep-all</code>, <code>app.css</code>의 body).
            한국어가 "있습니/다"처럼 글자 중간에서 끊기지 않는다. 요소마다{' '}
            <code>break-keep</code>을 붙이지 않는다.
          </li>
          <li>
            한 어절이 줄보다 길 때(URL·메일)만 끊는다(
            <code>overflow-wrap: break-word</code>). 좁은 칸에서 긴 URL이 넘치면
            그 요소에만 <code>wrap-anywhere</code>. 영어 단어까지 자르는{' '}
            <code>break-all</code>은 쓰지 않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="위계">
        <p>안에 든 것이 그것을 묶는 제목보다 크거나 굵지 않게 역할을 고른다.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            본문 안 섹션 제목은 어느 화면이든 <code>type-section</code>(20 ·
            700) 하나다. 16·17·18px이나 600 굵기로 따로 만들지 않는다.
          </li>
          <li>
            인물 이름은 항목 제목(<code>type-item</code>)이다. 그 이름을 담은
            섹션 제목(연락처 등)보다 작다.
          </li>
          <li>
            게시물 상세 제목은 섹션 제목(<code>type-section</code>)이다. 목록을
            나누는 연도 같은 소제목은 항목 제목(<code>type-item</code>)이다.
          </li>
          <li>
            편집 폼의 묶음 제목은 항목 제목(<code>type-item</code>), 필드명과
            검색 라벨은 라벨(<code>type-label</code>)이다.
          </li>
        </ul>
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
