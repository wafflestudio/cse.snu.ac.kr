import { Menu, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import PillGroup from '@/components/ui/PillGroup';
import {
  DocSection,
  Lead,
  Related,
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
          ariaLabel="화면 폭 고르기"
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

export function LayoutSection() {
  return (
    <>
      <Lead>화면 폭에 따라 틀이 두 번 바뀝니다.</Lead>

      <DocSection title="폭에 따라">
        <WidthExplorer />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '긴 문단은 읽기 폭 640px에서 멈춥니다. HTML 본문도 문단·목록·제목이 640px에서 멈춥니다.',
            '표·카드 격자·달력·폼은 읽기 폭에서 멈추지 않고 영역 전체를 씁니다. 배경 띠가 있는 메인·카테고리도 끝까지 찹니다.',
            '1024px부터 데스크톱 모양입니다. 1280px에서는 서브내비와 그 자리만 바뀝니다.',
            '폭에 따라 모양이 바뀌는 곳은 이 두 폭뿐입니다. 예외는 메인 뉴스 캐러셀의 카드 수 하나입니다.',
            '공개 화면은 320px부터, 행정실 편집·관리 화면은 1200px부터 맞춥니다.',
          ]}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['page', '페이지 틀'],
            ['navigation', '내비게이션·셸'],
            ['spacing', '간격'],
            ['reading', '읽는 본문·이미지'],
          ]}
        />
      </DocSection>
    </>
  );
}
