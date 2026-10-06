import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';
import { DocSection, DoDont, Lead, RuleList } from '../-components/doc';

// 셸 조각을 같은 값의 div 로 그린다(경로 그래픽은 실제 Node). 실제는 PageTitle·LeftNav·SubNavbar·Footer.
// 경로의 줄바꿈·서브내비의 자리·푸터의 열은 셸이 정한다. 짜는 사람이 고르는 것만 적는다.

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
      {/* 실제 곡선 그래픽(Node). 원·선이 남은 자리를 채우고 사선은 그대로 이어진다. */}
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
        헤더부터 푸터까지 셸은 <code>PageLayout</code>이 구성합니다.
      </Lead>

      <DocSection title="구성">
        <div className="flex flex-wrap gap-6">
          <Phone w={390}>
            <Crumbs items={CRUMBS_KO} />
          </Phone>
          <Phone w={320}>
            <Crumbs items={CRUMBS_EN} />
          </Phone>
        </div>
        <p className="type-meta text-neutral-500">
          경로: 항목 안에서는 줄을 바꾸지 않고 항목 단위로 넘어갑니다. 곡선
          그래픽은 마지막 항목 뒤의 남은 자리를 채웁니다.
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
            왼쪽 내비의 막대와 펼침 패널. 모바일 메뉴도 같은 색이고, 색 페이지의
            알려진 예외입니다.
          </figcaption>
        </figure>
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '형제 페이지가 있는 읽기 화면에는 본문 오른쪽에 서브내비를 둡니다. 같은 묶음의 다른 페이지로 바로 갈 수 있습니다.',
            '편집·작성 화면에는 서브내비를 두지 않습니다. 누르면 작성 중인 글을 벗어납니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <Screen title="전공 이수 추가" subnav={false} />,
            caption:
              '작성 화면에는 서브내비가 없어 작성 중에 벗어나지 않습니다.',
          }}
          bad={{
            example: <Screen title="전공 이수 추가" subnav />,
            caption:
              '예전 전공 이수 추가 화면에만 서브내비가 있어, 형제 작성 화면끼리 틀이 달랐고 누르면 작성 중인 글을 벗어났습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
