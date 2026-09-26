import type { ReactNode } from 'react';
import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
  SpecTable,
} from '../-components/doc';

// 간격 단계. Tailwind 단위(1 = 4px)로 쓴다. 이 밖의 값은 쓰지 않는다.
const STEPS = [
  {
    px: 4,
    unit: '1',
    role: '붙은 요소',
    use: '버튼 밖의 아이콘–글자(버튼 안은 Button 이 정한다), 날짜 · 작성자 사이',
  },
  {
    px: 8,
    unit: '2',
    role: '붙은 요소',
    use: '라벨–값, 태그 사이, 항목 제목 아래',
  },
  {
    px: 12,
    unit: '3',
    role: '가까운 요소',
    use: '버튼 사이, 목록 항목 안의 줄 사이',
  },
  {
    px: 16,
    unit: '4',
    role: '가까운 요소',
    use: '섹션 제목 아래, 카드 안쪽 여백',
  },
  {
    px: 24,
    unit: '6',
    role: '요소 사이',
    use: '목록 항목 사이, 카드 사이, 폼 필드 사이',
  },
  {
    px: 32,
    unit: '8',
    role: '묶음 사이',
    use: '목록 블록 위아래, 목록과 버튼 줄 사이',
  },
  {
    px: 48,
    unit: '12',
    role: '섹션 사이',
    use: '본문 안 섹션과 섹션 사이, 폼 묶음 사이',
  },
  {
    px: 64,
    unit: '16',
    role: '섹션 사이',
    use: '큰 구역 사이, 페이지 끝 여백(모바일)',
  },
  { px: 128, unit: '32', role: '페이지 끝', use: '페이지 끝 여백(데스크톱)만' },
];

function StepScale() {
  return (
    <div className="space-y-3">
      {STEPS.map((s) => (
        <div
          key={s.px}
          className="grid gap-1 sm:grid-cols-[20rem_minmax(0,1fr)] sm:items-center sm:gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="w-14 shrink-0 text-right type-meta">
              {s.px}
              <span className="text-neutral-500"> · {s.unit}</span>
            </span>
            <span
              className="h-4 shrink-0 bg-main-orange"
              style={{ width: s.px * 2 }}
            />
          </div>
          <p className="pl-18 type-meta text-neutral-500 sm:pl-0">
            <span className="type-label text-neutral-950">{s.role}</span> —{' '}
            {s.use}
          </p>
        </div>
      ))}
    </div>
  );
}

// 도식의 여백 띠. 실제 px 높이로 그리고 값을 적는다.
function Gap({ px, label }: { px: number; label?: string }) {
  return (
    <div
      className="relative flex items-center bg-main-orange/15"
      style={{ height: px }}
    >
      <span className="absolute -left-12 type-meta text-main-orange">{px}</span>
      {label && (
        <span className="absolute right-0 type-meta text-neutral-500">
          {label}
        </span>
      )}
    </div>
  );
}

