import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 글자 페이지 — 크기·굵기·줄높이는 app.css 의 type-* 가 정본이다.

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
    use: '페이지 맨 위 어두운 제목 영역',
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
    use: '피드형 목록·카드·인물 이름·목록을 나누는 소제목·폼 묶음 제목',
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
    use: '한 줄 UI 글자 — 표 셀, 내비·푸터 링크, 드롭다운 항목, 입력 글자',
    preview: 'type-ui',
  },
  {
    role: '라벨',
    cls: 'type-label',
    spec: '14 · 500',
    sample: '제목 · 작성자 · 첨부파일',
    use: '폼 필드명·검색 라벨, 표 헤더, 탭, 버튼 글자',
    preview: 'type-label',
  },
  {
    role: '보조',
    cls: 'type-meta',
    spec: '13 · 400',
    sample: '2026/09/25 · 행정실 · 조회수 1,024',
    use: '날짜·작성자·조회수, 도움말, breadcrumb, 뱃지, 달력 칸 같은 가장 작은 글자',
    preview: 'type-meta text-neutral-500',
  },
];

function Scale() {
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {LEVELS.map((l) => (
        <div
          key={l.role}
          className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <div className="space-y-1">
            <p className="type-label">{l.role}</p>
            <p className="type-meta text-neutral-500">
              {l.spec} · {l.cls}
            </p>
          </div>
          <div className="space-y-2">
            <p className={l.preview}>{l.sample}</p>
            <p className="type-meta text-neutral-500">{l.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const WRAP_SAMPLE =
  '학부 과정에서는 컴퓨터 과학과 공학의 기초 이론부터 응용까지 폭넓게 교육합니다.';

export function TypeSection() {
  return (
    <>
      <Lead>글자는 크기가 아니라 역할을 고른다.</Lead>

      <DocSection title="값">
        <Scale />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '역할(type-*) 하나가 크기·굵기·줄높이를 한 벌로 정한다. 색만 따로 붙인다.',
            '단계 밖 크기는 카테고리 대제목(type-display, 64·모바일 32), 메인 슬로건(Gowun Batang), 404 숫자 셋뿐이다. 12px 이하는 쓰지 않는다.',
            '안에 든 것이 그것을 묶는 제목보다 크거나 굵지 않게 역할을 고른다.',
            '본문 안 섹션 제목은 어느 화면이든 type-section 이다.',
            '표형 목록(공지·연구실·교과목)의 행 제목은 데스크톱에서 UI 글자, 모바일에서 항목 제목이다. 관리자 표는 UI 글자만, 피드형 목록(새 소식·세미나·검색)은 모든 폭에서 항목 제목이다.',
            '줄간격은 여러 줄로 읽는 본문(type-body)에만 준다. 나머지 역할은 1.2다.',
            '여러 줄로 읽히는 작은 보조 글(카드 설명·요약)만 type-meta 에 leading-normal(1.5)을 더한다.',
            '버튼·컨트롤의 높이는 줄높이가 아니라 높이 값으로 정한다.',
            '사이트 전체가 어절 단위로 줄을 바꾼다. 요소마다 break-keep 을 붙이지 않는다.',
            '좁은 칸에서 긴 URL·메일이 넘치면 그 요소에만 wrap-anywhere 를 쓴다. 영어 단어까지 자르는 break-all 은 쓰지 않는다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <div className="space-y-3">
                <p className="type-section">연락처</p>
                <p className="type-item">홍길동 교수</p>
              </div>
            ),
            caption: '인물 이름(항목 제목)은 그것을 담은 섹션 제목보다 작다.',
          }}
          bad={{
            example: (
              <div className="space-y-3">
                <p className="type-section">연락처</p>
                <p className="type-headline">홍길동 교수</p>
              </div>
            ),
            caption: '안에 든 이름이 섹션 제목보다 크다 — 위계가 뒤집힌다.',
          }}
        />
        <DoDont
          good={{
            example: <p className="w-44 type-body">{WRAP_SAMPLE}</p>,
            caption: '어절 단위로 줄을 바꾼다(사이트 기본).',
          }}
          bad={{
            example: (
              <p className="w-44 type-body" style={{ wordBreak: 'break-all' }}>
                {WRAP_SAMPLE}
              </p>
            ),
            caption: 'break-all — 낱말이 글자 중간에서 끊긴다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['color', '색'],
            ['spacing', '간격'],
            ['reading', '읽는 본문·이미지'],
            ['list', '목록·상태 화면'],
          ]}
        />
      </DocSection>
    </>
  );
}
