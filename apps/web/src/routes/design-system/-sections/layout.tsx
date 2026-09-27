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
  prefix: string;
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
      prefix: '(없음)',
    };
  if (width < 1280)
    return {
      name: '데스크톱',
      nav: 100,
      left: 100,
      right: 100,
      subNav: false,
      prefix: 'sm:',
    };
  return {
    name: '데스크톱 + 서브내비',
    nav: 100,
    left: 100,
    right: 360,
    subNav: true,
    prefix: 'xl:',
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
  const scale = Math.min(1, box / width);
  const s = (v: number) => v * scale;
  const topBar = l.nav ? 120 : 68;

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

      <div ref={ref} className="w-full">
        <div
          className="flex overflow-hidden border border-neutral-300"
          style={{ width: s(width), height: s(640) }}
        >
          {l.nav > 0 && (
            <div
              className="shrink-0 bg-neutral-850"
              style={{ width: s(l.nav) }}
            />
          )}
          <div className="flex min-w-0 grow flex-col">
            <div
              className={l.nav ? 'bg-neutral-900' : 'bg-chrome-bar'}
              style={{ height: s(topBar) }}
            />
            <div className="bg-neutral-900" style={{ height: s(110) }} />
            <div
              className="relative grow bg-white"
              style={{ paddingLeft: s(l.left), paddingTop: s(48) }}
            >
              <div className="space-y-1" style={{ width: s(area) }}>
                <div
                  className="bg-neutral-300 px-1 text-[10px] leading-4 text-neutral-800"
                  style={{ width: s(reading), minHeight: s(90) }}
                >
                  문단 {reading}
                </div>
                <div
                  className="bg-neutral-100 px-1 text-[10px] leading-4 text-neutral-700"
                  style={{ minHeight: s(120) }}
                >
                  표·카드 {area}
                </div>
              </div>
              {l.subNav && (
                <div
                  className="absolute border-l-2 border-main-orange"
                  style={{
                    left: s(l.nav ? width - l.nav - l.right + 64 : 0),
                    top: s(48),
                    height: s(220),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <SpecTable
        head={['항목', `${width}px`, '']}
        rows={[
          ['배치', l.name, `클래스 접두사 ${l.prefix}`],
          [
            '본문 여백',
            l.subNav ? `왼 ${l.left} · 오른 ${l.right}` : `좌우 ${l.left}`,
            l.subNav ? '오른쪽 360 이 서브내비 자리' : '',
          ],
          ['표·카드', `${area}`, '본문 영역 전체 — 상한 없음'],
          ['문단', `${reading}`, '읽기 폭 640 에서 멈춘다'],
        ]}
      />
    </div>
  );
}

export function LayoutSection() {
  return (
    <>
      <Lead>화면 폭에 따라 틀이 두 번 바뀐다.</Lead>

      <DocSection title="폭에 따라">
        <WidthExplorer />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '긴 문단은 읽기 폭(max-w-160, 640px)으로 감싼다. HTML 본문은 문단·목록·제목이 스스로 640px에서 멈춘다.',
            '표·카드 격자·달력·폼은 읽기 폭을 받지 않고 영역 전체를 쓴다. 배경 띠가 있는 메인·카테고리도 끝까지 찬다.',
            '데스크톱 모양은 sm:(1024px)로 쓴다. xl:(1280px)은 서브내비와 그 자리에만 쓴다.',
            'md:·lg:와 임의 브레이크포인트는 쓰지 않는다. 예외는 메인 뉴스 캐러셀의 카드 수 하나다.',
            'JS로 갈라야 할 때만 useIsMobile()(1024px 미만)을 쓴다. 보이기만 다른 분기는 CSS로 한다.',
            '공개 화면은 320px부터, 행정실 편집·관리 화면은 1200px부터 맞춘다.',
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
