import type { ReactNode } from 'react';

// 간격 단계. Tailwind 단위(1 = 4px)로 쓴다. 이 밖의 값은 쓰지 않는다.
const STEPS = [
  {
    px: 4,
    cls: '1',
    role: '붙은 요소',
    use: '아이콘–글자, 날짜 · 작성자 사이',
  },
  {
    px: 8,
    cls: '2',
    role: '붙은 요소',
    use: '라벨–값, 태그 사이, 항목 제목 아래',
  },
  {
    px: 12,
    cls: '3',
    role: '가까운 요소',
    use: '버튼 사이, 목록 항목 안의 줄 사이',
  },
  {
    px: 16,
    cls: '4',
    role: '가까운 요소',
    use: '섹션 제목 아래, 카드 안쪽 여백',
  },
  {
    px: 24,
    cls: '6',
    role: '요소 사이',
    use: '목록 항목 사이, 카드 사이, 폼 필드 사이',
  },
  {
    px: 32,
    cls: '8',
    role: '묶음 사이',
    use: '목록 블록 위아래, 목록과 버튼 줄 사이',
  },
  {
    px: 48,
    cls: '12',
    role: '섹션 사이',
    use: '본문 안 섹션과 섹션 사이, 폼 묶음 사이',
  },
  {
    px: 64,
    cls: '16',
    role: '섹션 사이',
    use: '페이지 끝 여백(모바일), 큰 구역 사이',
  },
  {
    px: 128,
    cls: '32',
    role: '페이지 끝',
    use: '페이지 끝 여백(데스크톱)만',
  },
];

// 자주 만나는 자리의 정해진 값.
const RULES: { what: string; value: string }[] = [
  {
    what: '피드형 목록 항목 사이(새 소식·세미나·검색)',
    value: '24 (구분선이면 선 위아래 24)',
  },
  { what: '표형 목록 행 높이(공지·연구실·교과목)', value: '44 (h-11)' },
  { what: '목록 블록 위아래', value: '32' },
  {
    what: '검색·필터와 목록 사이',
    value: '48 (섹션 사이 — 검색 영역과 결과 목록은 다른 구역)',
  },
  { what: '목록 아래 버튼 줄', value: '48' },
  { what: '폼 필드 사이 / 폼 묶음 사이', value: '24 / 48' },
  { what: '폼 필드명 아래', value: '8' },
  { what: '섹션 제목 아래', value: '16' },
];

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
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

function Block({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function RhythmDiagram() {
  return (
    <div className="max-w-xl border border-neutral-200 py-8 pr-6 pl-16">
      <Block className="type-section">연구 분야</Block>
      <Gap px={16} label="섹션 제목 아래" />
      <Block className="type-body text-neutral-700">
        시스템, 이론, 인공지능, 응용의 네 영역에서 연구합니다.
      </Block>
      <Gap px={32} label="묶음 사이" />
      {['시스템 소프트웨어', '인공지능과 기계학습'].map((name, i) => (
        <div key={name}>
          {i > 0 && <Gap px={24} label="목록 항목 사이" />}
          <Block className="type-item">{name}</Block>
          <Gap px={8} label="항목 제목 아래" />
          <Block className="type-meta text-neutral-500">
            연구실 6곳 · 교수 8명
          </Block>
        </div>
      ))}
      <Gap px={48} label="섹션 사이" />
      <Block className="type-section">연구실 목록</Block>
      <Gap px={16} />
      <Block className="type-ui text-neutral-500">…</Block>
    </div>
  );
}

function FormDiagram() {
  return (
    <div className="max-w-xl border border-neutral-200 py-8 pr-6 pl-16">
      <Block className="type-item">기본 정보</Block>
      <Gap px={16} label="묶음 제목 아래" />
      {['제목', '작성자'].map((f, i) => (
        <div key={f}>
          {i > 0 && <Gap px={24} label="필드 사이" />}
          <Block className="type-label">{f}</Block>
          <Gap px={8} label="필드명 아래" />
          <div className="h-8 border border-neutral-300 bg-white" />
        </div>
      ))}
      <Gap px={48} label="묶음 사이" />
      <Block className="type-item">첨부파일</Block>
    </div>
  );
}

export function SpacingSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="단계">
        <p>
          4px 단위 아홉 단계다. 가까울수록 작게, 멀수록 크게 — 관계가 가까운
          것끼리 붙여 묶음이 보이게 한다. 이 밖의 값(10·20·28·36px 등)은 쓰지
          않고 가까운 단계를 쓴다. 여백은 줄높이가 아니라 margin·gap·padding으로
          준다.
        </p>
        <div className="space-y-2">
          {STEPS.map((s) => (
            <div key={s.px} className="flex items-center gap-4">
              <span className="w-10 shrink-0 text-right type-meta text-neutral-500">
                {s.px}
              </span>
              <span
                className="h-4 shrink-0 bg-main-orange"
                style={{ width: s.px * 2 }}
              />
              <code className="w-10 shrink-0 type-meta">{s.cls}</code>
              <span className="w-24 shrink-0 type-label">{s.role}</span>
              <span className="type-meta text-neutral-500">{s.use}</span>
            </div>
          ))}
        </div>
      </Sub>

      <Sub title="읽는 화면의 리듬">
        <p className="type-meta text-neutral-500">
          주황 띠가 여백이고 왼쪽 숫자가 px이다.
        </p>
        <RhythmDiagram />
      </Sub>

      <Sub title="폼의 리듬">
        <FormDiagram />
      </Sub>

      <Sub title="페이지 위아래">
        <ul className="list-disc space-y-1 pl-5">
          <li>제목 영역 아래 본문 시작: 모바일 32, 데스크톱 48.</li>
          <li>본문 끝: 모바일 64, 데스크톱 128.</li>
        </ul>
      </Sub>

      <Sub title="자리별 값">
        <table className="w-full max-w-3xl text-left">
          <tbody>
            {RULES.map((r) => (
              <tr key={r.what} className="border-b border-neutral-100">
                <td className="py-2 pr-4 type-ui">{r.what}</td>
                <td className="py-2 type-ui">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="type-meta text-neutral-500">
          메인·카테고리 같은 그래픽 화면의 고유 배치(메인 띠 안쪽 여백 등)는
          <a
            href="/design-system/main"
            className="underline underline-offset-2"
          >
            메인·카테고리 절
          </a>
          이 정한다. 그래픽 접합 보정값(원과 선의 위치)은 간격 단계에 맞추지
          않는다.
        </p>
      </Sub>
    </div>
  );
}
