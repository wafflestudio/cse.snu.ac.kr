import clsx from 'clsx';
import { Menu, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import PillGroup from '@/components/ui/PillGroup';
import {
  DocSection,
  DoDont,
  KnownGap,
  Lead,
  RuleList,
  SpecTable,
} from '../-components/doc';

// 읽기 폭: 문단·HTML 본문의 한 줄 상한(14px 본문 약 62자).
const READING = 640;

type Layout = {
  name: string;
  nav: number; // 왼쪽 내비 폭
  left: number; // 본문 왼쪽 여백
  right: number; // 본문 오른쪽 여백(서브내비 자리 포함)
  subNav: boolean;
  note: string; // 이 폭에서 보이는 틀
};

// 화면 폭 → 틀. 본문 영역에는 상한이 없다.
function layoutAt(width: number): Layout {
  if (width < 1024)
    return {
      name: '모바일',
      nav: 0,
      left: 20,
      right: 20,
      subNav: false,
      note: '1024 미만은 위쪽 바와 펼침 메뉴',
    };
  if (width < 1280)
    return {
      name: '데스크톱',
      nav: 100,
      left: 100,
      right: 100,
      subNav: false,
      note: '1024부터 왼쪽 내비',
    };
  return {
    name: '데스크톱 + 서브내비',
    nav: 100,
    left: 100,
    right: 360,
    subNav: true,
    note: '1280부터 오른쪽에 서브내비',
  };
}

const PRESETS = [
  { value: '390', label: '390 휴대폰' },
  { value: '820', label: '820 태블릿' },
  { value: '1024', label: '1024' },
  { value: '1280', label: '1280' },
  { value: '1440', label: '1440 데스크톱' },
  { value: '1920', label: '1920' },
] as const;

const STAGE_H = 440; // 견본 무대의 높이(고정)
const SCREEN_H = 820; // 그리는 화면의 실제 높이

const ROWS = [
  ['2026학년도 2학기 수강신청 안내', '2026/9/26', '312'],
  ['대학원 논문 심사 일정', '2026/9/24', '198'],
  ['장학금 신청 공지', '2026/9/20', '1,024'],
  ['연구실 안전 교육 안내', '2026/9/18', '87'],
];

const SUBNAV = ['공지사항', '새 소식', '세미나', '신임교수초빙'];

// 실제 크기로 그린 공지사항 화면 한 장. 틀(내비·여백·서브내비)만 폭에 따라 바뀐다.
function MiniPage({
  width,
  layout: l,
  area,
  reading,
}: {
  width: number;
  layout: Layout;
  area: number;
  reading: number;
}) {
  const desktop = l.nav > 0;
  return (
    <div className="flex h-full overflow-hidden bg-white">
      {desktop && (
        <div className="flex w-25 shrink-0 flex-col items-center gap-10 bg-neutral-850 pt-12">
          <span className="size-12 rounded-full border-2 border-main-orange" />
          {['소개', '소식', '구성원', '연구', '입학', '학사'].map((m) => (
            <span key={m} className="type-meta text-neutral-400">
              {m}
            </span>
          ))}
        </div>
      )}
      <div className="flex min-w-0 grow flex-col">
        {desktop ? (
          <div className="flex h-30 items-start justify-between bg-neutral-900 px-15 pt-12">
            <div>
              <p className="type-item text-white">서울대학교 컴퓨터공학부</p>
              <p className="type-meta text-neutral-300">
                Dept. of Computer Science and Engineering
              </p>
            </div>
            <div className="flex items-center gap-4 type-meta text-white">
              STAFF · ENG
              <span className="flex h-8 w-54 items-center justify-end rounded-xs bg-neutral-100 px-2">
                <Search className="size-4 text-neutral-700" />
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-17 items-center justify-between bg-chrome-bar px-5">
            <span className="flex items-center gap-2 type-label text-white">
              <span className="size-8 rounded-full border-2 border-main-orange" />
              서울대학교 컴퓨터공학부
            </span>
            <Menu className="size-6 text-white" />
          </div>
        )}
        <div
          className="bg-neutral-900 pt-10 pb-8"
          style={{ paddingLeft: l.left, paddingRight: l.left }}
        >
          <p className="mb-2 type-meta text-neutral-300">소식 › 공지사항</p>
          <p className="type-page-title text-white">공지사항</p>
        </div>
        <div
          className="relative grow"
          style={{ paddingLeft: l.left, paddingTop: desktop ? 48 : 32 }}
        >
          <div className="relative" style={{ width: area }}>
            <Measure label={`문단(읽기 폭 ${reading})`} width={reading}>
              <p className="type-body text-neutral-800">
                컴퓨터공학부 공지사항입니다. 학사 일정과 장학, 행사 소식을
                이곳에서 알립니다. 긴 문단은 읽기 폭에서 멈추고, 표와 카드는
                본문 영역을 다 씁니다.
              </p>
            </Measure>
            <div className="mt-8">
              <Measure label={`표(본문 영역 ${area})`} width={area}>
                <div className="border-y border-neutral-200 type-ui">
                  {desktop && (
                    <div className="flex h-11 items-center border-b border-neutral-200 px-3 type-label">
                      <span className="grow">제목</span>
                      <span className="w-28">날짜</span>
                      <span className="w-14">조회</span>
                    </div>
                  )}
                  {ROWS.map(([t, d, v]) =>
                    desktop ? (
                      <div
                        key={t}
                        className="flex h-11 items-center px-3 odd:bg-neutral-50"
                      >
                        <span className="grow truncate">{t}</span>
                        <span className="w-28 text-neutral-600">{d}</span>
                        <span className="w-14 text-neutral-600">{v}</span>
                      </div>
                    ) : (
                      <div key={t} className="px-6 py-4 odd:bg-neutral-50">
                        <p className="type-item">{t}</p>
                        <p className="mt-2 type-meta text-neutral-500">
                          {d} · 조회 {v}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </Measure>
            </div>
          </div>
          {l.subNav && (
            <div
              className="absolute top-12 border-l-2 border-main-orange pl-4"
              style={{ left: width - l.nav - l.right + 64 }}
            >
              <p className="mb-4 type-item">소식</p>
              {SUBNAV.map((m, i) => (
                <p
                  key={m}
                  className={`mb-3 type-ui ${i === 0 ? 'font-bold text-main-orange' : 'text-neutral-700'}`}
                >
                  {m}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 폭 표시: 요소 위에 주황 점선과 이름표를 얹는다.
function Measure({
  label,
  width,
  children,
}: {
  label: string;
  width: number;
  children: ReactNode;
}) {
  return (
    <div className="relative pt-6" style={{ width }}>
      <span className="absolute top-0 left-0 bg-main-orange px-1.5 type-meta text-white">
        {label}
      </span>
      <div className="outline-2 outline-offset-4 outline-main-orange/60 outline-dashed">
        {children}
      </div>
    </div>
  );
}

// 폭을 움직이면 축소한 페이지 틀과 값이 그 폭의 모양으로 바뀐다.
function WidthExplorer() {
  const [width, setWidth] = useState(1440);
  const [box, setBox] = useState(880);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const l = layoutAt(width);
  const area = width - l.nav - l.left - l.right;
  const reading = Math.min(area, READING);
  // 폭이 다 들어가고 높이가 무대에 들어가는 쪽으로 줄인다.
  const scale = Math.min(1, box / width, STAGE_H / SCREEN_H);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <input
          type="range"
          min={320}
          max={1920}
          step={10}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          aria-label="화면 폭"
          className="w-full accent-neutral-700"
        />
        <PillGroup
          ariaLabel="화면 폭 선택"
          options={PRESETS}
          value={
            (PRESETS.find((p) => Number(p.value) === width)?.value ??
              '') as (typeof PRESETS)[number]['value']
          }
          onChange={(v) => setWidth(Number(v))}
        />
      </div>

      {/* 높이는 고정이다. 폭을 바꿔도 아래 내용이 움직이지 않는다. 실제 크기로 그린 화면을 통째로 줄인다. */}
      <div
        ref={ref}
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{ height: STAGE_H }}
      >
        <div
          className="absolute top-0 origin-top-left border border-neutral-300"
          style={{
            left: Math.max(0, (box - width * scale) / 2),
            width,
            height: SCREEN_H,
            transform: `scale(${scale})`,
          }}
        >
          <MiniPage width={width} layout={l} area={area} reading={reading} />
        </div>
      </div>

      <SpecTable
        head={['항목', `${width}px`, '']}
        rows={[
          ['배치', l.name, l.note],
          [
            '본문 여백',
            l.subNav ? `왼 ${l.left} · 오른 ${l.right}` : `좌우 ${l.left}`,
            l.subNav ? '오른쪽 360 이 서브내비 자리' : '',
          ],
          ['표·카드', `${area}`, '본문 영역 전체, 상한 없음'],
          ['문단', `${reading}`, '읽기 폭 640 에서 멈춥니다'],
        ]}
      />
    </div>
  );
}

// 페이지 구성 견본: 실제 크기로 그린 화면을 줄여 보인다. 여백 자리에 주황 치수를 얹는다.
type Device = 'mobile' | 'desktop';
const PAGE_W: Record<Device, number> = { mobile: 390, desktop: 1340 };

const G: Record<Device, { x: number; top: number; bottom: number }> = {
  mobile: { x: 20, top: 32, bottom: 64 },
  desktop: { x: 100, top: 48, bottom: 128 },
};

// 여백 치수: 주어진 높이의 주황 띠와 값.
function Dim({ h, label, w }: { h: number; label: string; w?: number }) {
  return (
    <div
      className="flex items-center justify-end border-y border-dashed border-main-orange bg-main-orange/10 pr-2 text-[20px] font-bold text-main-orange"
      style={{ height: h, width: w }}
    >
      {label}
    </div>
  );
}

function PageTitleBand({
  crumb,
  title,
  d,
}: {
  crumb: string;
  title: string;
  d: Device;
}) {
  return (
    <div className="bg-neutral-900 pt-10 pb-8" style={{ paddingLeft: G[d].x }}>
      <p className="mb-2 type-meta text-neutral-300">{crumb}</p>
      <p className="type-page-title text-white">{title}</p>
    </div>
  );
}

function FooterStrip() {
  return (
    <div className="flex h-24 items-center bg-neutral-50 px-10 type-meta text-neutral-500">
      푸터
    </div>
  );
}

function SubNavMock({ d, items }: { d: Device; items: string[] }) {
  if (d === 'mobile') return null;
  return (
    <div
      className="absolute top-12 border-l-2 border-main-orange pl-4"
      style={{ left: PAGE_W.desktop - 360 + 64 }}
    >
      {items.map((m, i) => (
        <p
          key={m}
          className={clsx(
            'mb-3 type-ui',
            i === 0 ? 'font-bold text-main-orange' : 'text-neutral-700',
          )}
        >
          {m}
        </p>
      ))}
    </div>
  );
}

function BasicPage({ d }: { d: Device }) {
  const g = G[d];
  const areaW = PAGE_W[d] - g.x * 2 - (d === 'desktop' ? 260 : 0);
  return (
    <div className="bg-white">
      <PageTitleBand crumb="소개" title="학부장 인사말" d={d} />
      <div className="relative">
        <Dim h={g.top} label={`위 ${g.top}`} />
        <div
          className="flex gap-8"
          style={{ paddingLeft: g.x, width: g.x + areaW }}
        >
          <div className="h-44 w-32 shrink-0 bg-neutral-200" />
          <p className="type-body text-neutral-800">
            컴퓨터공학부 홈페이지를 찾아 주셔서 감사합니다. 학부는 교육과 연구로
            우리 사회의 내일을 준비합니다. 학생과 교수, 직원이 함께 만드는
            학부의 소식을 이곳에서 전합니다.
          </p>
        </div>
        <Dim h={g.bottom} label={`아래 ${g.bottom}`} />
        <SubNavMock d={d} items={['학부장 인사말', '연혁', '연락처']} />
      </div>
      <FooterStrip />
    </div>
  );
}

function BandsPage({ d }: { d: Device }) {
  const g = G[d];
  const areaW = PAGE_W[d] - g.x * 2 - (d === 'desktop' ? 260 : 0);
  const tabs = ['시스템', '이론', '인공지능', '응용'];
  return (
    <div className="bg-white">
      <PageTitleBand crumb="연구·교육" title="연구·교육 스트림" d={d} />
      <div className="relative">
        <div className="bg-white">
          <Dim h={g.top} label={`위 ${g.top}`} />
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            style={{
              marginLeft: g.x,
              width: areaW,
              gridTemplateColumns:
                d === 'desktop'
                  ? 'repeat(4,minmax(0,1fr))'
                  : 'repeat(2,minmax(0,1fr))',
            }}
          >
            {tabs.map((t, i) => (
              <span
                key={t}
                className={clsx(
                  'flex h-10 items-center justify-center type-label',
                  i === 0
                    ? 'bg-main-orange text-white'
                    : 'bg-neutral-100 text-neutral-700',
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <Dim h={48} label="아래 48" w={g.x + areaW} />
        </div>
        <div className="bg-neutral-100">
          <Dim h={g.top} label={`위 ${g.top}`} />
          <div style={{ marginLeft: g.x, width: areaW }}>
            <div className="mb-4 w-fit">
              <p className="px-3 type-section">시스템 스트림</p>
              <Node variant="straight" />
            </div>
            <div className="bg-white p-6 type-body text-neutral-800">
              시스템 소프트웨어와 컴퓨터 구조를 연구합니다.
            </div>
          </div>
          <Dim h={g.bottom} label={`아래 ${g.bottom}`} />
        </div>
        <SubNavMock
          d={d}
          items={['연구·교육 스트림', '연구 센터', '연구실 목록']}
        />
      </div>
      <FooterStrip />
    </div>
  );
}

// 줄인 무대. 폭은 칸에 맞추고 높이는 그린 화면 높이 × 배율이다(전환이 없어 바뀌지 않는다).
function Stage({ d, children }: { d: Device; children: ReactNode }) {
  const [box, setBox] = useState(0);
  const [inner, setInner] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const inEl = innerRef.current;
    if (!el || !inEl) return;
    const ro = new ResizeObserver(() => {
      setBox(el.clientWidth);
      setInner(inEl.offsetHeight);
    });
    ro.observe(el);
    ro.observe(inEl);
    return () => ro.disconnect();
  }, []);
  const w = PAGE_W[d];
  const scale = box ? Math.min(1, box / w) : 0;
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: inner * scale }}
    >
      <div
        ref={innerRef}
        className="absolute top-0 left-0 origin-top-left border border-neutral-300"
        style={{ width: w, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

function PageComposition() {
  const pages = [
    ['기본 틀: 본문이 한 덩어리인 화면(학부장 인사말)', BasicPage],
    ['띠 틀: 흰 띠와 회색 띠로 나뉜 화면(연구·교육 스트림)', BandsPage],
  ] as const;
  return (
    <div className="space-y-12">
      {pages.map(([caption, Page]) => (
        <figure key={caption} className="space-y-3">
          <figcaption className="type-label">{caption}</figcaption>
          <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <div className="space-y-2">
              <Stage d="desktop">
                <Page d="desktop" />
              </Stage>
              <p className="type-meta text-neutral-500">데스크톱 1440</p>
            </div>
            <div className="space-y-2">
              <Stage d="mobile">
                <Page d="mobile" />
              </Stage>
              <p className="type-meta text-neutral-500">모바일 390</p>
            </div>
          </div>
        </figure>
      ))}
    </div>
  );
}

// 선택형 상세 제목 도식. 실제 SelectionTitle 과 같은 값.
function SelTitle({ actions }: { actions?: boolean }) {
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-3">
      <div className="w-fit">
        <p className="px-3 type-section">시스템 스트림</p>
        <Node variant="straight" />
      </div>
      {actions && (
        <div className="ml-auto flex gap-3">
          <Button variant="secondary">삭제</Button>
          <Button variant="secondary">편집</Button>
        </div>
      )}
    </div>
  );
}

// Do · Don't 견본: 제목 영역 아래 첫 요소(선택 탭)까지의 여백. 실제 px 의 절반으로 그린다.
function TopGap({ doubled = false }: { doubled?: boolean }) {
  const band = (label: string) => (
    <div className="flex h-6 items-center justify-end border-y border-dashed border-main-orange bg-main-orange/10 pr-2 type-meta text-main-orange">
      {label}
    </div>
  );
  return (
    <div className="w-56">
      <div className="h-8 bg-neutral-900" />
      {band('틀 48')}
      {doubled && band('탭 48')}
      <div className="grid grid-cols-2 gap-2">
        <span className="flex h-7 items-center justify-center bg-main-orange type-meta text-white">
          시스템
        </span>
        <span className="flex h-7 items-center justify-center bg-neutral-100 type-meta">
          이론
        </span>
      </div>
    </div>
  );
}

export function LayoutSection() {
  return (
    <>
      <Lead>
        화면 폭에 따라 틀이 두 번 변경되고, 그 안의 본문은 PageLayout 하나로
        구성합니다.
      </Lead>

      <DocSection title="폭에 따라">
        <WidthExplorer />
      </DocSection>

      <DocSection title="폭에 따른 원칙">
        <RuleList
          items={[
            '긴 문단과 HTML 본문은 읽기 폭 640(14px 약 62자)에서 멈춥니다. 줄이 길면 다음 줄 첫머리를 찾기 어렵습니다.',
            '표·카드 격자·달력·폼은 본문 영역 전체를 씁니다. 칸이 많은 것을 좁히면 줄바꿈만 늘어납니다.',
            '모양은 1024(데스크톱 틀)와 1280(서브내비)에서만 바꿉니다. 바뀌는 폭이 늘면 확인할 화면도 늘어납니다.',
            '공개 화면은 320부터, 편집·관리 화면은 1200부터 지원합니다. 편집은 행정실이 데스크톱에서만 합니다.',
          ]}
        />
        <KnownGap>
          메인 새 소식 캐러셀의 카드 수만 이 두 폭 밖에서 바뀝니다.
        </KnownGap>
      </DocSection>

      <DocSection title="틀">
        <PageComposition />
        <p className="type-meta text-neutral-500">
          주황 띠가 틀이 정한 여백입니다. 오른쪽 목록은 서브내비입니다.
        </p>
        <RuleList
          items={[
            '본문이 한 덩어리면 기본 틀, 성격이 다른 묶음이 이어지면 흰·회색 띠로 나눈 띠 틀입니다(학부 소개·연구 스트림). 띠 색이 바뀌는 곳에서 묶음이 바뀝니다.',
            '위아래 여백은 틀이 주므로 화면에서 더하지 않습니다. 더하면 화면마다 첫 줄 위치가 달라집니다.',
            '선택 탭 위에 관리 버튼이 있으면 버튼 아래를 32로 둡니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <SelTitle actions />,
            caption:
              '관리 버튼은 고치는 대상의 제목 옆에 두고, 자리가 모자라면 다음 줄 오른쪽으로 내립니다.',
          }}
          bad={{
            example: (
              <div className="w-full space-y-8">
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">삭제</Button>
                  <Button variant="secondary">편집</Button>
                </div>
                <SelTitle />
              </div>
            ),
            caption:
              '예전 연구 스트림·연구 센터는 제목 위에 버튼 줄이 따로 있어, 무엇을 고치는 버튼인지 떨어져 보였습니다.',
          }}
        />
        <DoDont
          good={{
            example: <TopGap />,
            caption: '첫 요소 위 여백은 틀이 주는 48 하나입니다.',
          }}
          bad={{
            example: <TopGap doubled />,
            caption:
              '예전 관리자·찾아오는 길은 선택 탭이 자기 위 여백을 더해 틀 여백과 겹쳤습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
