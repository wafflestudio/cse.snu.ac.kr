import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';
import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 셸 조각을 같은 값의 div 로 그린다(경로 그래픽은 실제 Node). 실제는 PageTitle·LeftNav·SubNavbar·Footer.
// 경로의 줄바꿈·서브내비의 자리·푸터의 열은 셸이 정한다 — 짜는 사람이 고르는 것만 적는다.

const CRUMBS_KO = ['시설 예약', '세미나실 예약', '301-417 (20석)'];
const CRUMBS_EN = ['Reservations', 'Seminar Room', '301-417 (20 seats)'];

function Crumbs({ items }: { items: string[] }) {
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
      <span className="ml-1 flex min-w-14 grow">
        <Node variant="curvedHorizontalGray" />
      </span>
    </div>
  );
}

function Phone({ w, children }: { w: number; children: ReactNode }) {
  return (
    <div className="max-w-full space-y-1">
      <div
        className={clsx(
          'max-w-full overflow-hidden bg-neutral-900 px-5 py-4',
          w === 390 ? 'w-[390px]' : 'w-[320px]',
        )}
      >
        {children}
      </div>
      <p className="type-meta text-neutral-500">{w}px</p>
    </div>
  );
}

// 본문 + 오른쪽 서브내비 도식.
function Screen({ title, subnav }: { title: string; subnav: boolean }) {
  return (
    <div className="flex h-28 w-full max-w-64 border border-neutral-300 bg-white">
      <div className="flex-1 space-y-2 p-3">
        <p className="type-label">{title}</p>
        <div className="h-5 border border-neutral-300" />
        <div className="h-5 border border-neutral-300" />
      </div>
      {subnav && (
        <div className="w-20 space-y-1 border-l-2 border-main-orange/60 p-2 type-meta text-neutral-500">
          <p className="text-main-orange">공지사항</p>
          <p>새 소식</p>
          <p>세미나</p>
        </div>
      )}
    </div>
  );
}

export function NavigationSection() {
  return (
    <>
      <Lead>
        헤더부터 푸터까지 셸은 <code>PageLayout</code>이 그린다.
      </Lead>

      <DocSection title="짜임">
        <div className="flex flex-wrap gap-6">
          <Phone w={390}>
            <Crumbs items={CRUMBS_KO} />
          </Phone>
          <Phone w={320}>
            <Crumbs items={CRUMBS_EN} />
          </Phone>
        </div>
        <p className="type-meta text-neutral-500">
          경로: 항목 안에서는 줄을 바꾸지 않고 항목 단위로 넘어간다. 곡선
          그래픽은 마지막 항목 뒤의 남은 자리를 채운다.
        </p>
        <figure>
          <div className="flex h-32 w-full max-w-80">
            <div className="flex w-20 flex-col items-center gap-3 bg-chrome-menu pt-4 type-meta text-neutral-400">
              <span>소개</span>
              <span className="text-white">연구</span>
              <span>입학</span>
            </div>
            <div className="flex w-40 flex-col gap-3 bg-neutral-850 pt-4 pl-6 type-meta text-white">
              <span>연구·교육 스트림</span>
              <span>연구 센터</span>
            </div>
            <div className="flex-1 bg-neutral-900" />
          </div>
          <figcaption className="mt-2 type-meta text-neutral-500">
            왼쪽 내비: 사이드바는 chrome-menu, 펼쳐지는 패널은 neutral-850.
            모바일 메뉴의 목록·펼침도 같다 — 색 페이지의 면 규칙(올라온 면이 더
            밝다)의 예외다.
          </figcaption>
        </figure>
      </DocSection>

      <DocSection title="규칙">
        <RuleList
          items={[
            '형제 페이지가 있는 읽는 화면은 PageLayout에 서브내비(subNav)를 넘긴다.',
            '서브내비의 자리·높이는 틀이 정한다 — 화면에서 옮기거나 본문 높이를 맞추지 않는다.',
            '경로는 메뉴(내비게이션 정의)에서 만든다. 새 화면은 메뉴에 올리면 경로가 따라온다.',
            '왼쪽 내비·모바일 메뉴는 면 규칙의 예외다 — 막대가 chrome-menu, 펼침 패널이 neutral-850(바꿔 보니 어색했다).',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <Screen title="공지 편집" subnav={false} />,
            caption: '편집·작성 화면에는 서브내비를 두지 않는다.',
          }}
          bad={{
            example: <Screen title="공지 편집" subnav />,
            caption:
              '편집 중에 형제 페이지 링크를 둔다 — 누르면 쓰던 글을 떠난다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['page', '페이지 틀'],
            ['layout', '레이아웃·반응형'],
            ['color', '색'],
            ['graphic', '그래픽'],
          ]}
        />
      </DocSection>
    </>
  );
}