function Diagram({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure>
      <div className="max-w-xl border border-neutral-200 py-8 pr-6 pl-16">
        {children}
      </div>
      <figcaption className="mt-2 type-meta text-neutral-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function RhythmDiagram() {
  return (
    <Diagram caption="읽는 화면의 리듬. 주황 띠가 여백이고 왼쪽 숫자가 px이다.">
      <div className="type-section">연구 분야</div>
      <Gap px={16} label="섹션 제목 아래" />
      <div className="type-body text-neutral-700">
        시스템, 이론, 인공지능, 응용의 네 영역에서 연구합니다.
      </div>
      <Gap px={32} label="묶음 사이" />
      {['시스템 소프트웨어', '인공지능과 기계학습'].map((name, i) => (
        <div key={name}>
          {i > 0 && <Gap px={24} label="목록 항목 사이" />}
          <div className="type-item">{name}</div>
          <Gap px={8} label="항목 제목 아래" />
          <div className="type-meta text-neutral-500">
            연구실 6곳 · 교수 8명
          </div>
        </div>
      ))}
      <Gap px={48} label="섹션 사이" />
      <div className="type-section">연구실 목록</div>
      <Gap px={16} />
      <div className="type-ui text-neutral-500">…</div>
    </Diagram>
  );
}

function FormDiagram() {
  return (
    <Diagram caption="폼의 리듬.">
      <div className="type-item">기본 정보</div>
      <Gap px={16} label="묶음 제목 아래" />
      {['제목', '작성자'].map((f, i) => (
        <div key={f}>
          {i > 0 && <Gap px={24} label="필드 사이" />}
          <div className="type-label">{f}</div>
          <Gap px={8} label="필드명 아래" />
          <div className="h-8 border border-neutral-300 bg-white" />
        </div>
      ))}
      <Gap px={48} label="묶음 사이" />
      <div className="type-item">첨부파일</div>
    </Diagram>
  );
}

// 이렇게·하지 않는다 도식: 제목과 두 줄, 다음 제목.
function Grouping({ even }: { even?: boolean }) {
  const near = even ? 'mt-4' : 'mt-2';
  const far = even ? 'mt-4' : 'mt-8';
  return (
    <div className="w-40">
      <div className="h-2.5 w-20 bg-neutral-700" />
      <div className={`${near} h-1.5 bg-neutral-300`} />
      <div className="mt-2 h-1.5 w-3/4 bg-neutral-300" />
      <div className={`${far} h-2.5 w-24 bg-neutral-700`} />
      <div className={`${near} h-1.5 bg-neutral-300`} />
    </div>
  );
}

export function SpacingSection() {
  return (
    <>
      <Lead>
        간격은 4px 단위 아홉 단계다. 관계가 가까울수록 작게, 멀수록 크게 두어
        무엇이 한 묶음인지 보이게 한다.
      </Lead>

      <DocSection title="값">
        <StepScale />
        <p className="type-meta text-neutral-500">
          px · Tailwind 단위(1 = 4px).
        </p>
        <RhythmDiagram />
        <FormDiagram />
        <SpecTable
          head={['값(px)', '단계', '자주 만나는 자리']}
          rows={[
            ['8', '붙은 요소', '폼 필드명 아래'],
            ['16', '가까운 요소', '섹션 제목 아래'],
            [
              '24',
              '요소 사이',
              '피드형 목록(새 소식·세미나·검색)의 항목 사이 — 구분선이면 선 위아래 24',
            ],
            ['24', '요소 사이', '폼 필드 사이'],
            ['32', '묶음 사이', '목록 블록 위아래'],
            [
              '48',
              '섹션 사이',
              '검색·필터와 결과 목록 사이(서로 다른 구역), 목록 아래 버튼 줄, 폼 묶음 사이',
            ],
            ['44', '행 높이', '표형 목록(공지·연구실·교과목)의 한 행'],
          ]}
        />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '단계 밖의 값(10·20·28·36px 등)은 쓰지 않고 가까운 단계를 쓴다.',
            '여백은 줄높이가 아니라 margin·gap·padding으로 준다.',
            '페이지 위아래 여백(모바일 32·64, 데스크톱 48·128)은 페이지 틀이 준다. 화면에서 다시 주지 않는다.',
            '메인·카테고리처럼 그래픽 화면의 고유 배치는 그 페이지가 정한다. 원과 선의 접합 보정값은 단계에 맞추지 않는다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <Grouping />,
            caption: '제목은 제 내용에 붙이고 다음 묶음과는 멀리 둔다.',
          }}
          bad={{
            example: <Grouping even />,
            caption:
              '모든 간격을 같게 둔다 — 제목이 어느 내용의 것인지 안 보인다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['layout', '레이아웃·반응형'],
            ['type', '글자'],
            ['list', '목록·상태 화면'],
            ['form', '입력·폼'],
            ['main', '메인·카테고리'],
          ]}
        />
      </DocSection>
    </>
  );
}
