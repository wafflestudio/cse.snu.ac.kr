import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import Node from '@/components/ui/Nodes';

// 셸 조각을 같은 값의 div 로 그린다(경로 그래픽은 실제 Node). 실제는 PageTitle·LeftNav·SubNavbar·Footer.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

const CRUMBS_KO = ['시설 예약', '세미나실 예약', '301-417 (20석)'];
const CRUMBS_EN = ['Reservations', 'Seminar Room', '301-417 (20 seats)'];

// 오른쪽 곡선 그래픽(원 + 선 + 사선)
function Graphic({ diagonal }: { diagonal: boolean }) {
  return (
    <span className="flex min-w-8 grow items-center">
      <span className="size-2.5 shrink-0 rounded-full border border-neutral-400" />
      <span className="h-px grow bg-neutral-500" />
      {diagonal && (
        <span className="h-px w-10 shrink-0 translate-x-[-6px] translate-y-3 rotate-45 bg-neutral-500 sm:w-16" />
      )}
    </span>
  );
}

function CrumbsNow({ items }: { items: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <ol className="flex items-center gap-1 type-meta text-neutral-300">
        {items.map((x, i) => (
          <Fragment key={x}>
            {i > 0 && <ChevronRight className="shrink-0" />}
            <li className="text-center">{x}</li>
          </Fragment>
        ))}
      </ol>
      <span className="flex w-40 shrink-0 items-center">
        <Graphic diagonal />
      </span>
    </div>
  );
}

function CrumbsNext({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 type-meta text-neutral-300">
      {/* 화살표는 뒤 항목에 붙여 함께 줄을 바꾼다. */}
      {items.map((x, i) => (
        <span key={x} className="flex items-center gap-1 whitespace-nowrap">
          {i > 0 && <ChevronRight className="shrink-0" />}
          {x}
        </span>
      ))}
      {/* 실제 곡선 그래픽(Node) — 원·선이 남은 자리를 채우고 사선은 그대로 이어진다. */}
      <span className="ml-1 flex min-w-32 grow">
        <Node variant="curvedHorizontalGray" />
      </span>
    </div>
  );
}

function Phone({ w, children }: { w: number; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <div
        className={clsx(
          'overflow-hidden bg-neutral-900 px-5 py-4',
          w === 390 ? 'w-[390px]' : 'w-[320px]',
        )}
      >
        {children}
      </div>
      <p className="type-meta text-neutral-500">{w}px</p>
    </div>
  );
}

export function NavigationSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="경로(breadcrumb)">
        <div className="flex flex-wrap gap-6">
          <div className="space-y-3">
            <p className="type-meta text-neutral-500">전</p>
            <Phone w={390}>
              <CrumbsNow items={CRUMBS_KO} />
            </Phone>
            <Phone w={320}>
              <CrumbsNow items={CRUMBS_EN} />
            </Phone>
          </div>
          <div className="space-y-3">
            <p className="type-meta text-neutral-500">지금</p>
            <Phone w={390}>
              <CrumbsNext items={CRUMBS_KO} />
            </Phone>
            <Phone w={320}>
              <CrumbsNext items={CRUMBS_EN} />
            </Phone>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            항목 안에서는 줄을 바꾸지 않는다("시설 예 / 약" 없음). 자리가
            모자라면 항목 단위로 다음 줄로 넘어가고, 왼쪽 정렬이다(가운데 정렬
            없음).
          </li>
          <li>
            오른쪽 곡선 그래픽(원·선·사선)은 마지막 항목 뒤에서 남은 자리를
            채운다. 사선은 모바일 48·데스크톱 90. 자리가 없으면 마지막 항목과
            함께 다음 줄로 간다. 화살표는 뒤 항목에 붙는다.
          </li>
        </ul>
      </Sub>

      <Sub title="왼쪽 내비 — 펼침 패널">
        <div className="flex flex-wrap gap-6">
          {[
            [
              '지금',
              'bg-chrome-menu',
              'bg-neutral-850',
              '사이드바 #323235 · 패널 #1e1e1e',
            ],
            [
              '맞바꿈',
              'bg-neutral-850',
              'bg-chrome-menu',
              '사이드바 #1e1e1e · 패널 #323235',
            ],
          ].map(([name, side, panel, note]) => (
            <div key={name} className="space-y-1">
              <div className="flex h-32 w-80">
                <div
                  className={clsx(
                    'flex w-20 flex-col items-center gap-3 pt-4 type-meta text-neutral-400',
                    side,
                  )}
                >
                  <span>소개</span>
                  <span className="text-white">연구</span>
                  <span>입학</span>
                </div>
                <div
                  className={clsx(
                    'flex w-40 flex-col gap-3 pt-4 pl-6 type-meta text-white',
                    panel,
                  )}
                >
                  <span>연구·교육 스트림</span>
                  <span>연구 센터</span>
                </div>
                <div className="flex-1 bg-neutral-900" />
              </div>
              <p className="type-meta text-neutral-500">
                {name}: {note}
              </p>
            </div>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            사이드바는 neutral-850(#1e1e1e), 그 위에 펼쳐지는 패널은
            chrome-menu(#323235) — 위로 올라온 면이 더 밝다(1-2 면 규칙). 전에는
            반대라 패널이 뒤로 물러나 보였다. 새 색 없이 두 색의 자리만 바꿨다.
            모바일 메뉴의 목록·펼침도 같다.
          </li>
        </ul>
      </Sub>

      <Sub title="오른쪽 서브내비">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            세로 곡선은 항목 목록의 높이에 맞춰 늘어난다. 항목 수별 높이를 적지
            않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="푸터">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            링크 열은 글 길이만큼 넓고, 열 사이는 간격으로 정한다(모바일 24·
            데스크톱 48). 열 폭을 적지 않는다 — 번역·링크가 바뀌어도 틀어지지
            않는다. 자리가 모자랄 때만 열 안에서 줄을 바꾼다(영어 390의 긴
            링크).
          </li>
          <li>
            제작진 소개는 역할별 이름 목록(가운뎃점으로 이은 글)이다 — 태그
            모양을 쓰지 않는다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
